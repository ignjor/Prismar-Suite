import "./ModalAgregarEditarColegio.css";
import { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";

import {CircleX, CirclePlus, X} from "lucide-react";


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


    const [nombreDeColegio ,setNombreDeColegio] = useState("");

    const guardarColegioCreado = async (nombreValidado) => {
        const errorValidarTextoDeInput = validarTextoDeInput(nombreValidado)
        if (errorValidarTextoDeInput) {setError(errorValidarTextoDeInput);
            return;
        }
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
         const errorValidarTextoDeInput = validarTextoDeInput(nombreValidado)
        if (errorValidarTextoDeInput) {setError(errorValidarTextoDeInput);
            return;
        }
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




    


}