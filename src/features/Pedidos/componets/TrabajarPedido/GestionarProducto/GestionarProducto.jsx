import "./GestionarProducto.css";
import { usePedidos } from "../../../querys/usePedidos";
import { db } from "../../../../../firebase";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, Shirt } from "lucide-react";
import ModalConfirmar from "../ModalConfirmar/ModalConfirmar";
import ModalTomarMedidas from "../../ModalTomarMedidas/ModalTomarMedidas";

export default function GestionarProducto() {
    const { pedidoId, productoId } = useParams();
    const navigate = useNavigate();
    const [estadoDelModal, setEstadoDelModal] = useState(false);
    const [estadoDelModalMedidas, setEstadoDelModalMedidas] = useState(false);

    const [medidasActuales, setMedidasActuales] = useState(null);
    const [estadoActual, setEstadoActual] = useState(null);
    const { data: datosDePedidos = [], isLoading, isError } = usePedidos();

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

    const abrirModal = (producto) => {
        setEstadoActual(producto); setEstadoDelModal(true);
    }
    const cerrarModal = () => {
        setEstadoActual(null); setEstadoDelModal(false);
    }
    const cambiarEstado = async (datoActual) => {
        try {
            const nuevoEstado = datoActual.estado_producto === "Completado"
                    ? "Pendiente"
                    : "Completado";

            const productoRef = doc( db, "pedidos", pedidoId, "productos", productoId );
            await updateDoc(productoRef, {
            estado_producto: nuevoEstado,
            fecha_actualizacion: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error al cambiar el estado:", error);
            throw error;
        }
    };
    const abrirModalMedidas = (producto) => {
        setMedidasActuales(producto); setEstadoDelModalMedidas(true);
    }
    const cerrarModalMedidas = () => {
        setMedidasActuales(null); setEstadoDelModalMedidas(false);
    }

    const editarMedidas = async (nuevasMedidas) => {
        if (!producto) {
            return;
        }
        try {
            const productoRef = doc( db, "pedidos", pedidoId, "productos", productoId );
            await updateDoc(productoRef, {
                medidas_asig: nuevasMedidas,
                fecha_actualizacion: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error al actualizar las medidas:", error);
            throw error;
        }
    };

    if (isLoading) {
        return <p>Cargando el producto...</p>;
    }
    if (isError) {
        return (
        <p>
            Error al Cargar el Producto, recargue la
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
            PRODUCTO - {pedido.numero_pedido}
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
                <button 
                    type="button"
                    className="ColegioAsignadoTitle"
                    onClick={() => abrirModal(producto)}
                >
                    <span
                    className={`ColegioAsignadoTitle ${
                        producto.estado_producto === "Completado"
                        ? "productoDetalleEstadoCompleto"
                        : "productoDetalleEstadoPendiente"
                    }`}
                    >
                    {(producto.estado_producto === "Pendiente"
                        ? "Marcar como completado"
                        : "Completado"
                    ).toUpperCase()}
                    </span>
                </button>
                
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
                <div className="productoDetalleMedidasHeader">
                    <h2 className="medidasAsignadasTitle">
                        MEDIDAS ASIGNADAS
                    </h2>

                    <button
                        type="button"
                        className="productoEditarMedidasButton"
                        onClick={() => abrirModalMedidas(producto)}
                    >
                        Editar medidas
                    </button>
                </div>

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
         {estadoDelModal && (
         <ModalConfirmar
           tipo = "producto"
           dato = {estadoActual}
           modalAbierto= {estadoDelModal}
           onCerrarModal= {cerrarModal}
           onConfirmar= {cambiarEstado}
         /> )}
         {estadoDelModalMedidas && (
         <ModalTomarMedidas
           producto = {medidasActuales}
           modalAbierto= {estadoDelModalMedidas}
           onEditarMedidas= {editarMedidas}
           onCerrarModal= {cerrarModalMedidas}
         /> )}
        </main>
    );
}