import "./ModalAgregarEditarPago.css";

import { useEffect, useRef, useState } from "react";
import { X, CircleX, Check, Upload, CreditCard, FileText, FileImage } from "lucide-react";

import ModalSelector from "../../../../components/modals/ModalSelector/ModalSelector";

const MAX_ANCHO_IMAGEN = 1200;
const MAX_ALTO_IMAGEN = 1600;
const CALIDAD_WEBP = 0.82;
const FORMATO_IMAGEN = "image/webp";
const TAMANO_MAXIMO_PDF = 2 * 1024 * 1024;
const ESTADOS = {
    IDLE: "idle",
    PROCESSING: "processing",
    SUCCESS: "success",
    ERROR: "error"
};

const esPDF = archivo => archivo?.type === "application/pdf";
const esImagen = archivo => archivo?.type?.startsWith("image/");
const esArchivoCompatible = archivo => esPDF(archivo) || esImagen(archivo);

const formatearTamano = bytes => {
    if (!bytes) return "0 KB";
    const megabytes = bytes / (1024 * 1024);
    return megabytes >= 1 ? `${megabytes.toFixed(2)} MB` : `${Math.ceil(bytes / 1024)} KB`;
};

const procesarImagen = archivo => new Promise((resolve, reject) => {
    const imagen = new Image(), url = URL.createObjectURL(archivo);
    const limpiarURL = () => URL.revokeObjectURL(url);

    imagen.onload = () => {
        limpiarURL();

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { alpha: false });

        if (!ctx) return reject(new Error("No se pudo procesar la imagen."));

        const escala = Math.min(MAX_ANCHO_IMAGEN / imagen.width, MAX_ALTO_IMAGEN / imagen.height, 1);
        const ancho = Math.max(1, Math.round(imagen.width * escala));
        const alto = Math.max(1, Math.round(imagen.height * escala));

        canvas.width = ancho;
        canvas.height = alto;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, ancho, alto);
        ctx.drawImage(imagen, 0, 0, ancho, alto);

        canvas.toBlob(blob => {
            if (!blob) return reject(new Error("No se pudo optimizar la imagen."));

            const nombre = archivo.name?.replace(/\.[^/.]+$/, "") || "comprobante";

            resolve(new File([blob], `${nombre}.webp`, {
                type: FORMATO_IMAGEN,
                lastModified: Date.now()
            }));
        }, FORMATO_IMAGEN, CALIDAD_WEBP);
    };

    imagen.onerror = () => {
        limpiarURL();
        reject(new Error("No se pudo cargar la imagen seleccionada."));
    };

    imagen.src = url;
});

const procesarComprobante = async archivo => {
    if (!archivo) return null;

    if (esPDF(archivo)) {
        if (archivo.size > TAMANO_MAXIMO_PDF) {
            throw new Error(`El PDF es demasiado grande. El máximo permitido es ${formatearTamano(TAMANO_MAXIMO_PDF)}.`);
        }

        return archivo;
    }

    if (esImagen(archivo)) return procesarImagen(archivo);

    throw new Error("El archivo seleccionado no es compatible.");
};

