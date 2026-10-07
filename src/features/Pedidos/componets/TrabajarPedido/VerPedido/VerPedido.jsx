import "./VerPedido.css";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { usePedidos } from "../../../querys/usePedidos";
import { useCuentas } from "../../../../Cuentas/querys/useCuentas";

import ModalConfirmar from "../ModalConfirmar/ModalConfirmar";
import { ArrowLeft, CreditCard, Shirt, Eye, Ghost, WalletCards } from "lucide-react";

export default function VerPedido() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [estadoDelModal, setEstadoDelModal] = useState(false);
  const [estadoActual, setEstadoActual] = useState(null);
  const {data: datosDePedidos = [], isLoading, isError, error} = usePedidos();
  const {data: datosDeCuentas = []} = useCuentas();

  const pedido = useMemo(() => {
    return datosDePedidos.find((pedidoActual) => pedidoActual.id === id);
  }, [datosDePedidos, id]);

  const cuentasMap = useMemo(() => {
    return new Map(datosDeCuentas.map((cuenta) => [cuenta.id, cuenta.nombre]));
  }, [datosDeCuentas]);

  const totalPedido = Number(pedido?.total_pedido || 0);
  const totalPagado = Number(pedido?.total_pagado || 0);
  const restantePedido = Math.max(totalPedido - totalPagado, 0);

  const productos = pedido?.productos || [];
  const productosCompletados = productos.filter((producto) =>
    producto.estado_producto === "Completado").length;
  const totalProductos = productos.length;

  const porcentajeCompletado = totalProductos > 0
    ? Math.round((productosCompletados / totalProductos) * 100)
    : 0;

  const formatearPrecio = (valor) => {
    return `$${Number(valor || 0).toLocaleString("es-CL")}`;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    if (typeof fecha?.toDate === "function") {
      return fecha.toDate().toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    }

    const fechaConvertida = new Date(fecha);
    if (!Number.isNaN(fechaConvertida.getTime())) {
      return fechaConvertida.toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    }
    return fecha;
  };

  const textoFechaEntrega = (fecha) => {
    if (!fecha) return "";
    let fechaEntrega;
    if (typeof fecha?.toDate === "function") {
      fechaEntrega = fecha.toDate();
    } else {
      fechaEntrega = new Date(fecha);
    }
    if (Number.isNaN(fechaEntrega.getTime())) return "";
    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);
    fechaEntrega.setHours(0, 0, 0, 0);

    const diferenciaMs = fechaEntrega.getTime() - hoy.getTime();
    const diferenciaDias = Math.round(diferenciaMs / (1000 * 60 * 60 * 24));

    if (diferenciaDias === 0) {
      return {
        texto: "Entrega hoy",
        urgente: true
      };
    }
    if (diferenciaDias > 0) {
      return {
        texto: `Entrega en ${diferenciaDias} ${diferenciaDias === 1 ? "día" : "días"}`,
        urgente: diferenciaDias <= 3
      };
    }
    const diasPasados = Math.abs(diferenciaDias);
    return {
      texto: `Entrega hace ${diasPasados} ${diasPasados === 1 ? "día" : "días"}`,
      urgente: true
    };  
  };

  const abrirModal = (pedido) => {
      setEstadoActual(pedido); setEstadoDelModal(true);
  }
  const cerrarModal = () => {
      setEstadoActual(null); setEstadoDelModal(false);
  }
  const cambiarEstado = async (datoActual) => {
      try {
          const nuevoEstado = datoActual.estado_pedido === "Entregado"
                  ? "Pendiente"
                  : "Entregado";

          const pedidoRef = doc( db, "pedidos", id );
          await updateDoc(pedidoRef, {
          estado_pedido: nuevoEstado,
          fecha_actualizacion: serverTimestamp(),
          });
      } catch (error) {
          console.error("Error al cambiar el estado de entrega:", error);
          throw error;
      }
  };

  if (isLoading) { return <p>Cargando el pedido...</p> }
  if (isError) { return <p>Error: {error.message}. Error al Cargar el Pedido, recargue la página.</p> }
  if (!pedido) {
    return <p>Pedido no encontrado.</p>;
  }
  return (
    <main className="verPedidoPage">
      <header className="verPedidoHeader">
        <button
          type="button"
          className="verPedidoVolver"
          onClick={() => navigate("/pedidos")}
        >
          <ArrowLeft size={17} strokeWidth={2} />
          Volver a pedidos
        </button>
        <span className="pedidoIdentificadorVerPedido">
          {pedido.numero_pedido || "Sin ID"}
        </span>
      </header>
      
      <section className="verPedidoCliente">
        <div className="verPedidoClientePrincipal">
          <span className="verPedidoSeccionLabel">CLIENTE</span>

          <div className="verPedidoClienteTitulo">
            <h1>{pedido.cliente || "Sin cliente"}</h1>
            
            <button
              type="button"
              className={`pedidoCambiarEstado ${
                pedido.estado_pedido === "Entregado"
                  ? "pedidoCambiarEstadoEntregado"
                  : "pedidoCambiarEstadoPendiente"
              }`}
              onClick={() => abrirModal(pedido)}
            >
              <span>
                {(pedido.estado_pedido === "Entregado"
                  ? "Entregado"
                  : "Marcar como entregado").toUpperCase()}
              </span>
            </button>
          </div>
        </div>

        <div className="verPedidoClienteDatos">
          <div className="verPedidoDato">
            <span>Fecha de entrega</span>
            <strong>{formatearFecha(pedido.fecha_entrega)}</strong>
            {pedido.estado_pedido === "Entregado" ? (
              <small className="verPedidoFechaEntregaEntregado">
                Pedido entregado
              </small>
            ) : (
              (() => {
                const fechaEntregaInfo = textoFechaEntrega(pedido.fecha_entrega);
                return fechaEntregaInfo ? (
                  <small
                    className={
                      fechaEntregaInfo.urgente
                        ? "verPedidoFechaEntregaUrgente"
                        : "verPedidoFechaEntregaNormal"
                    }
                  >
                    {fechaEntregaInfo.texto}
                  </small>
                ) : null;
              })()
            )}
          </div>

          <div className="verPedidoDato">
            <span>Colegio / Empresa</span>
            <strong>{pedido.colegio || "Sin afiliado"}</strong>
          </div>

          <div className="verPedidoDato">
            <span>Teléfono</span>
            <strong>{pedido.telefono || "Sin número de contacto"}</strong>
          </div>
        </div>
      </section>

      <section className="verPedidoResumen">
        <div className="verPedidoProgreso">
          <div className="verPedidoProgresoHeader">
            <div className="verPedidoSeccionLabel">
              <span>RESUMEN DE PRODUCCIÓN: </span>
              <strong className={
                pedido.estado_productos === "Completado"
                  ? "verPedidoProgresoEstadoCompletado"
                  : "verPedidoProgresoEstadoPendiente"
              }>
                {(pedido.estado_productos || "Pendiente").toUpperCase()}
              </strong>
            </div>

            <strong className="verPedidoProgresoPorcentaje">
              {porcentajeCompletado}%
            </strong>
          </div>

          <div className="verPedidoProgresoBarra">
            <div
              className="verPedidoProgresoBarraFill"
              style={{ width: `${porcentajeCompletado}%` }}
            />
          </div>
        </div>

        <span className="verPedidoSeccionLabel">RESUMEN FINANCIERO</span>
        <div className="verPedidoResumenGrid">
          <div className="verPedidoResumenItem">
            <span>Total del pedido</span>
            <strong>{formatearPrecio(totalPedido)}</strong>
          </div>

          <div className="verPedidoResumenItem">
            <span>Total pagado</span>
            <strong>{formatearPrecio(totalPagado)}</strong>
          </div>

          <div className="verPedidoResumenItem">
            <span>Pendiente</span>
            <strong>{formatearPrecio(restantePedido)}</strong>
          </div>
        </div>
      </section>

      <section className="verPedidoSeccion">
        <div className="verPedidoSeccionHeader">
          <span className="verPedidoSeccionLabel">PAGOS</span>
        </div>

        {(pedido.pagos || []).length > 0 ? (
          <div className="verPedidoPagos">
            {pedido.pagos.map((pago, index) => {
              const nombreCuenta = cuentasMap.get(pago.cuenta_bancaria_id) || "Cuenta no encontrada";

              return (
                <article className="verPedidoPagoCard" key={pago.id || index}>
                  <div className="verPedidoPagoIcon">
                    <CreditCard size={19} strokeWidth={1.7} />
                  </div>

                  <div className="verPedidoPagoContenido">
                    <strong className="verPedidoPagoMonto">
                      {formatearPrecio(pago.total_pago)}
                    </strong>

                    <div className="verPedidoPagoDatos">
                      <div>
                        <span>Cuenta</span>
                        <strong>{nombreCuenta}</strong>
                      </div>

                      <div>
                        <span>Fecha</span>
                        <strong>{formatearFecha(pago.fecha_pago)}</strong>
                      </div>
                    </div>
                  </div>

                  {pago.comprobante_url ? (
                    <button
                      type="button"
                      className="verPedidoPagoComprobante verPedidoPagoComprobanteDisponible"
                      onClick={() => window.open(pago.comprobante_url, "_blank", "noopener,noreferrer")}
                    >
                      <span>Revisar</span>
                    </button>
                  ) : (
                    <span>
                      <span></span>
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="verPedidoEmpty">
            <div>
              <h3>
                <Ghost size={17} strokeWidth={1.5} style={{marginRight: "10px"}}/>
                No hay pagos por aquí
              </h3>
            </div>
          </div>
        )}
        <div className="verPedidoGestionarPagosButton">
            <button
              type="button"
              onClick={() => navigate(`/pedido/${pedido.id}/gestionar-pagos/`)}
            >
            <WalletCards size={17} strokeWidth={2} />
            <span>Gestionar pagos</span>
            </button>
          </div>
      </section>

      <section className="verPedidoSeccion verPedidoProductosSeccion">
        <div className="verPedidoSeccionHeader">
          <span className="verPedidoSeccionLabel">PRODUCTOS</span>
        </div>

        {(pedido.productos || []).length > 0 ? (
          <div className="verPedidoProductosGrid">
            {pedido.productos.map((producto, index) => {
              const precioUnitario = Number(producto.precio_talla) || 0;
              const cantidad = Number(producto.cantidad) || 0;

              return (
                <article className="verPedidoProductoCard" key={producto.id || index}>
                <div className="verPedidoProductoEstadoWrapper">
                <span className={`verPedidoProductoEstado ${producto.estado_producto === "Completado" ? "verPedidoProductoEstadoCompleto" : "verPedidoProductoEstadoPendiente"}`}>
                    {(producto.estado_producto || "Pendiente").toUpperCase()}
                </span>
                </div>

                  <div className="verPedidoProductoHeader">
                    <div className="verPedidoProductoImagen">
                      {producto.imagen ? (
                        <img
                          src={producto.imagen}
                          alt={`Imagen de ${producto.nombre || "producto"}`}
                        />
                      ) : (
                        <Shirt size={28} strokeWidth={1.7} />
                      )}
                    </div>

                    <div className="verPedidoProductoInfo">
                      <h2>{producto.nombre || "Producto sin nombre"}</h2>
                      <span className="verPedidoProductoColegio">{producto.colegio || "Sin afiliado"}</span>
                      <span className="verPedidoProductoTipo">{producto.tipo_prenda || "Sin tipo de prenda"}</span>
                    </div>
                  </div>

                  <div className="verPedidoProductoDatos">
                    <div className="verPedidoProductoDato">
                      <span>Talla:</span>
                      <strong>{producto.talla || "Sin talla"}</strong>
                    </div>

                    <div className="verPedidoProductoDato">
                      <strong>{formatearPrecio(precioUnitario)}</strong>
                    </div>

                    <div className="verPedidoProductoDato">
                      <span>x</span>
                      <strong>{cantidad}</strong>
                    </div>
                  </div>

                  <div className="verPedidoProductoAcciones">
                    <button
                      type="button"
                      className={"verPedidoProductoButton"}
                      onClick={() => navigate(`/pedido/${pedido.id}/gestionar-producto/${producto.id}`)}
                    >
                    <Eye size={17} strokeWidth={2} />
                    <span>Gestionar</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="verPedidoEmpty">
            <div>
              <h3>
                <Ghost size={17} strokeWidth={1.5} style={{marginRight: "10px"}}/>
                No hay productos por aquí
              </h3>
            </div>
          </div>
        )}
      </section>
       {estadoDelModal && (
       <ModalConfirmar
         tipo = "pedidoEntrega"
         dato = {estadoActual}
         modalAbierto= {estadoDelModal}
         onCerrarModal= {cerrarModal}
         onConfirmar= {cambiarEstado}
       /> )}
    </main>
  );
}