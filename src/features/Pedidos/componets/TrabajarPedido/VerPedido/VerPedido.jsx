import "./VerPedido.css";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { usePedidos } from "../../../querys/usePedidos";
import { useCuentas } from "../../../../Cuentas/querys/useCuentas";
import { ArrowLeft, CreditCard, Shirt, Eye } from "lucide-react";

export default function VerPedido() {
  const {id} = useParams();
  const navigate = useNavigate();
  const {data: datosDePedidos = [], isLoading, isError, error} = usePedidos();
  const {data: datosDeCuentas = []} = useCuentas();

  const pedido = useMemo(() => {
    return datosDePedidos.find((pedidoActual) => pedidoActual.id === id);
  }, [datosDePedidos, id]);

  const cuentasMap = useMemo(() => {
    return new Map(datosDeCuentas.map((cuenta) => [cuenta.id, cuenta.nombre]));
  }, [datosDeCuentas]);

  const totalPedido = useMemo(() => {
    if (pedido?.total_pedido !== undefined) {
      return Number(pedido.total_pedido) || 0;
    }

    return (pedido?.productos || []).reduce(
      (total, producto) => total + (Number(producto.precio_talla) || 0) * (Number(producto.cantidad) || 0),
      0
    );
  }, [pedido]);

  const totalPagado = useMemo(() => {
    return (pedido?.pagos || []).reduce(
      (total, pago) => total + (Number(pago.total_pago) || 0),
      0
    );
  }, [pedido]);

  const restantePedido = Math.max(totalPedido - totalPagado, 0);
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

  const abrirProducto = (producto) => {
    window.open(`/pedido/${pedido.id}/gestionar-producto/${producto.id}`);
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
      </header>

      <section className="verPedidoCliente">
        <div className="verPedidoClientePrincipal">
          <span className="verPedidoSeccionLabel">CLIENTE</span>
          <h1>{pedido.cliente || "Sin cliente"}</h1>
        </div>

        <div className="verPedidoClienteDatos">
          <div className="verPedidoDato">
            <span>Fecha de entrega</span>
            <strong>{formatearFecha(pedido.fecha_entrega)}</strong>
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
            <span>Restante</span>
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
          <div className="verPedidoSinDatos">
            <CreditCard size={25} strokeWidth={1.5} />
            <p>No hay pagos registrados para este pedido.</p>
          </div>
        )}
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
              const productoTieneId = Boolean(producto.producto_id);

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
                      className={`verPedidoProductoButton ${!productoTieneId ? "verPedidoProductoButtonDisabled" : ""}`}
                      disabled={!productoTieneId}
                      onClick={() => abrirProducto(producto)}
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
          <div className="verPedidoSinDatos">
            <p>Este pedido no tiene productos registrados.</p>
          </div>
        )}
      </section>
    </main>
  );
}