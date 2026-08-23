import { useEffect, useRef, useState } from "react";
import "./ModalAgregarTipoProducto.css";

import { db } from "../../firebase";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";

import {CircleX, CirclePlus, X, Plus, Trash2, IndianRupee
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
        for (const atributo of atributosLimpios) {
            const errorAtributo =
                validarNombre(atributo);
            if (errorAtributo) {
                setError("El atributo no es valido:",atributo);
            } 
            return;
        }
    /* esta parte es suuper importante, porque si, antes estabamos tratando a los atributos, a las medidas asig como un array, aqui lo
    convertir a nuestro map que queremos en firestore para guardar todo ordenadito y bonito, que luego productos llamara, excelenteeeee */
        const medidasAsig = {};
        atributosLimpios.forEach((atributo) => {
            medidasAsig[atributo] = "";
        });
        try {
            setGuardando(true);
            setError("");
        }



}
