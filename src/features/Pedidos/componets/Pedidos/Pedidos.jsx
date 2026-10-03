import "./Pedidos.css";
import { usePedidos } from "../../querys/usePedidos";
import { useMemo, useState } from "react";
import { Search, Eye, Eraser } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Pedidos() {
  const navigate = useNavigate();
  const [buscador, setBuscador] = useState("");
  const [filtroProceso, setFiltroProceso] = useState("Todos");
  const [filtroEntrega, setFiltroEntrega] = useState("Todos");
  const [filtroPago, setFiltroPago] = useState("Todos");




  const {data: datosDePedidos = [], isLoading, isError, error } = usePedidos();

  const listarPedidos = useMemo(() => {
    return [...datosDePedidos]
      .filter(
        (pedido) =>
          String(pedido.estado_guardado || "") === "Guardado"
      )
      .sort((a, b) => {
        const fechaA = a.fecha_creacion?.toMillis?.() || 0;
        const fechaB = b.fecha_creacion?.toMillis?.() || 0;
        return fechaB - fechaA;
      });
  }, [datosDePedidos]);

  const obtenerTotalPagado = (pagos = []) => {
    return pagos.reduce(
      (total, pago) => total + Number(pago.total_pago || 0), 0);
  };

  const obtenerTotalPendiente = (pedido) => {
    const totalPedido = Number(pedido.total_pedido || 0);
    const totalPagado = obtenerTotalPagado(pedido.pagos);
    return Math.max(totalPedido - totalPagado, 0);
  };

  const buscadorDePedidos = useMemo(() => {
    const texto = buscador.toLowerCase().trim();
    return listarPedidos.filter((pedido) => {
      const buscadorCliente = 
        !texto ||
        String(pedido.cliente || "")
          .toLowerCase()
          .includes(texto);
      const buscadorProceso =
        filtroProceso === "Todos" ||
        String(pedido.estado_productos || "") === filtroProceso;
      const buscadorEntrega =
        filtroEntrega === "Todos" ||
        String(pedido.estado_pedido || "") === filtroEntrega;
      
      const totalPendiente = obtenerTotalPendiente(pedido);
      const pagado = totalPendiente <= 0;
      const coincidePago = 
        filtroPago === "Todos" || (filtroPago === "Pagado" && pagado) || (filtroPago === "Pendiente" && !pagado);
      return (
      buscadorCliente &&
      buscadorProceso &&
      buscadorEntrega &&
      coincidePago
      );
    });
  }, [ listarPedidos, buscador, filtroProceso, filtroEntrega, filtroPago ]);

  const formatearPrecio = (valor) => {
    return `$${Number(valor || 0).toLocaleString("es-CL")}`;
  };
  
  const formatearFecha = (fecha) => {
    if (typeof fecha === "string") {
      return fecha === "Sin fecha de entrega"
        ? fecha
        : fecha.substring(0, 10).split("-").reverse().join("-");
    }
    return "Sin fecha de entrega";
  };

  const obtenerNombresProductos = (productos = []) => {
    const nombres = productos.map((producto) => producto.nombre).filter(Boolean);
    const visibles = nombres.slice(0, 3);
    const restantes = nombres.length - visibles.length;
    return { visibles, restantes };
  };

  if (isLoading) {
    return <p>Cargando los Pedidos...</p>;
  }
  if (isError) {
    return (
      <p>
        Error: {error.message}. Error al Cargar los Pedidos, recargue la página.
      </p>
    );
  }

  return (
    <main className="adminPedidos">
      <header className="adminPedidosHeader">
        <h1 className="adminPedidosTitle">Pedidos</h1>
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
        <div className="pedidosFiltros">
          <label className="pedidoFiltro">
            <span>Proceso</span>
            <select
              value={filtroProceso}
              onChange={(e) => setFiltroProceso(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Completado">Completado</option>
            </select>
          </label>
          <label className="pedidoFiltro">
            <span>Entrega</span>
            <select
              value={filtroEntrega}
              onChange={(e) => setFiltroEntrega(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Entregado">Entregado</option>
            </select>
          </label>
          <label className="pedidoFiltro">
            <span>Pago</span>
            <select
              value={filtroPago}
              onChange={(e) => setFiltroPago(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Pagado">Pagado</option>
            </select>
          </label>
        </div>
      </header>

      <section className="pedidosLista">
        {buscadorDePedidos.map((pedido) => {
          const { visibles, restantes } = obtenerNombresProductos(pedido.productos);
          const totalPendiente = obtenerTotalPendiente(pedido);
          return (
            <article key={pedido.id} className="pedidoRow">
              <div className="pedidoCliente">
                <span className="pedidoLabel">Fecha de Entrega</span>
                <h2>{formatearFecha(pedido.fecha_entrega)}</h2>
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

              <div className="pedidoTotales">
                <span className="pedidoLabel">PAGO PENDIENTE</span>
                <strong>
                  {Number(totalPendiente) <= 0
                    ? "Pedido Pagado"
                    : formatearPrecio(totalPendiente)}
                </strong>
                <span className="pedidoPendiente">
                  Total del pedido: {formatearPrecio(pedido.total_pedido)}
                </span>
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
                  onClick={() => navigate(`/pedido/${pedido.id}`)}
                >
                  <Eye size={17} strokeWidth={2} />
                  <span>Gestionar</span>
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <section className="agregarColegio">
        <p className="agregarColegioTexto">Revisa tus borradores</p>
        <button
          type="button"
          className="agregarColegioButton"
          aria-label="Ver pedidos borradores"
          onClick={() => navigate("/pedidos-borradores")}
        >
          <Eraser size={21} strokeWidth={2} />
        </button>
      </section>
    </main>
  );

}