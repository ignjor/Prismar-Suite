import { useEffect, useRef, useState } from "react";
import "./ModalAgregarTipoProducto.css";

import { db } from "../../firebase";

import { addDoc, collection, updateDoc, doc, getDoc } from "firebase/firestore";

import {CircleX, CirclePlus, X} from "lucide-react";


export default function ModalAgregarTipoProducto({ abierto, onCerrar, onTipoPrendaAgregado, tipoPrenda }) {
    const [nombreTipoPrenda, setNombreTipoPrenda] = useState("");
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);

    /* Creamos esta funcion para validad los inputs, en nuestro caso este caso es solo el nombre del colegio, para limitar
    los nombres especiales y tambien limitar las inserciones de codigo, pero obvio esto no es seguridad, porque todo lo del front
    end se puede vulnerar facil desde el navegador con un devtool, por eso tambien colocamos reglas de firestore seguras para evitar
    insercioens de codigo. */ 
    const validadNombre = (tipoPrenda) => {
        const nombreLimpio = tipoPrenda.trim();

        if (nombreLimpio.length === 0) {
            return "Debes ingresar el nombre.";
        }

        if (nombreLimpio.length < 2) {
            return "El nombre debe tener al menos 2 caracteres.";
        }

        if (nombreLimpio.length > 64) {
            return "El nombre no puede superar los 64 caracteres.";
        }

        const caracteresPermitidos =
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.'\-&()]+$/;

        if (!caracteresPermitidos.test(nombreLimpio)) {
            return "El nombre contiene caracteres no permitidos.";
        }

        return null;
    };

    /* Aqui si finalmente agregamos al colegio para guardarlo desde obvio la primera validaciom */
    const agregarTipoPrenda = async () => {
        const nombreLimpio = nombreTipoPrenda.trim();
        const errorValidacion = validadNombre(nombreLimpio);
        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }
        try {
            setGuardando(true);
            setError("");

            if (tipoPrenda) {
                    await updateDoc(
                    doc(db,"tipo_prenda", tipoPrenda.id),
                    {
                        tipo: nombreLimpio
                    }
                );
            } else {
                await addDoc(
                    collection(db, "tipo_prenda"),
                    {
                        tipo: nombreLimpio
                    }
                );

            }
            await onTipoPrendaAgregado()
            setNombreTipoPrenda("");
            onCerrar();
        } catch (error) {
            console.error("Error al agregar a la base de datos:", error);
            setError("No se pudo guardar, intente denuevo.");
        } finally {
            setGuardando(false);
        }
    };


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

    useEffect(() => {
        if (!abierto) {
            setNombreTipoPrenda("");
            setError("");
            return;
        }
        if (tipoPrenda) {
            setNombreTipoPrenda(tipoPrenda.tipo);
        } else {
            setNombreTipoPrenda("");
        }
        setError("");
    }, [abierto, tipoPrenda])
    


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
                {tipoPrenda
                ? "Editar tipo de Prenda / Producto"
                : "Agregar tipo de Prenda / Producto"
                }
            </h2>

            <button
                type="button"
                className="modalColegioClose"
                onClick={onCerrar}
                aria-label="Cerrar"
                disabled={guardando}
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
                Escribe el nombre del tipo de Prenda / Producto
                </label>

                <input
                id="nombreColegio"
                type="text"
                className="modalColegioInput"
                placeholder="Ej. Pantalón, Vestido"
                value={nombreTipoPrenda}
                onChange={(event) => {
                    setNombreTipoPrenda(event.target.value);
                    if (error) {
                        setError("");
                    }
                }}
                maxLength={64}
                autoComplete="off"

                disabled={guardando}
                />
                {error && (
                <p className="modalColegioError">
                    {error}
                </p>
                )}
            </div>

            </div>


            {/* Acciones */}
            <footer className="modalColegioActions">
            
            <button
                type="button"
                className="modalColegioButton modalColegioButtonCancel"
                onClick={onCerrar}
                disabled={guardando}
            >
                <CircleX size={17} strokeWidth={2} />
                <span>
                    Cancelar
                </span>
            </button>

            <button
                type="submit"
                className="modalColegioButton modalColegioButtonPrimary"
                disabled={guardando}
                onClick={agregarTipoPrenda}
            >
                <CirclePlus size={17} strokeWidth={2} />
                <span>
                    {guardando ? "Guardando..." : "Agregar"}
                </span>
            </button>

            </footer>

        </div>

        </div>

    );
    }
