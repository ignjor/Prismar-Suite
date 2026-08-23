import { useEffect, useRef, useState } from "react";
import "./ModalAgregarTipoProducto.css";

import { db } from "../../firebase";
import { addDoc, collection, updateDoc, doc, getDoc } from "firebase/firestore";

import {CircleX, CirclePlus, X, Plus, Trash2, IndianRupee, Key
} from "lucide-react";

/* Creamos la funcion del modal, que va a tener todas las funciones, y lo hacemos llamando a las variables y estados que 
traemos desde TipoPrenda que es donde se usa este modal principalmente */
export default function ModalAgregarTipoProducto({abierto, onCerrar, onTipoPrendaAgregado, tipoPrenda}) {
    const [nombreTipoPrenda, setNombreTipoPrenda] = useState("");
    const [medidasAsignadas, setMedidasAsignadas] = useState([]); /*Esta de las medidas es una lista porque cuando creamos, no sabemos cuantos va acrear, solo sabemos que maximo 10 */

    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);
    
    const modalRef = useRef(null);

    /* Validamos nombre, bueno no nombre si no los imputs, se llama nombre por que la cree en colegios y lo que funciona no se cambia
    La usamos para validar los inputs dentro del Tipo y las medidas asig. */
    const validarNombre = (nombre) => {

        const nombreLimpio = nombre.trim();

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



    /* Esta funcion agrega atributo, es simplemente para ver cuantos hay, si hay menos de 10, que lo agregue nomas*/
    const agregarAtributo = () => {
        if (medidasAsignadas.length >= 10){
            return;
        }
        setMedidasAsignadas([
            ...medidasAsignadas,""
        ]);
    };

    /* Aqui cambiamos atributo, recibimos el index del medidasasignadas, la opciocon del array, com oes un array empieza de 0 pa lante.*/
    const cambiarAtributo = (index, valor) => {
        setMedidasAsignadas((atributosActuales) => {
            const nuevosAtributos = [...atributosActuales];
            nuevosAtributos[index] = valor;
            return nuevosAtributos;
        });
        setError("");
    }

    /* ahora aqui usamos esta funcion para eliminar el atributo necesario dentor del array con filter, asi sin arrastrar lo otro jasjda, y no haciendolo antes de que apretemos borrar */
    const eliminarAtributo = (index) => {
        setMedidasAsignadas((atributosActuales) =>
            atributosActuales.filter(
                (_, indice) => indice !== index
            ));
        setError
    }



    /* Aqui guardamos el tipo, es decir el nombre, es practicamente en funcion identica a la del modal de colegios
    en el nombre. AGREGAmOS eso si, lo de las medidas, y aplicamos lo mismo par a el input, el tema del nombre limpio con nuestras
    restricciones y varchar, que en realidad como es frontend no restringe nadajs dja, porque las reales restricciones estan dentro de 
    firestore rules*/
    const agregarTipoPrenda = async () => {
        const nombreLimpio = nombreTipoPrenda.trim();
        const errorValidacion =
            validarNombre(nombreLimpio);

        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        const atributosLimpios = medidasAsignadas
            /* Este sabrongo, mira lo que hace, te convierte un array en un map despues del trim, entonces, te toma los 
            espacios, los borra, y lo convierte en un array, una chulada papá. */ 
            .map((atributo) => atributo.trim()) .filter((atributo) => atributo.length > 0);
        /*Esta funcion, la ame tambien, mira lo que te hace, ahorra te recorre tooodo, con el for por el map, y lo valida, si no, no lo pasa
        especficamente ese valor, una locura*/
        for (const atributo of atributosLimpios) {
            const errorAtributo =
                validarNombre(atributo);
            if (errorAtributo) {
                setError("El atributo no es valido:",atributo);
            } 
            return;
        }
        /*  Aqui tambien tenemos el juguito, esto es importante a morir, porque sí, convertrmos en map antes, pero aquia lo guardamos*/
        const medidasAsig = {};
        /*Esta funcion es lo duro, porque toma la medida_asig, toma el atributo que tenemos que en nuestro caso quizas ancho de espalda y la convierte en ["Ancho de espalda" = ""] */
        atributosLimpios.forEach((atributo) => {
            medidasAsig[atributo] = "";
        });
        try {
            setGuardando(true);
            setError("");
        /* Aqui es para cargar los datos de la coll si estamos editando */
            if (tipoPrenda) {
                await updateDoc(doc( db, "tipo_prenda", tipoPrenda.id),
                    {tipo:nombreLimpio, medidasAsig:medidasAsig}
                );
        /* Esta es para crear, por eso no llamamos ningun id, porque firestore la crea sola con el addDod :)*/ 
            } else {
                await addDoc(collection( db, "tipo_prenda"),
                    {tipo:nombreLimpio, medidasAsig:medidasAsig}
                    
                );
            }
            await onTipoPrendaAgregado();
            setNombreTipoPrenda("");
            setMedidasAsignadas([]);
            setError("");
            onCerrar();
        }   catch (error){
                console.error("Error al ejecutar la operación ",error); setError("No se puedo guardar, intentelo nuevamente.")
        }   finally {
                setGuardando(false);
        }
    };



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
            setMedidasAsignadas([]);
            setError("");
            return;
        }
        if (tipoPrenda) {
            setNombreTipoPrenda(tipoPrenda.tipo || "");
            setMedidasAsignadas(Object.keys(tipoPrenda.medidas_asig || {}))
        } else {
            setNombreTipoPrenda("");
            setMedidasAsignadas([]);
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
                ref={modalRef}
            >
                {/* HEADER */}
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

                {/* CONTENIDO */}
                <div className="modalColegioContent">
                    {/* NOMBRE DEL TIPO */}
                    <div className="modalColegioField">
                        <label
                            htmlFor="nombreTipoPrenda"
                            className="modalColegioLabel"
                        >
                            Escribe el nombre del tipo de
                            Prenda / Producto
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
                            maxLength={64}
                            autoComplete="off"
                            disabled={guardando}
                        />
                    </div>

                    {/* ATRIBUTOS */}
                    <div className="modalAtributosContainer">
                        <div className="modalAtributosHeader">
                            <div>
                                <p className="modalColegioLabel">
                                    Atributos / Medidas
                                </p>
                                <span className="modalAtributosDescripcion">
                                    Opcional · máximo 10
                                </span>
                            </div>
                            <span className="modalAtributosContador">
                                {medidasAsignadas.length}/10
                            </span>
                        </div>

                        {/* INPUTS DE ATRIBUTOS */}
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
                                            maxLength={64}
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

                        {/* AGREGAR ATRIBUTO */}
                        <button
                            type="button"
                            className="modalAgregarAtributo"
                            onClick={agregarAtributo}
                            disabled={
                                guardando ||
                                medidasAsignadas.length >= 10
                            }
                        >
                            <Plus
                                size={17}
                                strokeWidth={2}
                            />
                            <span>
                                Agregar atributo
                            </span>
                        </button>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <p className="modalColegioError">
                            {error}
                        </p>
                    )}
                </div>

                {/* BOTONES */}
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
                                ? "Guardando..."
                                : tipoPrenda
                                    ? "Guardar cambios"
                                    : "Agregar"
                            }
                        </span>
                    </button>
                </footer>
            </div>
        </div>
    )

























}
