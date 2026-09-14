import { use, useEffect, useReducer, useRef, useState } from "react";
import "./ModalFotoProducto.css";

import { db, storage } from "../../../../firebase";
import { updateDoc, doc} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { Camera, Check, ImagePlus, Upload, CircleX, X } from "lucide-react";

const body = document.body;

const TAMANO_IMAGEN = 400;
const CALIDAD_WEBP = 0.82;
const FORMATO_IMAGEN= "image/webp";
const ESTADOS = { IDLE: "idle", PROCESSING: "processing", UPLOADING: "uploading", SUCCESS: "success", ERROR: "error" };

const procesarImagen = (archivo) => {
    return new Promise((resolve, reject) => {
        const imagen = new Image();
        const url = URL.createObjectURL(archivo);

        imagen.onload = () => {URL.revokeObjectURL(url);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) {reject(new Error("No se pudo procesar la imagen."));
                return;
            }
            canvas.width = TAMANO_IMAGEN;
            canvas.height = TAMANO_IMAGEN;

            const escala = Math.max( TAMANO_IMAGEN / imagen.width, TAMANO_IMAGEN / imagen.height );

            const nuevoAncho = imagen.width * escala;
            const nuevoAlto = imagen.height * escala;
            const x = (TAMANO_IMAGEN - nuevoAncho) / 2;
            const y = (TAMANO_IMAGEN - nuevoAlto) / 2;

            ctx.fillStyle ="#ffffff";
            ctx.fillRect(0, 0, TAMANO_IMAGEN, TAMANO_IMAGEN);
            ctx.drawImage(imagen, x, y, nuevoAncho, nuevoAlto);

            canvas.toBlob((blob) => {if (!blob) {
                reject(new Error("No se pudo procesar la imagen."));
                return
                }
                resolve(blob);
                }, FORMATO_IMAGEN, CALIDAD_WEBP);
        };
        
        imagen.onerror = () => {URL.revokeObjectURL(url);
            reject(new Error("No se pudo cargar la imagen."));
        };
        imagen.src = url;
    });
};

const obtenerRutaImagen = (productoId) => {return `productos/${productoId}/imagen.webp`;
};

