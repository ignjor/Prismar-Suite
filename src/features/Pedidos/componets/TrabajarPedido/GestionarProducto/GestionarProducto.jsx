import "./GestionarProducto.css";
import { usePedidos } from "../../../querys/usePedidos";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, Shirt } from "lucide-react";

export default function GestionarProducto() {
    const { pedidoId, productoId } = useParams();
    const navigate = useNavigate();
    const { data: datosDePedidos = [], isLoading, isError, error } = usePedidos();

    const pedido = useMemo(() => {
        return datosDePedidos.find(
        (pedidoActual) => pedidoActual.id === pedidoId
        );
    }, [datosDePedidos, pedidoId]);

    const producto = useMemo(() => {
        return pedido?.productos?.find(
        (productoActual) => productoActual.id === productoId
        );
    }, [pedido, productoId]);

    const medidas = useMemo(() => {
        if (!producto?.medidas_asig) {
        return [];
        }

        return Object.entries(producto.medidas_asig);
    }, [producto]);

    const formatearPrecio = (valor) => {
        return `$${Number(valor || 0).toLocaleString("es-CL")}`;
    };

    if (isLoading) {
        return <p>Cargando el producto...</p>;
    }

    if (isError) {
        return (
        <p>
            Error: {error.message}. Error al Cargar el Producto, recargue la
            página.
        </p>
        );
    }

    if (!pedido) {
        return <p>Pedido no encontrado.</p>;
    }

    if (!producto) {
        return <p>Producto no encontrado dentro del pedido.</p>;
    }

    const precio = Number(producto.precio_talla) || 0;
    const cantidad = Number(producto.cantidad) || 0;

    return (
        <main className="adminColegios productoDetallePage">
        <div className="productoDetalleHeader">
            <button
            type="button"
            className="productoVolver"
            onClick={() => navigate(`/pedido/${pedidoId}`)}
            >
            <ArrowLeft size={17} strokeWidth={2} />
            Volver al pedido
            </button>
            
            <span className="pedidoIdentificadorGestionarProducto">
            {pedido.numero_pedido || "Sin ID"}
            </span>
        </div>

        <section className="productoDetalle">
            <div className="productoDetalleImagenWrapper">
            {producto.imagen ? (
                <img
                src={producto.imagen}
                alt={`Imagen de ${producto.nombre || "producto"}`}
                className="productoDetalleImagen"
                />
            ) : (
                <div className="productoDetalleImagen productoDetalleImagenVacia">
                <span>
                    <Shirt size={50} />
                </span>
                </div>
            )}
            </div>

            <div className="productoDetalleContenido">
            <h1 className="productoDetalleNombre">
                {producto.nombre || "Producto sin nombre"}
            </h1>

            <div className="productoDetalleEtiquetas">
                <span
                className={`ColegioAsignadoTitle ${
                    producto.estado_producto === "Completado"
                    ? "productoDetalleEstadoCompleto"
                    : "productoDetalleEstadoPendiente"
                }`}
                >
                {(producto.estado_producto || "Pendiente").toUpperCase()}
                </span>
                
                <span className="ColegioAsignadoTitle">
                {producto.colegio || "Sin Empresa o Colegio Afiliado"}
                </span>

                <span className="ColegioAsignadoTitle">
                {producto.tipo_prenda || "Sin Tipo de Prenda Afiliado"}
                </span>
            </div>

            <div className="productoDetalleSeparador" />

            <div className="productoDetalleSeccion">
                <h2 className="preciosAsignadosTitle">
                TALLA Y CANTIDAD
                </h2>

                <div className="productoDetallePrecios">
                <div className="productoDetallePrecio">
                    <span className="productoDetalleTalla">
                    Talla / MEDIDA
                    </span>

                    <span className="productoDetalleValor">
                    {producto.talla || "Sin talla"}
                    </span>
                </div>
                <div className="productoDetallePrecio">
                    <span className="productoDetalleTalla">
                    CANTIDAD
                    </span>
                    <span className="productoDetalleValor">
                    {cantidad}
                    </span>
                </div>
                <div className="productoDetallePrecio">
                    <span className="productoDetalleTalla">
                    PRECIO U.
                    </span>
                    <span className="productoDetalleValor">
                    {formatearPrecio(precio)}
                    </span>
                </div>
                </div>
            </div>

            <div className="productoDetalleSeccion">
                <h2 className="medidasAsignadasTitle">
                MEDIDAS ASIGNADAS
                </h2>

                {medidas.length > 0 ? (
                <div className="productoDetalleMedidas">
                    {medidas.map(([medida, valor]) => (
                    <div
                        className="productoDetallePrecio"
                        key={medida} 
                    >
                        <span className="productoDetalleTalla">
                        {medida}: 
                        </span>

                        <span className="productoDetalleValor">
                        {valor || "Sin medidas asignadas"}
                        </span>
                    </div>
                    ))}
                </div>
                ) : (
                <p className="productoDetalleSinDatos">
                    No hay medidas asignadas.
                </p>
                )}
            </div>
            </div>
        </section>
        </main>
    );
}