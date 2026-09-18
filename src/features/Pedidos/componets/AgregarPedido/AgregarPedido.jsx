import "./AgregarPedido.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft, ShoppingBag } from "lucide-react";

import AgregarPedidoDatosCliente from "./AgregarPedidoDatosCliente/AgregarPedidoDatosCliente";
import AgregarPedidoProductos from "./AgregarPedidoProductos/AgregarPedidoProductos";
import AgregarPedidoPagos from "./AgregarPedidoPagos/AgregarPedidoPagos";

function AgregarPedido() {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [colegio, setColegio] = useState(null);
  
  const [productosPedido, setProductosPedido] = useState([]);
  const [pagos, setPagos] = useState([])

  return (
    <div className="agregarPedido">
      <div className="agregarPedidoEncabezado">
        <div className="header">
          <button
            type="button"
            className="productoVolver"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={17} strokeWidth={2} />
            Salir de Agregar pedido
          </button>
          <span className="agregarPedidoTitulo">
            Agregar Pedido <ShoppingBag />
          </span>
        </div>
      </div>

      <div className="agregarPedidoColumnaCliente">
        <AgregarPedidoDatosCliente
          cliente={cliente}
          telefono={telefono}
          colegio={colegio}
          onClienteChange={setCliente}
          onTelefonoChange={setTelefono}
          onColegioChange={setColegio}
        />
      </div>

      <div className="agregarPedidoColumnaProductos">
        <AgregarPedidoProductos
          productosPedido={productosPedido}
          onProductoChange={setProductosPedido}
        />
      </div>

      <div className="agregarPedidoColumnaPagos">
        <AgregarPedidoPagos
          pagosAgregados={pagos}
          onPagosChange={setPagos}
          />
      </div>
    </div>
  );
}

export default AgregarPedido;
