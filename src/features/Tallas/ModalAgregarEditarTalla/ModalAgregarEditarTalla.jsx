import "./ModalAgregarEditarTalla.css";
import { useEffect, useRef, useState } from "react";
import { db } from "../../../firebase";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";

import { CircleX, CirclePlus, X } from "lucide-react";

const body = document.body;
const caracteresPermitidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.'\-&()]+$/;

const validarTextoDeInput = (talla) => {
    const textoValidado = talla.trim();
    if (textoValidado.length < 1) {return "El texto debe tener al menos 1 caracteres.";}
    if (textoValidado.length > 15) {return "El texto no puede superar 15 caracteres.";}
    if (!caracteresPermitidos.test(textoValidado)) {return "El texto contiene caracteres no permitidos.";}
    return null
};


export default function ModalAgregarEditarTalla({datoTallaEditar, modalAbierto, onCerrarModal, onRecargarTallas}){
    const [error, setError] = useState("");
    const [guardandoTalla, setGuardandoTalla] = useState(false);
    const RefAreaDelModal = useRef(null);

    const [talla, setTalla] = useState("");

    useEffect(() => {
        if (!modalAbierto) {
            body.style.overflow="";
            setTalla("");
            setError("");
            return;
        }
        body.style.overflow="hidden";
        if (datoTallaEditar) {
            setTalla(datoTallaEditar.talla)
        }else{
            setTalla("");
        }
        setError("");
    }, [modalAbierto, datoTallaEditar])

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


    const guardarColegioCreadoOEditado = async () => {
        const errorValidacion = validarTextoDeInput(talla);
        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }
        if (datoTallaEditar) {
            await  guardarColegioEditado(talla);
        }else{
            await guardarColegioCreado(talla);
        }
    };

    const guardarColegioCreado = async (textoValidado) => {
        try {
            setGuardandoTalla(true); setError("");
            await addDoc(collection(db, "tallas"),
            {talla: textoValidado}
            );
            await onRecargarTallas()
            setTalla("");
            onCerrarModal();
        }catch(error){
            console.error("Error al Crear el Colegio:",error); setError("No se pudo crear el colegio, intente de nuevo.");
        }finally{setGuardandoTalla(false)}
    };
    
    const guardarColegioEditado = async (textoValidado) => {
        try {
            setGuardandoTalla(true); setError("");
            await updateDoc(doc(db, "tallas", datoTallaEditar.id),
                {talla: textoValidado}
            );
            await onRecargarTallas()
            setTalla("");
            onCerrarModal();
        }catch(error){
            console.error("Error al Editar el Colegio:",error); setError("No se pudo editar el colegio, intente de nuevo.");
        }finally{setGuardandoTalla(false)}
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
                    {datoTallaEditar
                    ? "Editar Talla"
                    : "Agregar Talla"
                    }
                </h2>
                <button
                    type="button"
                    className="modalColegioClose"
                    onClick={onCerrarModal}
                    aria-label="Cerrar"
                    disabled={guardandoTalla}
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
                        Escribe la talla, luego podras asignarla al producto que escojas
                        </label>
                        <input
                        id="nombreColegio"
                        type="text"
                        className="modalColegioInput"
                        placeholder="Ej. Colegio San José"
                        value={talla}
                        onChange={(event) => {
                            setTalla(event.target.value);
                            if (error) {
                                setError("");
                            }
                        }}
                        maxLength={15}
                        autoComplete="off"
                        disabled={guardandoTalla}
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
                    disabled={guardandoTalla}
                >
                    <CircleX size={17} strokeWidth={2} />
                    <span>
                        Cancelar
                    </span>
                </button>

                <button
                    type="submit"
                    className="modalColegioButton modalColegioButtonPrimary"
                    disabled={guardandoTalla}
                    onClick={guardarColegioCreadoOEditado}
                >
                    <CirclePlus size={17} strokeWidth={2} />
                    <span>
                        {guardandoTalla ? "Guardando..." : "Agregar"}
                    </span>
                </button>
                </footer>
            </div>
        </div>
    )
}