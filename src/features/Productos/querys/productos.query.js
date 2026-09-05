import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

export const PRODUCTOS_QUERY_KEY = ["productos"];
const productosRef = collection(db,"productos");

let unsubscribeProductos = null;
let cantidadDeSubs = 0;

export const IniciarsuscribirseAProductos = (queryClient) => {
    cantidadDeSubs++;
    if (unsubscribeProductos) {return;
    }
    unsubscribeProductos = onSnapshot(productosRef,(snapshot) => {
      const productos = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));
      queryClient.setQueryData(PRODUCTOS_QUERY_KEY, productos);
    },(error) => {
        console.error("Error al obtener los Productos",error);
        queryClient.setQueryData(PRODUCTOS_QUERY_KEY, (productosActuales) => productosActuales);
    });
};

export const DetenersuscribirseAProductos = () => {
    cantidadDeSubs--;
    if (cantidadDeSubs <= 0 && unsubscribeProductos) {
        unsubscribeProductos();
        unsubscribeProductos = null;
        cantidadDeSubs = 0;
    }
};