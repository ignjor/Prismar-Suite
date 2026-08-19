import { useEffect, useRef } from "react";
import "./ModalAgregarColegio.css";
import {PencilLine, Eraser, School, CircleX, CirclePlus, X} from "lucide-react";



export default function ModalAgregarColegio({ abierto, onCerrar }) {

    const modalRef = useRef(null);

    useEffect(() => {
        if (!abierto) {
            return;
        }
        const clickFuera = (event) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target)
            ) {
                onCerrar();
            }
        };
        document.addEventListener("mousedown", clickFuera);
        return () => {
            document.removeEventListener(
                "mousedown",
                clickFuera
            );
        };
    }, [abierto, onCerrar]);


  // Si el modal no está abierto, no renderizamos nada.
    if (!abierto) {
        return null;
    }

    return (

        <div className="modalColegioOverlay">

        <div
            className="modalColegio"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalColegioTitle"
            ref = {modalRef}
        >

            {/* Encabezado del modal */}
            <header className="modalColegioHeader">

            <h2
                id="modalColegioTitle"
                className="modalColegioTitle"
            >
                Agregar Empresa / Colegio
            </h2>

            <button
                type="button"
                className="modalColegioClose"
                onClick={onCerrar}
                aria-label="Cerrar"
            >
                <X size={17} strokeWidth={2} />
            </button>

            </header>


            {/* Contenido principal */}
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
                />

            </div>

            </div>


            {/* Acciones */}
            <footer className="modalColegioActions">

            <button
                type="button"
                className="modalColegioButton modalColegioButtonCancel"
                onClick={onCerrar}
            >
                <CircleX size={17} strokeWidth={2} />
                <span>
                    Cancelar
                </span>
            </button>

            <button
                type="button"
                className="modalColegioButton modalColegioButtonPrimary"
            >
                <CirclePlus size={17} strokeWidth={2} />
                <span>
                    Agregar
                </span>
            </button>

            </footer>

        </div>

        </div>

    );
    }
