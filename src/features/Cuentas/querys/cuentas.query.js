import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

export const CUENTAS_QUERY_KEY = ["cuentas_bancarias"];
const cuentasRef = collection(db,"cuentas_bancarias");

let unsubscribeCuentas = null;
let cantidadDeSubs = 0;

export const IniciarsuscribirseACuentas = (queryClient) => {
    cantidadDeSubs++;
    if (unsubscribeCuentas) {return;
    }
    unsubscribeCuentas = onSnapshot(cuentasRef,(snapshot) => {
      const cuentas = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));
      queryClient.setQueryData(CUENTAS_QUERY_KEY, cuentas);
    },(error) => {
        console.error("Error al obtener los datos de Cuentas",error);
    });
};

export const DetenersuscribirseACuentas = () => {
    cantidadDeSubs--;
    if (cantidadDeSubs <= 0 && unsubscribeCuentas) {
        unsubscribeCuentas();
        unsubscribeCuentas = null;
        cantidadDeSubs = 0;
    }
};