export default function ModalAgregarEditarPago({ modalAbierto, onCerrarModal, onPagoGuardado, pagoEditar = null, totalPedido = 0 }) {
    const areaModalRef = useRef(null);
    const inputArchivoRef = useRef(null);

    const [totalPago, setTotalPago] = useState("");
    const [fechaPago, setFechaPago] = useState("");
    const [cuentaBancaria, setCuentaBancaria] = useState(null);
    const [comprobante, setComprobante] = useState(null);
    const [estado, setEstado] = useState(ESTADOS.IDLE);
    const [error, setError] = useState("");
    const [cuentaSelectorAbierto, setCuentaSelectorAbierto] = useState(false);

    const esEdicion = Boolean(pagoEditar);
    const estaProcesando = estado === ESTADOS.PROCESSING;
    const estaOcupado = estaProcesando || cuentaSelectorAbierto;
    const puedeCerrar = !estaOcupado;
    const totalNumerico = Number(totalPedido || 0);

    const tieneComprobanteAnterior = Boolean(pagoEditar?.comprobante_url || pagoEditar?.comprobante_path);

    const limpiarEstado = () => {
        setTotalPago("");
        setFechaPago("");
        setCuentaBancaria(null);
        setComprobante(null);
        setCuentaSelectorAbierto(false);
        setEstado(ESTADOS.IDLE);
        setError("");
    };

    const limpiarError = () => setError("");

    useEffect(() => {
        if (!modalAbierto) {
            document.body.style.overflow = "";
            limpiarEstado();
            return;
        }
        document.body.style.overflow = "hidden";

        if (pagoEditar) {
            setTotalPago(pagoEditar.total_pago != null ? String(pagoEditar.total_pago) : "");
            setFechaPago(pagoEditar.fecha_pago || "");
            setCuentaBancaria(
                pagoEditar.cuenta_bancaria_id
                    ? { id: pagoEditar.cuenta_bancaria_id, nombre: pagoEditar.cuenta_bancaria_nombre || "Cuenta bancaria" }
                    : null
            );
        } else {
            setTotalPago("");
            setFechaPago(new Date().toISOString().split("T")[0]);
            setCuentaBancaria(null);
        }

        setComprobante(null);
        setCuentaSelectorAbierto(false);
        setEstado(ESTADOS.IDLE);
        setError("");

        return () => {
            document.body.style.overflow = "";
        };
    }, [modalAbierto, pagoEditar]);

    useEffect(() => {
        if (!modalAbierto) return;

        const manejarClickFuera = event => {
            if (areaModalRef.current && !areaModalRef.current.contains(event.target) && puedeCerrar) onCerrarModal();
        };

        document.addEventListener("mousedown", manejarClickFuera);

        return () => {
            document.removeEventListener("mousedown", manejarClickFuera);
        };
    }, [modalAbierto, puedeCerrar, onCerrarModal]);

    const abrirSelectorCuenta = () => {
        if (estaProcesando) return;
        limpiarError();
        setCuentaSelectorAbierto(true);
    };

    const cerrarSelectorCuenta = () => setCuentaSelectorAbierto(false);

    const seleccionarCuenta = cuenta => {
        if (!cuenta) return;
        setCuentaBancaria(cuenta);
        setCuentaSelectorAbierto(false);
        limpiarError();
    };

    const abrirSelectorArchivo = () => {
        if (estaProcesando) return;
        inputArchivoRef.current?.click();
    };

    const seleccionarArchivo = event => {
        const archivo = event.target.files?.[0];
        event.target.value = "";

        if (!archivo) return;

        if (!esArchivoCompatible(archivo)) {
            setComprobante(null);
            setError("Solo puedes adjuntar archivos PDF o imágenes.");
            return;
        }

        if (esPDF(archivo) && archivo.size > TAMANO_MAXIMO_PDF) {
            setComprobante(null);
            setError(`El PDF es demasiado grande. El máximo permitido es ${formatearTamano(TAMANO_MAXIMO_PDF)}.`);
            return;
        }

        setComprobante(archivo);
        setEstado(ESTADOS.IDLE);
        limpiarError();
    };

    const eliminarComprobante = () => {
        if (estaProcesando) return;
        setComprobante(null);
        setEstado(ESTADOS.IDLE);
        limpiarError();
    };

    const validarPago = () => {
        const monto = Number(totalPago);

        if (!totalPago || Number.isNaN(monto)) {
            setError("Ingresa el monto del pago.");
            return false;
        }
        if (monto <= 0) {
            setError("El monto del pago debe ser mayor a cero.");
            return false;
        }
        if (!fechaPago) {
            setError("Selecciona la fecha del pago.");
            return false;
        }
        if (!cuentaBancaria?.id) {
            setError("Selecciona la cuenta bancaria a la que se realizó el pago.");
            return false;
        }
        if (totalNumerico > 0 && monto > totalNumerico) {
            setError(`El monto pendiente del pedido es de $${totalNumerico.toLocaleString("es-CL")}.`);
            return false;
        }
        return true;
    };

    const guardarPago = async () => {
        if (estaProcesando || !validarPago()) return;

        try {
            setError("");
            setEstado(ESTADOS.PROCESSING);

            const comprobanteArchivo = comprobante ? await procesarComprobante(comprobante) : null;

            const pago = {
                ...(pagoEditar || {}),
                total_pago: Number(totalPago),
                fecha_pago: fechaPago,
                cuenta_bancaria_id: cuentaBancaria.id,
                comprobante_archivo: comprobanteArchivo
            };

            await onPagoGuardado(pago);
            setEstado(ESTADOS.SUCCESS);
            setTimeout(onCerrarModal, 500);
        } catch (errorGuardar) {
            console.error("Error al preparar el pago:", errorGuardar);
            setEstado(ESTADOS.ERROR);
            setError(errorGuardar?.message || "No se pudo preparar el pago.");
        }
    };

    const cerrarModal = () => {
        if (puedeCerrar) onCerrarModal();
    };

    if (!modalAbierto) return null;

    return (
        <>
            <div
                className="modalAgregarEditarPagoOverlay"
                onMouseDown={event => {
                    if (event.target === event.currentTarget && puedeCerrar) cerrarModal();
                }}
            >
                <section
                    ref={areaModalRef}
                    className="modalAgregarEditarPago"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modalAgregarEditarPagoTitulo"
                >
                    <header className="modalAgregarEditarPagoHeader">
                        <h2 id="modalAgregarEditarPagoTitulo">{esEdicion ? "Editar pago" : "Agregar pago"}</h2>

                        <button type="button" className="modalAgregarEditarPagoCerrar" onClick={cerrarModal} disabled={!puedeCerrar} aria-label="Cerrar">
                            <X size={19} strokeWidth={2} />
                        </button>
                    </header>

                    <div className="modalAgregarEditarPagoContenido">
                        <div className="modalAgregarEditarPagoCampo">
                            <label htmlFor="totalPago">Monto del pago</label>

                            <div className="modalAgregarEditarPagoInputMoneda">
                                <span>$</span>
                                <input
                                    id="totalPago"
                                    type="text"
                                    inputMode="decimal"
                                    maxLength={9}
                                    value={totalPago ? Number(totalPago).toLocaleString("es-CL") : ""}
                                    onChange={event => {
                                        const valor = event.target.value.replace(/\D/g, "");
                                        setTotalPago(valor);
                                        limpiarError();
                                    }}
                                    placeholder="0"
                                    disabled={estaOcupado}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className="modalAgregarEditarPagoCampo">
                            <label htmlFor="fechaPago">Fecha del pago</label>
                            <div className="modalAgregarEditarPagoInputIcono">
                                <input
                                    id="fechaPago"
                                    type="date"
                                    value={fechaPago}
                                    onChange={event => {
                                        setFechaPago(event.target.value);
                                        limpiarError();
                                    }}
                                    disabled={estaOcupado}
                                />
                            </div>
                        </div>
                        <div className="modalAgregarEditarPagoCampo">
                            <label>Cuenta bancaria</label>
                            <button type="button" className="modalAgregarEditarPagoSelector" onClick={abrirSelectorCuenta} disabled={estaOcupado}>
                                <span className="modalAgregarEditarPagoSelectorIcono">
                                    <CreditCard size={18} strokeWidth={1.8} />
                                </span>
                                <span className="modalAgregarEditarPagoSelectorTexto">
                                    {cuentaBancaria?.nombre || "Seleccionar cuenta bancaria"}
                                </span>
                                <span className="modalAgregarEditarPagoSelectorFlecha">›</span>
                            </button>
                        </div>

                        <div className="modalAgregarEditarPagoCampo">
                            <label>Comprobante bancario</label>
                            <input
                                ref={inputArchivoRef}
                                type="file"
                                accept="application/pdf,image/*"
                                onChange={seleccionarArchivo}
                                className="modalAgregarEditarPagoInputArchivo"
                            />
                            {!comprobante ? (
                                <>
                                    <button type="button" className="modalAgregarEditarPagoComprobante" onClick={abrirSelectorArchivo} disabled={estaOcupado}>
                                        <span className="modalAgregarEditarPagoComprobanteIcono">
                                            <Upload size={18} strokeWidth={1.8} />
                                        </span>
                                        <span>Adjuntar comprobante</span>
                                    </button>
                                </>
                            ) : (
                                <div className="modalAgregarEditarPagoComprobanteSeleccionado">
                                    <div className="modalAgregarEditarPagoComprobanteSeleccionadoIcono">
                                        {esPDF(comprobante) ? (
                                            <FileText size={18} strokeWidth={1.8} />
                                        ) : (
                                            <FileImage size={18} strokeWidth={1.8} />
                                        )}
                                    </div>
                                    <div>
                                        <strong>{comprobante.name || "Comprobante"}</strong>
                                        <span>{formatearTamano(comprobante.size)}</span>
                                    </div>
                                    <button type="button" onClick={eliminarComprobante} disabled={estaOcupado} aria-label="Eliminar comprobante">
                                        <X size={16} strokeWidth={2} />
                                    </button>
                                </div>
                            )}
                        </div>
                        {estado === ESTADOS.PROCESSING && (
                            <div className="modalAgregarEditarPagoProcesando">
                                <span className="modalAgregarEditarPagoSpinner" />
                                <span>Procesando comprobante...</span>
                            </div>
                        )}
                        {estado === ESTADOS.SUCCESS && (
                            <div className="modalAgregarEditarPagoEstadoExito">
                                <Check size={18} />
                                <span>Pago preparado correctamente</span>
                            </div>
                        )}
                        {error && <p className="modalAgregarEditarPagoError">{error}</p>}
                    </div>
                    <footer className="modalAgregarEditarPagoFooter">
                        <button type="button" className="modalAgregarEditarPagoCancelar" onClick={cerrarModal} disabled={!puedeCerrar}>
                            <CircleX size={16} strokeWidth={1.8} />
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="modalAgregarEditarPagoGuardar"
                            onClick={guardarPago}
                            disabled={estaProcesando || estado === ESTADOS.SUCCESS}
                        >
                            {estaProcesando ? (
                                <>
                                    <span className="modalAgregarEditarPagoSpinner modalAgregarEditarPagoSpinnerBlanco" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <Check size={16} strokeWidth={1.9} />
                                    {esEdicion ? "Guardar cambios" : "Agregar pago"}
                                </>
                            )}
                        </button>
                    </footer>
                </section>
            </div>
            <ModalSelector
                tipo="cuentaBancaria"
                modalAbierto={cuentaSelectorAbierto}
                onCerrarModal={cerrarSelectorCuenta}
                onSeleccionarCuenta={seleccionarCuenta}
            />
        </>
    );
}