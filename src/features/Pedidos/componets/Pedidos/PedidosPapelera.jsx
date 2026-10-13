import "./Pedidos.css";
import { useMemo, useState } from "react";
import { db } from "../../../../firebase";
import { collection, serverTimestamp, doc, getDocs, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { usePedidosInactivos } from "../../querys/usePedidosInactivos";
import ModalConfirmarEliminacion from "../../../../components/modals/ModalConfirmarEliminacion/ModalConfirmarEliminacion";
import ModalConfirmar from "../TrabajarPedido/ModalConfirmar/ModalConfirmar";

import { Search, ShoppingBag, Trash2, Pin } from "lucide-react";


export default function PapeleraPedidos() {
  const navigate = useNavigate();
  const [buscador, setBuscador] = useState("");
  const [pedidoRestaurado, setPedidoRestaurado] = useState(null);
  const [pedidoEliminado, setPedidoEliminado] = useState(null);

  const [estadoDelModal, setEstadoDelModal] = useState(false);
  const [estadoDelModalEliminar, setEstadoDelModalEliminar] = useState(false);

  const {data: datosDePedidosInactivos = [], isLoading, isError } = usePedidosInactivos();

  const listarPedidos = useMemo(() => {
    return [...datosDePedidosInactivos]
      .sort((a, b) => {
        const fechaA = a.fecha_actualizacion?.toMillis?.() || 0;
        const fechaB = b.fecha_actualizacion?.toMillis?.() || 0;
        return fechaB - fechaA;
      });
  }, [datosDePedidosInactivos]);

  const buscadorDePedidos = useMemo(() => {
    const texto = buscador.toLowerCase().trim();
    return listarPedidos.filter((pedido) => {
      const buscadorCliente = 
        !texto ||
        String(pedido.cliente || "")
          .toLowerCase()
          .includes(texto);
      
      return (
      buscadorCliente
      );
    });
  }, [ listarPedidos, buscador]);

  const formatearFecha = (fecha) => {
    if (typeof fecha === "string") {
      return fecha === "Sin fecha de entrega"
        ? fecha
        : fecha.substring(0, 10).split("-").reverse().join("-");
    }
    return "Sin fecha de entrega";
  };

  const textoFechaEntrega = (fecha) => {
    if (!fecha) return "";
    let fechaEntrega;
    if (typeof fecha?.toDate === "function") {
      fechaEntrega = fecha.toDate();
    } else {
      const [anio, mes, dia] = fecha.split("-").map(Number);
      fechaEntrega = new Date(anio, mes - 1, dia);
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

  const obtenerNombresProductos = (productos = []) => {
    const nombres = productos.map((producto) => producto.nombre).filter(Boolean);
    const visibles = nombres.slice(0, 3);
    const restantes = nombres.length - visibles.length;
    return { visibles, restantes };
  };

  const abrirModalConfirmar = (pedido) => {
       setPedidoRestaurado(pedido); setEstadoDelModal(true);
  };
   const cerrarModalConfirmar = () => {
       setPedidoRestaurado(null); setEstadoDelModal(false);
   };
  const restaurarPedido = async () => {
    if (!pedidoRestaurado) return;
    const pedidoId = pedidoRestaurado.id;

    try {
      const pedidoInactivoRef = doc(db, "pedidos_inactivos", pedidoId);
      const pedidoSnap = await getDoc(pedidoInactivoRef);
      if (!pedidoSnap.exists()) {
        throw new Error("El pedido no existe en la papelera");
      }

      const pedidoData = pedidoSnap.data();

      const productosRef = collection(db, "pedidos_inactivos", pedidoId, "productos");
      const productosSnap = await getDocs(productosRef);
      
      const pagosRef = collection(db, "pedidos_inactivos", pedidoId, "pagos");
      const pagosSnap = await getDocs(pagosRef);

      const pedidoActivoRef = doc(db, "pedidos", pedidoId);
      await setDoc(pedidoActivoRef, {
        ...pedidoData,
        fecha_actualizacion: serverTimestamp(),
      });

      for (const productoDoc of productosSnap.docs) {
        const prodId = productoDoc.id;
        const datosProducto = productoDoc.data();
        await setDoc(doc(db, "pedidos", pedidoId, "productos", prodId), datosProducto);
      }

      for (const pagoDoc of pagosSnap.docs) {
        const pagoId = pagoDoc.id;
        const datosPago = pagoDoc.data();
        await setDoc(doc(db, "pedidos", pedidoId, "pagos", pagoId), datosPago);
      }

      for (const productoDoc of productosSnap.docs) {
        await deleteDoc(productoDoc.ref);
      }
      for (const pagoDoc of pagosSnap.docs) {
        await deleteDoc(pagoDoc.ref);
      }
      await deleteDoc(pedidoInactivoRef);
    } catch (error) {
      console.error("Error al restaurar el pedido:", error);
    } finally {
      setPedidoRestaurado(null);
    }
  };

  const abrirModalEliminar = (pedido) => {
    setPedidoEliminado(pedido); setEstadoDelModalEliminar(true);
  };
   const cerrarModalEliminar = () => {
    setPedidoEliminado(null); setEstadoDelModalEliminar(false);
   };

  const eliminarPedido = async () => {
    if (!pedidoEliminado) return;
    const pedidoId = pedidoEliminado.id;
    try {
      const productosRef = collection(db, "pedidos_inactivos", pedidoId, "productos");
      const productosSnap = await getDocs(productosRef);
      for (const productoDoc of productosSnap.docs) {
        await deleteDoc(productoDoc.ref);
      }
      const pagosRef = collection(db, "pedidos_inactivos", pedidoId, "pagos");
      const pagosSnap = await getDocs(pagosRef);
      for (const pagoDoc of pagosSnap.docs) {
        await deleteDoc(pagoDoc.ref);
      }
      const pedidoInactivoRef = doc(db, "pedidos_inactivos", pedidoId);
      await deleteDoc(pedidoInactivoRef);
      cerrarModalEliminar();
    } catch (error) {
      console.error("Error al eliminar definitivamente el pedido:", error);
    }
  };
  if (isLoading) {
    return <p>Cargando papelera...</p>;
  }
  if (isError) {
    return <p>Error al cargar la papelera.</p>;
  }
  return (
    <main className="adminPedidos">
      <header className="adminPedidosHeader">
        <h1 className="adminPedidosTitle">Papelera de Pedidos</h1>
        <div className="pedidosBuscador">
          <Search className="pedidosBuscadorIcon" size={18} strokeWidth={2} />
          <input
            type="text"
            className="pedidosBuscadorInput"
            placeholder="Buscar un pedido..."
            value={buscador}
            onChange={(e) => setBuscador(e.target.value)}
            aria-label="Buscar pedido"
            autoComplete="off"
          />
        </div>
      </header>
      <section className="pedidosLista">
        {buscadorDePedidos.map((pedido) => {
          const { visibles, restantes } = obtenerNombresProductos(pedido.productos);
          const isRestaurando = pedidoRestaurado?.id === pedido.id
          return (
            <article key={pedido.id} className="pedidoRow">
              <div className="pedidoCliente">
                <span className="pedidoLabel"> <strong>EN LA PAPELERA</strong></span>
                <span className="pedidoLabel">Fecha de Entrega</span>
                <h2>{formatearFecha(pedido.fecha_entrega)}</h2>
                {pedido.estado_pedido === "Entregado" ? (
                  <small className="PedidoFechaEntregaEntregado">
                    Pedido entregado
                  </small>
                ) : (
                  (() => {
                    const fechaEntregaInfo = textoFechaEntrega(pedido.fecha_entrega);
                    return fechaEntregaInfo ? (
                      <small
                        className={
                          fechaEntregaInfo.urgente
                            ? "PedidoFechaEntregaUrgente"
                            : "PedidoFechaEntregaNormal"
                        }
                      >
                        {fechaEntregaInfo.texto}
                      </small>
                    ) : null;
                  })()
                )}
                <span className="pedidoClienteNombre">{pedido.cliente}</span>
                <span className="pedidoColegio">{pedido.colegio}</span>
              </div>

              <div className="pedidoProductos">
                <span className="pedidoLabel">Productos</span>
                <div className="pedidoProductosNombres">
                  {visibles.length > 0 ? (
                    visibles.map((nombre, index) => (
                      <span
                        key={`${nombre}-${index}`}
                        className="pedidoProductoNombre"
                      >
                        {nombre}
                      </span>
                    ))
                  ) : (
                    <span className="pedidoProductoVacio">
                      Sin productos
                    </span>
                  )}
                  {restantes > 0 && (
                    <span className="pedidoProductosMas">
                      +{restantes}
                    </span>
                  )}
                </div>
              </div>

              <div className="pedidoEstados">
                <span className="pedidoLabel">Estados del Pedido</span>
                <span
                  className={`pedidoEstado ${
                    pedido.estado_productos === "Completado"
                      ? "pedidoEstadoProductosListos"
                      : "pedidoEstadoProductosPendiente"
                  }`}
                >
                  Proceso: {pedido.estado_productos}
                </span>
                <span
                  className={`pedidoEstado ${
                    pedido.estado_pedido === "Entregado"
                      ? "pedidoEstadoPedidoEntregado"
                      : "pedidoEstadoPedidoPendiente"
                  }`}
                >
                  Entrega: {pedido.estado_pedido}
                </span>
              </div>

              <div className="pedidoAction">
              <button
                  type="button"
                  className="pedidoActionButton"
                  aria-label={`Abrir pedido de ${pedido.cliente}`}
                  onClick={() => abrirModalConfirmar(pedido)}
                  disabled={isRestaurando}

                >
                  <Pin size={17} strokeWidth={2} />
                  <span>{isRestaurando ? "Restaurando..." : "Restaurar"}</span>
                </button>
                <button
                  type="button"
                  className="pedidoActionButton"
                  aria-label={`Abrir pedido de ${pedido.cliente}`}
                  onClick={() => abrirModalEliminar(pedido)}
                  disabled={isRestaurando}
                >
                  <Trash2 size={17} strokeWidth={2} />
                  <span>Eliminar</span>
                </button>
                <span className="pedidoIdentificador">
                  {pedido.numero_pedido || "Sin ID"}
                </span>
              </div>
            </article>
          );
        })}
      </section>
      <section className="agregarColegio">
        <p className="agregarColegioTexto">Vuelve para revisar tus pedidos activos</p>
        <button
          type="button"
          className="agregarColegioButton"
          aria-label="Ver pedidos borradores"
          onClick={() => navigate("/pedidos")}
        >
          <ShoppingBag size={21} strokeWidth={2} />
        </button>
      </section>

         {estadoDelModalEliminar && (
         <ModalConfirmarEliminacion
           tipo = "pedidoPapelera"
           dato = {pedidoEliminado}
           modalAbierto= {estadoDelModalEliminar}
           onCerrarModal= {cerrarModalEliminar}
           onConfirmarEliminacion= {eliminarPedido}
         /> )}

         {estadoDelModal && (
         <ModalConfirmar
           tipo = "pedidoPapelera"
           dato = {pedidoRestaurado}
           modalAbierto= {estadoDelModal}
           onCerrarModal= {cerrarModalConfirmar}
           onConfirmar= {restaurarPedido}
         /> )}
    </main>
  );
}