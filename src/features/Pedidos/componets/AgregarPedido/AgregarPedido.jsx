import "./AgregarPedido.css";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AgregarPedidoDatosCliente from "./AgregarPedidoDatosCliente/AgregarPedidoDatosCliente";
import AgregarPedidoProductos from "./AgregarPedidoProductos/AgregarPedidoProductos";
import AgregarPedidoPagos from "./AgregarPedidoPagos/AgregarPedidoPagos";
import ModalGuardarBorrador from "../../../../components/modals/ModalGuardarBorrador/ModalGuardarBorrador";

import { ArrowLeft, ShoppingBag, CircleX, CirclePlus } from "lucide-react";

function AgregarPedido() {
  const navigate = useNavigate();
  const [estadoModalGuardarBorrador, setEstadoModalGuardarBorrador] = useState(false);
  
  const [error, setError] = useState("");
  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [colegio, setColegio] = useState(null);
  const [fechaEntrega, setFechaEntrega] = useState("");
  
  const [productosPedido, setProductosPedido] = useState([]);
  const [pagos, setPagos] = useState([])

  const abrirModalGuardarBorrador = (productoSeleccionado) => {
    if (!cliente.trim()) {
      setError("El nombre del cliente es obligatorio");
      return;
    }
    if (!productoSeleccionado) {
      return;
    }
    if (productoSeleccionado.tipo_prenda === "Sin tipo de prenda asignado") {
      setError("El producto no tiene un tipo de prenda asignado, por lo que no podrás agregar medidas personalizadas con este producto.");
      return;
    }
    setError("")
    setEstadoModalGuardarBorrador(true);
  };

  const botonVolver = () => {
    const hayCliente = cliente.trim() !== "";
    const hayProductos = productosPedido.length > 0;
    if (hayCliente && hayProductos) {
      setError("");
      setEstadoModalGuardarBorrador(true);
      return;
    }
    setError("");
    navigate(-1);
  };

  const cerrarModalGuardarBorrador = () => {
    setEstadoModalGuardarBorrador(false);
  };

  const guardarBorradorTomarMedidas = async () => {
    try {
      const pedidoRef = await addDoc(collection(db, "pedidos"),{
        estado_guardado: "borrador",
        fecha_entrega: fechaEntrega || "Sin fecha de entrega",
        cliente: cliente.trim(),
        telefono: telefono || "Sin número de contacto",
        colegio: colegio || "Sin Afiliado",
        fecha_creacion: serverTimestamp()
      });
      const productosRef = collection(db, "pedidos", pedidoRef.id, "productos");
      for (const producto of productosPedido) {
        await addDoc(productosRef, {
          nombre: producto.nombre,
          colegio: producto.colegio || "Sin afiliado",
          tipo_prenda: producto.tipo_prenda,
          medidas_asig: producto.medidas_asig,
          talla: producto.talla,
          precio_talla: Number(producto.precio_talla,),
          imagen: producto.imagen || "",
          cantidad: Number(producto.cantidad,),
          fecha_actualizacion: serverTimestamp()
        });
      }
      navigate(-1);
    }catch(error){
      setError("Error al guardar el pedido como borrador.")
      console.error("Error al gaurdar el pedido", error)
    }
  };

  return (
    <div className="agregarPedido">
      <div className="agregarPedidoEncabezado">
        <div className="header">
          <button
            type="button"
            className="productoVolver"
            onClick={botonVolver}
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

            {error && (
            <p className="productoCrearError">
            {error}
            </p>
        )}
        <AgregarPedidoProductos
          productosPedido={productosPedido}
          onProductoChange={setProductosPedido}
          onTomarMedidas={guardarBorradorTomarMedidas}
          onAbrirModalGuardarBorrador={abrirModalGuardarBorrador}
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
        {estadoModalGuardarBorrador && (
        <ModalGuardarBorrador
          tipo = "pedido"
          dato = {cliente}
          modalAbierto= {estadoModalGuardarBorrador}
          onCerrarModal= {cerrarModalGuardarBorrador}
          onConfirmarGuardarBorrador= {guardarBorradorTomarMedidas}
        /> )}  
    </div>
  );
}

export default AgregarPedido;