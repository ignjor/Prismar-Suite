import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

export const PEDIDOS_QUERY_KEY = ["pedidos"];
const pedidosRef = collection(db, "pedidos");
let unsubscribePedidos = null;
let cantidadDeSubs = 0;

const subColecciones = async (pedidoDoc) => {
  const pedidoId = pedidoDoc.id;
  const productosRef = collection( db, "pedidos", pedidoId, "productos" );
  const pagosRef = collection( db, "pedidos", pedidoId, "pagos" );

  const [productosSnapshot, pagosSnapshot] =
    await Promise.all([ getDocs(productosRef), getDocs(pagosRef) ]);

  const productos = productosSnapshot.docs.map(
    (documento) => ({
      id: documento.id,
      ...documento.data(),
    })
  );

  const pagos = pagosSnapshot.docs.map(
    (documento) => ({
      id: documento.id,
      ...documento.data(),
    })
  );

  return { productos,pagos };
};

export const IniciarsuscribirseAPedidos = ( queryClient ) => {
  cantidadDeSubs++;
  if (unsubscribePedidos) {
    return;
  }
  unsubscribePedidos = onSnapshot( pedidosRef, async (snapshot) => {
      try {
        const pedidos = await Promise.all(
          snapshot.docs.map(async (pedidoDoc) => {
            const datosPedido = pedidoDoc.data();
            const { productos, pagos } = await subColecciones(pedidoDoc);
            return {
              id: pedidoDoc.id,
              ...datosPedido,
              productos,
              pagos,
            };
          })
        );
        queryClient.setQueryData( PEDIDOS_QUERY_KEY, pedidos );
      } catch (error) {
        console.error(
          "Error al obtener los pedidos y sus subcolecciones:", error );
        queryClient.setQueryData(
          PEDIDOS_QUERY_KEY, (pedidosActuales) => pedidosActuales ?? []);
      }
    },
    (error) => {
      console.error(
        "Error al obtener los Pedidos:",
        error
      );
      queryClient.setQueryData(
        PEDIDOS_QUERY_KEY,
        (pedidosActuales) => pedidosActuales ?? []);
    }
  );
};

export const DetenersuscribirseAPedidos = () => {
  cantidadDeSubs--;
  if (
    cantidadDeSubs <= 0 && unsubscribePedidos
  ) {
    unsubscribePedidos();
    unsubscribePedidos = null;
    cantidadDeSubs = 0;
  }
};
