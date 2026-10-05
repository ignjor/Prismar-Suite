const { setGlobalOptions } = require("firebase-functions");
const { onDocumentWritten } = require("firebase-functions/v2/firestore");

const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

setGlobalOptions({
  maxInstances: 10,
});
initializeApp();
const db = getFirestore();

exports.actualizarEstadoProductosPedido = onDocumentWritten(
  "pedidos/{pedidoId}/productos/{productoId}",
  async (event) => {
    const { pedidoId } = event.params;
    const pedidoRef = db.collection("pedidos").doc(pedidoId);
    const productosSnapshot = await pedidoRef.collection("productos").get();

    const nuevoEstado = productosSnapshot.empty
      ? "Pendiente"
      : productosSnapshot.docs.every(
            (doc) => doc.data().estado_producto === "Completado",
          )
        ? "Completado"
        : "Pendiente";

    await pedidoRef.update({
      estado_productos: nuevoEstado,
      fecha_actualizacion: FieldValue.serverTimestamp(),
    });
  },
);
