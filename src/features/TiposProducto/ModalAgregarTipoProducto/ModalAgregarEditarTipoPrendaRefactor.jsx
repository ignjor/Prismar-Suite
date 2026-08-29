import { useEffect, useRef, useState } from "react";
import "./ModalAgregarTipoProducto.css";

import { db } from "../../../firebase";
import { addDoc, collection, updateDoc, doc} from "firebase/firestore";

import {CircleX, CirclePlus, X, Trash2, PencilRuler
} from "lucide-react";

const body = document.body;

const caracteresPermitidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.'\-&()]+$/;
const validarTextoDeInput = (datosDeLosInput) => {
    const nombreValidado = datosDeLosInput.trim();
    if (nombreValidado.length < 2) {return "El texto debe tener al menos 2 caracteres.";}
    if (nombreValidado.length > 32) {return "El texto no puede superar 32 caracteres.";}
    if (!caracteresPermitidos.test(nombreValidado)) {return "El texto contiene caracteres no permitidos.";}
    return null
};

export default function ModalAgregarEditarTipoPrenda({datoTipoPrendaEditar, modalAbierto, onCerrarModal, onRecargarTipoPrenda}) {
    const [error, setError] = useState("");
    const [guardandoTipoPrenda, setGuardantoTipoPrenda] = useState(false);
    const RefAreaDelModal = useRef(null);

    const [nombreDeTipoPrenda, setNombreDeTipoPrenda] = useState("");
    const [medidasAsignadas, setMedidasAsignadas] = useState([]);

    useEffect(() => {
        if (!modalAbierto) {
            body.style.overflow="";
            setNombreDeTipoPrenda("");
            setMedidasAsignadas([]);
            setError("");
            return;
        }
        body.style.overflow="hidden";
        if (datoTipoPrendaEditar) {
            setNombreDeTipoPrenda(datoTipoPrendaEditar.tipo || "");
            setMedidasAsignadas(Object.keys(datoTipoPrendaEditar.medidas_asig || {}))
        }else{
            setNombreDeTipoPrenda("");
            setMedidasAsignadas([]);
        }
        setError("");
    }, [modalAbierto, datoTipoPrendaEditar])

    





    























    return (
       <div className="modalColegioOverlay">
            <div
                className="modalColegio"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modalColegioTitle"
                ref={modalRef}
            >
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
                        <X
                            size={17}
                            strokeWidth={2}
                        />
                    </button>
                </header>
                <div className="modalColegioContent">
                    <div className="modalColegioField">
                        <label
                            htmlFor="nombreTipoPrenda"
                            className="modalColegioLabel"
                        >
                            Escribe el nombre del tipo de Producto
                        </label>
                        <input
                            id="nombreTipoPrenda"
                            type="text"
                            className="modalColegioInput"
                            placeholder="Ej. Pantalón, Vestido"
                            value={nombreTipoPrenda}
                            onChange={(event) => {
                                setNombreTipoPrenda(
                                    event.target.value
                                );
                                if (error) {
                                    setError("");
                                }
                            }}
                            maxLength={20}
                            autoComplete="off"
                            disabled={guardando}
                        />
                    </div>
                    <div className="modalAtributosContainer">
                        <div className="modalAtributosHeader">
                            <div>
                                <p className="modalColegioLabel">
                                    Atributos / Medidas
                                </p>
                            </div>
                            <span className="modalAtributosContador">
                                {medidasAsignadas.length}/8
                            </span>
                        </div>

                        <div className="modalAtributosLista">
                            {medidasAsignadas.map(
                                (atributo, index) => (
                                    <div
                                        className="modalAtributoItem"
                                        key={index}
                                    >
                                        <input
                                            type="text"
                                            className="modalColegioInput modalAtributoInput"
                                            placeholder="Ej. Contorno"
                                            value={atributo}
                                            onChange={(event) =>
                                                cambiarAtributo(
                                                    index,
                                                    event.target.value
                                                )
                                            }
                                            maxLength={20}
                                            autoComplete="off"
                                            disabled={guardando}
                                        />
                                        <button
                                            type="button"
                                            className="modalAtributoEliminar"
                                            onClick={() =>
                                                eliminarAtributo(
                                                    index
                                                )
                                            }
                                            disabled={guardando}
                                            aria-label={`Eliminar atributo ${index + 1}`}
                                        >
                                            <Trash2
                                                size={17}
                                                strokeWidth={2}
                                            />
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                        <button
                            type="button"
                            className="modalAgregarAtributo"
                            onClick={agregarAtributo}
                            disabled={
                                guardando ||
                                medidasAsignadas.length >= 8
                            }
                        >
                            <PencilRuler
                                size={17}
                                strokeWidth={2}
                            />
                            <span>
                                Sumar Atributo
                            </span>
                        </button>
                    </div>
                    {error && (
                        <p className="modalColegioError">
                            {error}
                        </p>
                    )}
                </div>
                <footer className="modalColegioActions">
                    <button
                        type="button"
                        className="modalColegioButton modalColegioButtonCancel"
                        onClick={onCerrar}
                        disabled={guardando}
                    >
                        <CircleX
                            size={17}
                            strokeWidth={2}
                        />
                        <span>
                            Cancelar
                        </span>
                    </button>
                    <button
                        type="button"
                        className="modalColegioButton modalColegioButtonPrimary"
                        disabled={guardando}
                        onClick={agregarTipoPrenda}
                    >
                        <CirclePlus
                            size={17}
                            strokeWidth={2}
                        />
                        <span>
                            {guardando
                                ? "Guardando...": "Agregar"
                            }
                        </span>
                    </button>
                </footer>
            </div>
        </div>
    )
}