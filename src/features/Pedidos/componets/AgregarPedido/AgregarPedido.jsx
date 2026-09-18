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
{/*
      </div>
          <div className="productoCrearActions">
            <button
              type="button"
              className="productoCrearButton productoCrearButtonCancel"
              onClick={() => navigate(-1)}
            >
              <CircleX
                size={17}
                strokeWidth={2}
              />
              <span>
                Cancelar
              </span>
            </button>
            <button
              type="submit"
              className="productoCrearButton productoCrearButtonPrimary"
            >
              <CirclePlus
                size={17}
                strokeWidth={2}
              />
              <span>
                  Guardar
              </span>
            </button>  */}
          </div>
    </div>
  );
}

export default AgregarPedido;