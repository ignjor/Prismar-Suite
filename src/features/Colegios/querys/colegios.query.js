import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

export const COLEGIOS_QUERY_KEY = ["colegios"];
const colegiosRef = collection(db,"colegios");

let unsubscribeColegios = null;
let cantidadDeSubs = 0;

export const IniciarsuscribirseAColegios = (queryClient) => {
    cantidadDeSubs++;
    if (unsubscribeColegios) {return;
    }
    unsubscribeColegios = onSnapshot(colegiosRef,(snapshot) => {
      const colegios = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));
      queryClient.setQueryData(COLEGIOS_QUERY_KEY, colegios);
    },(error) => {
        console.error("Error al obtener los Colegios",error);
    });
};

export const DetenersuscribirseAColegios = () => {
    cantidadDeSubs--;
    if (cantidadDeSubs <= 0 && unsubscribeColegios) {
        unsubscribeColegios();
        unsubscribeColegios = null;
        cantidadDeSubs = 0;
    }
};