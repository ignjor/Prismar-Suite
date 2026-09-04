import { useEffect, useRef, useState } from "react";
import "./ModalAgregarEditarTipoPrenda.css";

import { db } from "../../../../firebase";
import { addDoc, collection, updateDoc, doc} from "firebase/firestore";

import { CircleX, CirclePlus, X, Trash2, PencilRuler } from "lucide-react";

const body = document.body;
const caracteresPermitidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.'\-&()]+$/;

const validarTextoDeInput = (datosDelInput) => {
    const textoValidado = datosDelInput.trim();
    if (textoValidado.length < 2) {return "El texto debe tener al menos 2 caracteres.";}
    if (textoValidado.length > 32) {return "El texto no puede superar 32 caracteres.";}
    if (!caracteresPermitidos.test(textoValidado)) {return "El texto contiene caracteres no permitidos.";}
    return null
};

const limpiarAtributos = (atributos) => {
    return atributos
        .map((atributo) => atributo.trim()) .filter((atributo) => atributo.length > 0);
};
const validarAtributos = (atributos) => {
    for (const atributo of atributos) {
        const errorDeInput = validarTextoDeInput(atributo);
            if (errorDeInput) {
                return (`El atributo "${atributo}" no es válido.`);
            }
        }
        return null;
};

export default function ModalAgregarEditarTipoPrenda({datoTipoPrendaEditar, modalAbierto, onCerrarModal}) {
    const [error, setError] = useState("");
    const [guardandoTipoPrenda, setGuardandoTipoPrenda] = useState(false);
    const RefAreaDelModal = useRef(null);

    const [nombreDeTipoPrenda, setNombreDeTipoPrenda] = useState("");
    const [atributosAsignados, setAtributosAsignados] = useState([]);

    useEffect(() => {
        if (!modalAbierto) {
            body.style.overflow="";
            setNombreDeTipoPrenda("");
            setAtributosAsignados([]);
            setError("");
            return;
        }
        body.style.overflow="hidden";
        if (datoTipoPrendaEditar) {
            setNombreDeTipoPrenda(datoTipoPrendaEditar.tipo || "");
            setAtributosAsignados(Object.keys(datoTipoPrendaEditar.medidas_asig || {}))
        }else{
            setNombreDeTipoPrenda("");
            setAtributosAsignados([]);
        }
        setError("");
    }, [modalAbierto, datoTipoPrendaEditar])

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


    const guardarTipoPrendaCreadoOEditado = async() => {
        const textoValidado = nombreDeTipoPrenda.trim();
        const errorNombre = validarTextoDeInput(textoValidado);
        if (errorNombre) {setError(errorNombre);
            return;
        }
        const atributosValidados = limpiarAtributos(atributosAsignados);
        const errorAtributos = validarAtributos(atributosValidados);
        if (errorAtributos) {setError(errorAtributos);
            return;
        }
        const atributosAsig = {};
        atributosValidados.forEach((atributo) => {
            atributosAsig[atributo] = "";
        });
        if (datoTipoPrendaEditar) {
            await guardarTipoPrendaEditado(textoValidado, atributosAsig);
        }else{
            await guardarTipoPrendaCreado(textoValidado, atributosAsig);
        }
    };

    const guardarTipoPrendaCreado = async(textoValidado, atributosAsignados) => {
        try {
            setGuardandoTipoPrenda(true); setError("");
            await addDoc(collection(db, "tipo_prenda"),
            {tipo: textoValidado, medidas_asig: atributosAsignados}
        );
        setNombreDeTipoPrenda(""); setAtributosAsignados([]);
        onCerrarModal();
        }catch(error){
            console.error("Error al Crear el Tipo de Prenda:",error); setError("No se pudo crear el Tipo de Prenda, intente de nuevo.");
        }finally{setGuardandoTipoPrenda(false)}
    };

    const guardarTipoPrendaEditado = async(textoValidado, atributosAsignados) => {
        try {
            setGuardandoTipoPrenda(true); setError("");
            await updateDoc(doc(db, "tipo_prenda", datoTipoPrendaEditar.id),
            {tipo: textoValidado, medidas_asig: atributosAsignados}
        );
        setNombreDeTipoPrenda(""); setAtributosAsignados([]);
        onCerrarModal();
        }catch(error){
            console.error("Error al Editar el Tipo de Prenda:",error); setError("No se pudo Editar el Tipo de Prenda, intente de nuevo.");
        }finally{setGuardandoTipoPrenda(false)}
    };

    const sumarAtributo = () => {
        if (atributosAsignados.length >= 8) {
            return;
        }
        setAtributosAsignados([...atributosAsignados, ""]);
    };
    const editarAtributo = (index, valor) => {
        setAtributosAsignados((atributosActuales) => {
            const nuevosAtributos = [...atributosActuales];
            nuevosAtributos[index] = valor;
            return nuevosAtributos;
        });
        setError("");
    };
    const eliminarAtributo = (index) => {
        setAtributosAsignados((atributosActuales) =>
            atributosActuales.filter(
                (_, indice) => indice !== index
            ));
        setError("");
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
                ref={RefAreaDelModal}
            >
                <header className="modalColegioHeader">
                    <h2
                        id="modalColegioTitle"
                        className="modalColegioTitle"
                    >
                        {datoTipoPrendaEditar
                            ? "Editar tipo de Prenda / Producto"
                            : "Agregar tipo de Prenda / Producto"
                        }
                    </h2>
                    <button
                        type="button"
                        className="modalColegioClose"
                        onClick={onCerrarModal}
                        aria-label="Cerrar"
                        disabled={guardandoTipoPrenda}
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
                            value={nombreDeTipoPrenda}
                            onChange={(event) => {
                                setNombreDeTipoPrenda(
                                    event.target.value
                                );
                                if (error) {
                                    setError("");
                                }
                            }}
                            maxLength={20}
                            autoComplete="off"
                            disabled={guardandoTipoPrenda}
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
                                {atributosAsignados.length}/8
                            </span>
                        </div>

                        <div className="modalAtributosLista">
                            {atributosAsignados.map(
                                (atributo, index) => (
                                    <div
                                        className="modalAtributoItem"
                                        key={index}
                                    >
                                        <input
                                            type="text"
                                            className="modalColegioInput modalAtributoInput"
                                            placeholder="Ej. Largo"
                                            value={atributo}
                                            onChange={(event) =>
                                                editarAtributo(
                                                    index,
                                                    event.target.value
                                                )
                                            }
                                            maxLength={20}
                                            autoComplete="off"
                                            disabled={guardandoTipoPrenda}
                                        />
                                        <button
                                            type="button"
                                            className="modalAtributoEliminar"
                                            onClick={() =>
                                                eliminarAtributo(
                                                    index
                                                )
                                            }
                                            disabled={guardandoTipoPrenda}
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
                            onClick={sumarAtributo}
                            disabled={
                                guardandoTipoPrenda ||
                                atributosAsignados.length >= 8
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
                        onClick={onCerrarModal}
                        disabled={guardandoTipoPrenda}
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
                        disabled={guardandoTipoPrenda}
                        onClick={guardarTipoPrendaCreadoOEditado}
                    >
                        <CirclePlus
                            size={17}
                            strokeWidth={2}
                        />
                        <span>
                            {guardandoTipoPrenda
                                ? "Guardando...": "Agregar"
                            }
                        </span>
                    </button>
                </footer>
            </div>
        </div>
    )
}