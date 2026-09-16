import { useState } from "react";

import AgregarPedidoDatosCliente from "./AgregarPedidoDatosCliente/AgregarPedidoDatosCliente";
import AgregarPedidoProductos from "./AgregarPedidoProductos/AgregarPedidoProductos";
import AgregarPedidoPagos from "./AgregarPedidoPagos/AgregarPedidoPagos";

function AgregarPedido() {
  const [cliente, setCliente] = useState("")
  const [telefono, setTelefono] = useState("");
  const [colegio, setColegio] = useState(null);

  return (
    <div>
      <AgregarPedidoDatosCliente
        cliente={cliente}
        telefono={telefono}
        colegio={colegio}
        onClienteChange={setCliente}
        onTelefonoChange={setTelefono}
        onColegioChange={setColegio}
      />
      
      <AgregarPedidoProductos />
      <AgregarPedidoPagos />

      <h1> {cliente} </h1>
      <h1> {telefono} </h1>
      <h1> {colegio} </h1>

    </div>
  );
}
export default AgregarPedido;