export default function ModalFotoProducto({ producto, modalAbierto, onCerrarModal }) {
    const inputArchivoRef = useRef(null);
    const inputCamaraRef = useRef(null);
    const RefAreaDelModal = useRef(null)

    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [preview, setPreview] = useState("");
    const [estado, setEstado] = useState(ESTADOS.IDLE);
    const [error, setError] = useState("");  

    const estaOcupado =
    estado === ESTADOS.PROCESSING ||
    estado === ESTADOS.UPLOADING;
    const puedeCerrar = !estaOcupado;
    const puedeGuardar =
        archivoSeleccionado &&
        !estaOcupado &&
        estado !== ESTADOS.SUCCESS;

    useEffect(() => {
        if (!modalAbierto) {
            body.style.overflow="";
            setArchivoSeleccionado(null);
            setPreview("");
            setEstado(ESTADOS.IDLE);
            setError("");
            return;
        }
        body.style.overflow="hidden";
        return () => {
          body.style.overflow = "";
        };
    }, [modalAbierto])

    useEffect(() => {
        if (!archivoSeleccionado) {
        setPreview("");
        return;
        }
        const url = URL.createObjectURL(archivoSeleccionado);
        setPreview(url);
        return () => {
        URL.revokeObjectURL(url);
        };
    }, [archivoSeleccionado]);

    useEffect(() => {
        if (!modalAbierto) {
            return;
        }
        body.style.overflow="hidden";
        const clickFueraDelModal = (event) => {
            if (RefAreaDelModal.current &&
                !RefAreaDelModal.current.contains(event.target) &&
                puedeCerrar){
                onCerrarModal();
            }
        };
        document.addEventListener("mousedown", clickFueraDelModal);
        return () => {document.removeEventListener("mousedown", clickFueraDelModal);
        };
    }, [modalAbierto, onCerrarModal, puedeCerrar]);

    const seleccionarArchivo = (event) => {
        const archivo = event.target.files?.[0];
        if (!archivo) {
            return;
        }
        if (!archivo.type.startsWith("image/")) {
            setError("El archivo no es compatible");
            return;
        }
        setError("");
        setEstado(ESTADOS.IDLE);
        setArchivoSeleccionado(archivo);
        event.target.value = "";
    };

    const abrirSelectorArchivos = () => {
        inputArchivoRef.current?.click();
    };
    const abrirCamara = () => {
        inputCamaraRef.current?.click();
    };

    const cerrarModal = () => {
        if (!puedeCerrar) {
            return;
        }
        onCerrarModal();
    };
    
    const guardarFoto = async () => {
        if (!archivoSeleccionado) {
            setError("No has subido la imagen del producto.");
            return;
        }
        try {
            setError("");
            setEstado(ESTADOS.PROCESSING);
            const imagenWebp = await procesarImagen(archivoSeleccionado);
            setEstado(ESTADOS.UPLOADING);

            const rutaStorage = obtenerRutaImagen(producto.id);
            const imagenRef = ref(storage, rutaStorage);

            await uploadBytes(imagenRef, imagenWebp, {contentType: FORMATO_IMAGEN});

            const nuevaUrl = await getDownloadURL(imagenRef);
            const productoRef = doc(db, "productos", producto.id);
            await updateDoc(productoRef, {imagen: nuevaUrl});
            setEstado(ESTADOS.SUCCESS);

            setTimeout(() => {onCerrarModal();}, 900);
        }catch (error) {
            console.error("Error al subir la imagen",error);
            setEstado(ESTADOS.ERROR);
            setError(error?.message || "No se pudo actualizar la foto.");
        }
    };

    if (!modalAbierto) {
        return null;
    }
    return (
        <div
        className="modalFotoOverlay"
        onMouseDown={(event) => {
            if (
            event.target === event.currentTarget &&
            puedeCerrar
            ) {
            cerrarModal();
            }
        }}
        >
        <section
            className="modalFoto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalFotoTitulo"
        >
            <header className="modalFotoHeader">
            <div>
                <h2 id="modalFotoTitulo">
                Foto de Producto
                </h2>
            </div>
            <button
                type="button"
                className="modalFotoCerrar"
                onClick={cerrarModal}
                disabled={!puedeCerrar}
                aria-label="Cerrar"
            >
                <X size={19} />
            </button>
            </header>
            <div className="modalFotoContenido">
            <div className="modalFotoPreview">
                {preview ? (
                <img
                    src={preview}
                    alt={`Vista previa de ${producto.nombre}`}
                />
                ) : producto.imagen ? (
                <img
                    src={producto.imagen}
                    alt={`Imagen actual de ${producto.nombre}`}
                />
                ) : (
                <div className="modalFotoPreviewVacio">
                    <ImagePlus size={42} />
                    <span>
                    No hay una imagen
                    </span>
                </div>
                )}
            </div>
            <input
                ref={inputArchivoRef}
                type="file"
                accept="image/*"
                onChange={seleccionarArchivo}
                className="modalFotoInputOculto"
            />
            <input
                ref={inputCamaraRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={seleccionarArchivo}
                className="modalFotoInputOculto"
            />
            {!preview && (
                <div className="modalFotoOpciones">
                <button
                    type="button"
                    className="modalFotoOpcion"
                    onClick={abrirSelectorArchivos}
                    disabled={estaOcupado}
                >
                    <span className="modalFotoOpcionIcono">
                    <ImagePlus size={20} />
                    </span>
                    <span>
                    <strong>
                        Galeria
                    </strong>
                    </span>
                </button>
                <button
                    type="button"
                    className="modalFotoOpcion"
                    onClick={abrirCamara}
                    disabled={estaOcupado}
                >
                    <span className="modalFotoOpcionIcono">
                    <Camera size={20} />
                    </span>
                    <span>
                    <strong>
                        Abrir Cámara
                    </strong>
                    </span>
                </button>
                </div>
            )}
            {preview && !estaOcupado && (
                <button
                type="button"
                className="modalFotoCambiar"
                onClick={abrirSelectorArchivos}
                >
                <ImagePlus size={17} />
                Subir otra foto
                </button>
            )}
            {(estado === ESTADOS.PROCESSING ||
                estado === ESTADOS.UPLOADING) && (
                <div className="modalFotoEstado">
                <span>
                    {estado === ESTADOS.PROCESSING
                    ? "Procesando imagen..."
                    : "Subiendo foto..."}
                </span>
                </div>
            )}
            {estado === ESTADOS.SUCCESS && (
                <div className="modalFotoEstado modalFotoEstadoExito">
                <Check size={19} />
                <span>
                    Foto actualizada
                </span>
                </div>
            )}
            {error && (
                <p className="modalFotoError">
                {error}
                </p>
            )}
            </div>
            <footer className="modalFotoFooter">
            <button
                type="button"
                className="modalFotoCancelar"
                onClick={cerrarModal}
                disabled={!puedeCerrar}
            >
                <CircleX size={16} />
                Cancelar
            </button>
            <button
                type="button"
                className="modalFotoGuardar"
                onClick={guardarFoto}
                disabled={!puedeGuardar}
            >
                {estado === ESTADOS.UPLOADING ? (
                <>
                    Guardando...
                </>
                ) : (
                <>
                    <Upload size={16} />
                    Guardar
                </>
                )}
            </button>
            </footer>
        </section>
        </div>
    );
}