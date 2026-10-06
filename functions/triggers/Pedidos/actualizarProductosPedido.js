const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("../../config/firebase");

exports.actualizarProductosPedido = onDocumentWritten(
  "pedidos/{pedidoId}/productos/{productoId}",
  async (event) => {
    const { pedidoId } = event.params;
    const pedidoRef = db.collection("pedidos").doc(pedidoId);

    const pedidoSnapshot = await pedidoRef.get();
    if (!pedidoSnapshot.exists) {
      console.log(`El pedido ${pedidoId} no existe.`);
      return;
    }
    const productosSnapshot = await pedidoRef.collection("productos").get();

    const totalPedido = productosSnapshot.docs.reduce((total, doc) => {
      const producto = doc.data();

      const precio = Number(producto.precio_talla || 0);
      const cantidad = Number(producto.cantidad || 0);

      return total + precio * cantidad;
    }, 0);

    const estadoProductos = productosSnapshot.empty
      ? "Pendiente"
      : productosSnapshot.docs.every(
            (doc) => doc.data().estado_producto === "Completado",
          )
        ? "Completado"
        : "Pendiente";

    await pedidoRef.update({
      total_pedido: totalPedido,
      estado_productos: estadoProductos,
      fecha_actualizacion: FieldValue.serverTimestamp(),
    });
  },
);
