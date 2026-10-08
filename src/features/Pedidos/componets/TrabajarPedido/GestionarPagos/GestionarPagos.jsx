import "./GestionarPagos.css";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { db, storage } from "../../../../../firebase";
import { addDoc, collection, doc, serverTimestamp, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";

import { usePedidos } from "../../../querys/usePedidos";
import { useCuentas } from "../../../../Cuentas/querys/useCuentas";
import { ArrowLeft, CreditCard, Ghost, WalletCards, Trash2, Pencil } from "lucide-react";

import ModalAgregarEditarPago from "../../ModalAgregarEditarPago/ModalAgregarEditarPago";
import ModalConfirmarEliminacion from "../../../../../components/modals/ModalConfirmarEliminacion/ModalConfirmarEliminacion";

export default function GestionarPagos() {
    const {pedidoId} = useParams();
    const navigate = useNavigate();
    const [estadoDelModal, setEstadoDelModal] = useState(false);
    const [estadoDelModalEliminar, setEstadoDelModalEliminar] = useState(false);

    const [pagoAEliminar, setPagoAEliminar] = useState("")
    const [pagoActual, setPagoActual] = useState(null);

    const [guardandoPago, setGuardandoPago] = useState(false);
    const {data: datosDePedidos = [], isLoading, isError, error} = usePedidos();
    const {data: datosDeCuentas = []} = useCuentas();

    const pedido = useMemo(() => {
        return datosDePedidos.find((pedidoActual) => pedidoActual.id === pedidoId);
    }, [datosDePedidos, pedidoId]);

    const cuentasMap = useMemo(() => {
        return new Map(datosDeCuentas.map((cuenta) => [cuenta.id, cuenta.nombre]));
    }, [datosDeCuentas]);

    const resumenPorCuenta = useMemo(() => {
        const resumen = new Map();
        (pedido?.pagos || []).forEach((pago) => {
            const cuentaId = pago.cuenta_bancaria_id;
            if (!cuentaId) return;
            const monto = Number(pago.total_pago || 0);

            if (!resumen.has(cuentaId)) {
                resumen.set(cuentaId, {
                    cuentaId,
                    nombre: cuentasMap.get(cuentaId) || "Cuenta no encontrada",
                    total: 0,
                    cantidadPagos: 0,
                });
            }
            const cuenta = resumen.get(cuentaId);
            cuenta.total += monto;
            cuenta.cantidadPagos += 1;
        });
        return Array.from(resumen.values());
    }, [pedido?.pagos, cuentasMap]);

    const totalPedido = Number(pedido?.total_pedido || 0);
    const totalPagado = Number(pedido?.total_pagado || 0);
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
    }

    const abrirModalAgregarPago = () => {
        setPagoActual(null); setEstadoDelModal(true);
    };

    const abrirModalEditarPago = (pago) => {
        setPagoActual({
            ...pago,
            cuenta_bancaria_nombre: cuentasMap.get(pago.cuenta_bancaria_id) || "Cuenta bancaria" });
        setEstadoDelModal(true);
    };

    const cerrarModalPago = () => {
        if (guardandoPago) return;
        setEstadoDelModal(false); setPagoActual(null);
    };

    const obtenerRutaDesdeURL = (url) => {
        try {
            const partes = url.split('/o/')[1];
            if (!partes) return null;
            return decodeURIComponent(partes.split('?')[0]);
        } catch (e) {
            return null;
        }
    };
    const guardarPago = async (pago) => {
        if (!pedidoId || !pago) return;
        try {
            setGuardandoPago(true);
            const pagosRef = collection(db, "pedidos", pedidoId, "pagos");
        
            if (pago.id) {
                const pagoRef = doc(db, "pedidos", pedidoId, "pagos", pago.id);
                let oldStoragePath = pago.comprobante_path || obtenerRutaDesdeURL(pago.comprobante_url);
                const datosPago = {
                    total_pago: Number(pago.total_pago),
                    fecha_pago: pago.fecha_pago,
                    cuenta_bancaria_id: pago.cuenta_bancaria_id,
                    fecha_actualizacion: serverTimestamp(),
                };
                if (pago.comprobante_archivo) {
                    const archivo = pago.comprobante_archivo;
                    const extension = archivo.name.split('.').pop();
                    const nuevaRutaStorage = `pedidos/${pedidoId}/pagos/${pago.id}/comprobante_${Date.now()}.${extension}`;
                    const comprobanteRef = ref(storage, nuevaRutaStorage);

                    await uploadBytes(comprobanteRef, archivo, { contentType: archivo.type });
                    const nuevaComprobanteUrl = await getDownloadURL(comprobanteRef);
                    datosPago.comprobante_url = nuevaComprobanteUrl;
                    datosPago.comprobante_path = nuevaRutaStorage;
                }
                await updateDoc(pagoRef, datosPago);
                if (oldStoragePath && pago.comprobante_archivo) {
                    try {
                        const oldRef = ref(storage, oldStoragePath);
                        await deleteObject(oldRef);
                    } catch (deleteError) {
                        console.warn("No se pudo eliminar el comprobante antiguo, pero los datos se actualizaron correctamente.", deleteError);
                    }
                }
            }
            else {
                const nuevoPagoRef = await addDoc( pagosRef,
                    {
                        total_pago: Number(pago.total_pago),
                        fecha_pago: pago.fecha_pago,
                        cuenta_bancaria_id: pago.cuenta_bancaria_id,
                        comprobante_url: "",
                        comprobante_path: "",
                        fecha_actualizacion: serverTimestamp(),
                    }
                );
                if (pago.comprobante_archivo) {
                    const archivo = pago.comprobante_archivo;
                    const extension = archivo.name.split('.').pop();
                    const rutaStorage = `pedidos/${pedidoId}/pagos/${nuevoPagoRef.id}/comprobante_${Date.now()}.${extension}`;
                    const comprobanteRef = ref(storage, rutaStorage);

                    await uploadBytes(comprobanteRef, archivo, { contentType: archivo.type });
                    const comprobanteUrl = await getDownloadURL(comprobanteRef);

                    await updateDoc(nuevoPagoRef, {
                        comprobante_url: comprobanteUrl,
                        comprobante_path: rutaStorage,
                        fecha_actualizacion: serverTimestamp(),
                    });
                }
            }
            cerrarModalPago();
        } catch (error) {
            console.error("Error al guardar el pago:", error);
            throw new Error("No se pudo guardar el pago.");
        } finally {
            setGuardandoPago(false);
        }
    };   

    const abrirModalEliminar = (pago) => {
        setPagoAEliminar(pago);
        setEstadoDelModalEliminar(true);
    };
    const cerrarModalEliminar = () => {
        if (guardandoPago) return;
        setEstadoDelModalEliminar(false);
        setPagoAEliminar(null);
    };

    const eliminarPago = async (pago) => {
        if (!pago?.id) {
        console.error("No ser pudo encontrar el Pago. Recarga la página.");
        throw new Error("El Pago no tiene identificador valido.");
        }
        try{
            try {
                const carpetaPago = ref( storage, `pedidos/${pedidoId}/pagos/${pago.id}` );
                const archivos = await listAll(carpetaPago);
                await Promise.all(archivos.items.map((archivo) => deleteObject(archivo)));
            }catch (error) {
                if (error.code !== "storage/object-not-found") 
                { throw error }};
        const pagoRef = doc(db, "pedidos", pedidoId, "pagos", pago.id);
        await deleteDoc(pagoRef);
        }catch (error) {
        console.error("Error al eliminar el Pago:", error);
        throw error;
        }
    };

    if (isLoading) { return <p>Cargando el pedido...</p> }
    if (isError) { return <p>Error: {error.message}. Error al Cargar el Pedido, recargue la página.</p> }
    if (!pedido) {
        return <p>Pedido no encontrado.</p>;
    }
    return(
        <main className="gestionarPagosPage">
            <div className="productoDetalleHeader gestionarPagosHeader">
                <button
                type="button"
                className="productoVolver"
                onClick={() => navigate(`/pedido/${pedidoId}`)}
                >
                <ArrowLeft size={17} strokeWidth={2} />
                Volver al pedido
                </button>
                
                <span className="pedidoIdentificadorGestionarProducto">
                DETALLES FI. - {pedido.numero_pedido}
                </span>
            </div>

            <section className="verPedidoSeccion">
                <div className="verPedidoSeccionHeader">
                    <span className="verPedidoSeccionLabel">CUENTAS</span>
                </div>
                {resumenPorCuenta.length > 0 && (
                    <div className="gestionarPagosCuentas">
                        <div className="gestionarPagosCuentasGrid">
                            {resumenPorCuenta.map((cuenta) => {
                                const porcentaje = totalPagado > 0
                                    ? Math.round((cuenta.total / totalPagado) * 100)
                                    : 0;

                                return (
                                    <article
                                        className="gestionarPagosCuentaCard"
                                        key={cuenta.cuentaId}
                                    >
                                        <div className="gestionarPagosCuentaHeader">
                                            <div className="gestionarPagosCuentaIcon">
                                                <WalletCards size={19} strokeWidth={1.7} />
                                            </div>

                                            <div className="gestionarPagosCuentaInfo">
                                                <strong>{cuenta.nombre}</strong>
                                            </div> 
                                        </div>

                                        <div className="gestionarPagosCuentaMonto">
                                            <span>TOTAL RECIBIDO</span>
                                            <strong>{formatearPrecio(cuenta.total)}</strong>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                )}
                <div className="verPedidoSeccionHeader">
                    <span className="verPedidoSeccionLabel">PAGOS</span>
                    <button
                        type="button"
                        className="agregarPedidoPagosButton"
                        onClick={abrirModalAgregarPago}
                        disabled={guardandoPago}
                    >
                        <span>AGREGAR PAGO</span>
                    </button>
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
                                <div className="verPedidoPagoAccionesFila">
                                    <button
                                        type="button"
                                        className="agregarPedidoPagoEditar"
                                        onClick={() => abrirModalEditarPago(pago)}
                                        disabled={guardandoPago}
                                        aria-label="Editar pago"
                                    >
                                        <Pencil size={15} strokeWidth={1.8} />
                                    </button>
                                    <button
                                        type="button"
                                        className="agregarPedidoPagoEliminar"
                                        onClick={() => abrirModalEliminar(pago)}
                                        disabled={guardandoPago}
                                        aria-label="Eliminar pago"
                                    >
                                        <Trash2 size={16} strokeWidth={1.8} />
                                    </button>
                                </div>
                            </div>

                            <div className="verPedidoPagoAcciones">
                                {pago.comprobante_url && (
                                    <button
                                        type="button"
                                        className="verPedidoPagoComprobante verPedidoPagoComprobanteDisponible"
                                        onClick={() =>
                                            window.open( pago.comprobante_url, "_blank", "noopener,noreferrer" )   
                                        }
                                    >
                                        <span>REVISAR</span>
                                    </button>
                                )}

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
                        No hay pagos por aquí
                    </h3>
                    </div>
                </div>
                )}
            </section>
            {estadoDelModal && (
                <ModalAgregarEditarPago
                    modalAbierto={estadoDelModal}
                    onCerrarModal={cerrarModalPago}
                    onPagoGuardado={guardarPago}
                    pagoEditar={pagoActual}
                    totalPedido={
                        pagoActual
                            ? restantePedido + Number(pagoActual.total_pago || 0)
                            : restantePedido
                    }
                />
            )}
            {estadoDelModalEliminar && (
            <ModalConfirmarEliminacion
            tipo = "pago"
            dato = {pagoAEliminar}
            modalAbierto = {estadoDelModalEliminar}
            onCerrarModal = {cerrarModalEliminar}
            onConfirmarEliminacion = {eliminarPago}
            /> )}
        </main>
    )
}