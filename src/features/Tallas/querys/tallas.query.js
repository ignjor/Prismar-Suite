import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

export const TALLAS_QUERY_KEY = ["tallas"];
const tallasRef = collection(db,"tallas");

let unsubscribeTallas = null;
let cantidadDeSubs = 0;

export const IniciarsuscribirseATallas = (queryClient) => {
    cantidadDeSubs++;
    if (unsubscribeTallas) {return;
    }
    unsubscribeTallas = onSnapshot(tallasRef,(snapshot) => {
      const tallas = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));
      queryClient.setQueryData(TALLAS_QUERY_KEY, tallas);
    },(error) => {
        console.error("Error al obtener las Tallas",error);
        queryClient.setQueryData(TALLAS_QUERY_KEY, (tallasActuales) => tallasActuales);
    });
};

export const DetenersuscribirseATallas = () => {
    cantidadDeSubs--;
    if (cantidadDeSubs <= 0 && unsubscribeTallas) {
        unsubscribeTallas();
        unsubscribeTallas = null;
        cantidadDeSubs = 0;
    }
};