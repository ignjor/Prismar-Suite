import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

export const PEDIDOS_QUERY_KEY = ["pedidos"];
const pedidosRef = collection(db,"pedidos");

let unsubscribePedidos = null;
let cantidadDeSubs = 0;

export const IniciarsuscribirseAPedidos = (queryClient) => {
    cantidadDeSubs++;
    if (unsubscribePedidos) {return;
    }
    unsubscribePedidos = onSnapshot(pedidosRef,(snapshot) => {
      const pedidos = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));
      queryClient.setQueryData(PEDIDOS_QUERY_KEY, pedidos);
    },(error) => {
        console.error("Error al obtener los Pedidos",error);
        queryClient.setQueryData(PEDIDOS_QUERY_KEY, (pedidosActuales) => pedidosActuales);
    });
};

export const DetenersuscribirseAPedidos = () => {
    cantidadDeSubs--;
    if (cantidadDeSubs <= 0 && unsubscribePedidos) {
        unsubscribePedidos();
        unsubscribePedidos = null;
        cantidadDeSubs = 0;
    }
};