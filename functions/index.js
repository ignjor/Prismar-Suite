const { setGlobalOptions } = require("firebase-functions");

setGlobalOptions({ maxInstances: 1 });

const {
  actualizarProductosPedido,
} = require("./triggers/Pedidos/actualizarProductosPedido");
const {
  actualizarPagosPedido,
} = require("./triggers/Pedidos/actualizarPagosPedido");

exports.actualizarProductosPedido = actualizarProductosPedido;
exports.actualizarPagosPedido = actualizarPagosPedido;
