import "./ModalAgregarEditarColegio.css";
import { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";

import {CircleX, CirclePlus, X} from "lucide-react";

const body = document.body;

const caracteresPermitidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.'\-&()]+$/;
const validarTextoDeInput = (nombreDeColegio) => {
    const nombreValidado = nombreDeColegio.trim();
    if (nombreValidado.length < 2) {return "El texto debe tener al menos 2 caracteres.";}
    if (nombreValidado.length > 32) {return "El texto no puede superar 32 caracteres.";}
    if (!caracteresPermitidos.test(nombreValidado)) {return "El texto contiene caracteres no permitidos.";}
    return null
};

export default function ModalAgregarEditarColegio({datoColegioEditar, modalAbierto, onCerrarModal, onGuardarColegio  }){
    const [error, setError] = useState("");
    const [guardandoColegio, setGuardandoColegio] = useState(false);
    const RefAreaDelModal = useRef(null);

    const [nombreDeColegio ,setNombreDeColegio] = useState("");

    useEffect(() => {
        if (!modalAbierto) {
            body.style.overflow="";
            setNombreDeColegio("");
            setError("");
            return;
        }
        body.style.overflow="hidden";
        if (datoColegioEditar) {
            setNombreDeColegio(datoColegioEditar.nombre)
        }else{
            setNombreDeColegio("");
        }
        setError("");
    }, [modalAbierto, datoColegioEditar])

    useEffect(() => {
        if (!modalAbierto) {
            body.style.overflow="";
            return;
        }
        const clickFueraDelModal = (event) => {
            if (RefAreaDelModal.current && !RefAreaDelModal.current.contains(event.target)){
                onCerrarModal();
            }
        };
        document.addEventListener("mousedown", clickFueraDelModal);
        return () => {document.removeEventListener("mousedown", clickFueraDelModal);
        };
    }, [modalAbierto, onCerrarModal]);


    const guardarColegioCreadoOEditado = () => {
        const errorValidacion = validarTextoDeInput(nombreDeColegio);
        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }
        if (datoColegioEditar) {
            guardarColegioEditado(nombreDeColegio.trim());
        }else{
            guardarColegioCreado(nombreDeColegio.trim());
        }
    };

    const guardarColegioCreado = async (nombreValidado) => {
        try {
            setGuardandoColegio(true); setError("");
            await addDoc(collection(db, "colegios"),{
                nombre: nombreValidado
            });
            await onGuardarColegio()
            setNombreDeColegio("");
            onCerrarModal();
        }catch(error){
            console.error("Error al Crear el Colegio:",error); setError("No se pudo crear el colegio, intente de nuevo.");
        }finally{setGuardandoColegio(false)}
    };
    
    const guardarColegioEditado = async (nombreValidado) => {
        try {
            setGuardandoColegio(true); setError("");
            await updateDoc(doc(db, "colegios", datoColegioEditar.id),{
                nombre: nombreValidado
            });
            await onGuardarColegio()
            setNombreDeColegio("");
            onCerrarModal();
        }catch(error){
            console.error("Error al Editar el Colegio:",error); setError("No se pudo editar el colegio, intente de nuevo.");
        }finally{setGuardandoColegio(false)}
    };
    
    if (!modalAbierto) {
        body.style.overflow="";
        return null;
    }

    return (
        <div className="modalColegioOverlay">
            <div
                className="modalColegio"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modalColegioTitle"
                ref = {RefAreaDelModal}
            >
                <header className="modalColegioHeader">
                <h2
                    id="modalColegioTitle"
                    className="modalColegioTitle"
                >
                    {datoColegioEditar
                    ? "Editar Empresa / Colegio"
                    : "Agregar Empresa / Colegio"
                    }
                </h2>
                <button
                    type="button"
                    className="modalColegioClose"
                    onClick={onCerrarModal}
                    aria-label="Cerrar"
                    disabled={guardandoColegio}
                >
                    <X size={17} strokeWidth={2} />
                </button>
                </header>
                <div className="modalColegioContent">
                    <div className="modalColegioField">
                        <label
                        htmlFor="nombreColegio"
                        className="modalColegioLabel"
                        >
                        Escribe el nombre del afiliado al producto
                        </label>
                        <input
                        id="nombreColegio"
                        type="text"
                        className="modalColegioInput"
                        placeholder="Ej. Colegio San José"
                        value={nombreDeColegio}
                            /*{datoColegioEditar
                                ? nombreDeColegio || datoColegioEditar.nombre
                                : nombreDeColegio
                            }*/
                        onChange={(event) => {
                            setNombreDeColegio(event.target.value);
                            if (error) {
                                setError("");
                            }
                        }}
                        maxLength={32}
                        autoComplete="off"
                        disabled={guardandoColegio}
                        />
                        {error && (
                        <p className="modalColegioError">
                            {error}
                        </p>
                        )}
                    </div>
                </div>

                <footer className="modalColegioActions">
                <button
                    type="button"
                    className="modalColegioButton modalColegioButtonCancel"
                    onClick={onCerrarModal}
                    disabled={guardandoColegio}
                >
                    <CircleX size={17} strokeWidth={2} />
                    <span>
                        Cancelar
                    </span>
                </button>

                <button
                    type="submit"
                    className="modalColegioButton modalColegioButtonPrimary"
                    disabled={guardandoColegio}
                    onClick={guardarColegioCreadoOEditado}
                >
                    <CirclePlus size={17} strokeWidth={2} />
                    <span>
                        {guardandoColegio ? "Guardando..." : "Agregar"}
                    </span>
                </button>
                </footer>
            </div>
        </div>
    )
}