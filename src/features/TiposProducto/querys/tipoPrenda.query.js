import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

export const TIPOPRENDA_QUERY_KEY = ["tipoPrenda"];
const tipoprendaRef = collection(db,"tipo_prenda");

let unsubscribeTipoPrenda = null;
let cantidadDeSubs = 0;

export const IniciarsuscribirseATipoPrenda = (queryClient) => {
    cantidadDeSubs++;
    if (unsubscribeTipoPrenda) {return;
    }
    unsubscribeTipoPrenda = onSnapshot(tipoprendaRef,(snapshot) => {
      const tipoPrenda = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));
      queryClient.setQueryData(TIPOPRENDA_QUERY_KEY, tipoPrenda);
    },(error) => {
        console.error("Error al obtener los Tipos de Prendas",error);
        queryClient.setQueryData(TIPOPRENDA_QUERY_KEY, (tipoPrendaActuales) => tipoPrendaActuales);
    });
};

export const DetenersuscribirseATipoPrenda = () => {
    cantidadDeSubs--;
    if (cantidadDeSubs <= 0 && unsubscribeTipoPrenda) {
        unsubscribeTipoPrenda();
        unsubscribeTipoPrenda = null;
        cantidadDeSubs = 0;
    }
};