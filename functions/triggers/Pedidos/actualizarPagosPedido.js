const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("../../config/firebase");

exports.actualizarPagosPedido = onDocumentWritten(
  "pedidos/{pedidoId}/pagos/{pagoId}",
  async (event) => {
    const { pedidoId } = event.params;
    const pedidoRef = db.collection("pedidos").doc(pedidoId);
    const pedidoSnapshot = await pedidoRef.get();

    if (!pedidoSnapshot.exists) {
      console.log(`El pedido ${pedidoId} no existe.`);
      return;
    }

    const productosSnapshot = await pedidoRef.collection("productos").get();
    const pagosSnapshot = await pedidoRef.collection("pagos").get();

    const totalPedido = productosSnapshot.docs.reduce((total, doc) => {
      const producto = doc.data();

      const precio = Number(producto.precio_talla || 0);
      const cantidad = Number(producto.cantidad || 0);

      return total + precio * cantidad;
    }, 0);

    const totalPagado = pagosSnapshot.docs.reduce((total, doc) => {
      const pago = doc.data();

      return total + Number(pago.total_pago || 0);
    }, 0);

    const estadoPago = totalPagado >= totalPedido ? "Pagado" : "Pendiente";

    await pedidoRef.update({
      total_pedido: totalPedido,
      total_pagado: totalPagado,
      estado_pago: estadoPago,
      fecha_actualizacion: FieldValue.serverTimestamp(),
    });
  },
);
