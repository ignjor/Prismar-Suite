import "./AgregarPedido.css";
import { addDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AgregarPedidoDatosCliente from "./AgregarPedidoDatosCliente/AgregarPedidoDatosCliente";
import AgregarPedidoProductos from "./AgregarPedidoProductos/AgregarPedidoProductos";
import AgregarPedidoPagos from "./AgregarPedidoPagos/AgregarPedidoPagos";

import { ArrowLeft, ShoppingBag, CircleX, CirclePlus } from "lucide-react";

function AgregarPedido() {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [colegio, setColegio] = useState(null);
  const [fechaEntrega, setFechaEntrega] = useState("");
  
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
            Volver
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
          fechaEntrega={fechaEntrega}
          onClienteChange={setCliente}
          onTelefonoChange={setTelefono}
          onColegioChange={setColegio}
          onFechaEntregaChange={setFechaEntrega}

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
        <div style={{ maxWidth: "100%", overflow: "hidden" }}>
          <h4>{fechaEntrega}</h4>
          <h4>{cliente}</h4>
          <h4>{telefono}</h4>
          <h4>{colegio}</h4>
          <pre style={{ textAlign: "left", background: "#f4f4f4", padding: "10px"}}>
            {JSON.stringify(productosPedido, null, 2)}
          </pre>
        </div>
      </div>
        
    </div>
  );
}

export default AgregarPedido;