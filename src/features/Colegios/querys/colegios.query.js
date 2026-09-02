import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

export const COLEGIOS_QUERY_KEY = ["colegios"]

export const suscribirseAColegios = (onChange, onError) => {
    const colegiosRef = collection(db,"colegios");

    return onSnapshot(colegiosRef, (snapshot) => {
        const colegios = snapshot.docs.map((documento) => ({
            id: documento.id, ...documento.data(),
        }));
        onChange(colegios);
        },
        (error) => {
            console.error("Error al obtener los colegios:",error);
            if (onError){
                onError(error);
            }
    });
}