import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

export const PEDIDOS_QUERY_KEY = ["pedidos"];
const pedidosRef = collection(db, "pedidos");
let unsubscribePedidos = null;
let cantidadDeSubs = 0;
const unsubscribeSubColecciones = new Map();

export const IniciarsuscribirseAPedidos = ( queryClient ) => {
  cantidadDeSubs++;
  if (unsubscribePedidos) {
    return;
  }

  unsubscribePedidos = onSnapshot( pedidosRef, (snapshot) => {
      const pedidosActuales = queryClient.getQueryData(PEDIDOS_QUERY_KEY) ?? [];

      const pedidos = snapshot.docs.map(
        (pedidoDoc) => {
          const pedidoAnterior = pedidosActuales.find(
            (pedido) => pedido.id === pedidoDoc.id
          );

          return {
            id: pedidoDoc.id,
            ...pedidoDoc.data(),
            productos: pedidoAnterior?.productos ?? [],
            pagos: pedidoAnterior?.pagos ?? [],
          };
        }
      );

      queryClient.setQueryData( PEDIDOS_QUERY_KEY, pedidos );

      const idsActuales = new Set(snapshot.docs.map((documento) => documento.id));

      unsubscribeSubColecciones.forEach((unsubscribe, pedidoId) => {
        if (!idsActuales.has(pedidoId)) {
          unsubscribe();
          unsubscribeSubColecciones.delete(pedidoId);
        }
      });

      snapshot.docs.forEach((pedidoDoc) => {
        const pedidoId = pedidoDoc.id;

        if (unsubscribeSubColecciones.has(pedidoId)) {
          return;
        }

        const productosRef = collection( db, "pedidos", pedidoId, "productos" );
        const pagosRef = collection( db, "pedidos", pedidoId, "pagos" );

        let productos = pedidos.find(
          (pedido) => pedido.id === pedidoId
        )?.productos ?? [];

        let pagos = pedidos.find(
          (pedido) => pedido.id === pedidoId
        )?.pagos ?? [];

        const actualizarPedido = () => {
          queryClient.setQueryData(
            PEDIDOS_QUERY_KEY,
            (pedidosActuales = []) =>
              pedidosActuales.map((pedido) =>
                pedido.id === pedidoId
                  ? { ...pedido, productos, pagos }
                  : pedido
              )
          );
        };

        const unsubscribeProductos = onSnapshot(
          productosRef,
          (productosSnapshot) => {
            productos = productosSnapshot.docs.map(
              (documento) => ({
                id: documento.id,
                ...documento.data(),
              })
            );

            actualizarPedido();
          },
          (error) => {
            console.error(
              `Error en productos del pedido ${pedidoId}:`,
              error
            );
          }
        );

        const unsubscribePagos = onSnapshot(
          pagosRef,
          (pagosSnapshot) => {
            pagos = pagosSnapshot.docs.map(
              (documento) => ({
                id: documento.id,
                ...documento.data(),
              })
            );

            actualizarPedido();
          },
          (error) => {
            console.error(
              `Error en pagos del pedido ${pedidoId}:`,
              error
            );
          }
        );

        unsubscribeSubColecciones.set(
          pedidoId,
          () => {
            unsubscribeProductos();
            unsubscribePagos();
          }
        );
      });
    },
    (error) => {
      console.error(
        "Error al obtener los Pedidos:",
        error
      );

      queryClient.setQueryData(
        PEDIDOS_QUERY_KEY,
        (pedidosActuales) => pedidosActuales ?? []
      );
    }
  );
};

export const DetenersuscribirseAPedidos = () => {
  cantidadDeSubs--;

  if (cantidadDeSubs <= 0 && unsubscribePedidos) {
    unsubscribePedidos();
    unsubscribePedidos = null;

    unsubscribeSubColecciones.forEach((unsubscribe) => {
      unsubscribe();
    });

    unsubscribeSubColecciones.clear();
    cantidadDeSubs = 0;
  }
};