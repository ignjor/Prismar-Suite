import "./AgregarPedido.css";
import { addDoc, collection, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../../firebase";
import { useMemo, useState } from "react";
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
  const [guardando, setGuardando] = useState(false);
  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [colegio, setColegio] = useState(null);
  const [fechaEntrega, setFechaEntrega] = useState("");
  
  const [productosPedido, setProductosPedido] = useState([]);
  const [pagos, setPagos] = useState([])

  const totalPrecio = useMemo(() => {
    return productosPedido.reduce((total, producto) => {
      const precio = Number(producto.precio_talla);
      const cantidad = Number(producto.cantidad);
      return total + precio * cantidad;
    }, 0);
  }, [productosPedido]);

  const totalPagado = useMemo(() => {
    return pagos.reduce((total, pago) => {
      return total + Number(pago.total_pago || 0);
    }, 0);
  }, [pagos]);
  const estadoPago = totalPagado >= totalPrecio
    ? "Pagado"
    : "Pendiente";

  const botonVolver = () => {
    const hayCliente = cliente.trim() !== "";
    const hayProductos = productosPedido.length > 0;
    if (hayCliente && hayProductos) {
      setError("");
      setEstadoModalGuardarBorrador(true);
      return;
    }
    setError("");
    navigate("/pedidos");
  };

  const cerrarModalGuardarBorrador = () => {
    setEstadoModalGuardarBorrador(false);
  };


  const guardarBorrador = async () => {
    if (!cliente.trim()) {
      setError("El nombre del cliente es obligatorio");
      return;
    }
    if (productosPedido.length === 0) {
      setError(
        "Debes agregar al menos un producto antes de guardar el pedido como borrador."
      );
      return;
    }
    try {
      const identificadorPedido = `PED-${Date.now().toString().slice(-7)}`;
      const pedidoRef = await addDoc( collection(db, "pedidos"),
        {
          numero_pedido: identificadorPedido,
          estado_guardado: "Borrador",
          estado_pedido: "Pendiente",
          estado_productos: "Pendiente",
          estado_pago: estadoPago,
          fecha_entrega: fechaEntrega || "Sin fecha de entrega",
          cliente: cliente.trim(),
          telefono: telefono || "Sin número de contacto",
          colegio: colegio || "Sin Afiliado",
          total_pedido: totalPrecio,
          fecha_creacion: serverTimestamp(),
          fecha_actualizacion: serverTimestamp(),
        }
      );
      const pedidoId = pedidoRef.id;
      const productosRef = collection( db, "pedidos", pedidoId, "productos" );
      for (const producto of productosPedido) {await addDoc(productosRef, 
        {
          producto_id: producto.producto_id,
          nombre: producto.nombre,
          colegio: producto.colegio || "Sin afiliado",
          tipo_prenda: producto.tipo_prenda,
          medidas_asig: producto.medidas_asig,
          talla: producto.talla,
          precio_talla: Number(producto.precio_talla),
          imagen: producto.imagen || "",
          cantidad: Number(producto.cantidad),
          estado_producto: "Pendiente",
          fecha_actualizacion: serverTimestamp(),
        });
      }

      const pagosRef = collection( db, "pedidos", pedidoId, "pagos" );
      for (const pago of pagos) {
        const pagoRef = await addDoc(pagosRef, {
          total_pago: Number(pago.total_pago),
          fecha_pago: pago.fecha_pago,
          cuenta_bancaria_id: pago.cuenta_bancaria_id,
          comprobante_url: "",
          fecha_actualizacion: serverTimestamp(),
        });
        const pagoId = pagoRef.id;
        if (pago.comprobante_archivo) {
          const archivo = pago.comprobante_archivo;
          const rutaStorage = `pedidos/${pedidoId}/pagos/${pagoId}/${pago.comprobante_nombre}`;
          const comprobanteRef = ref( storage, rutaStorage );
          await uploadBytes( comprobanteRef, archivo,
            {
              contentType: archivo.type,
            }
          );
          const comprobanteUrl = await getDownloadURL( comprobanteRef );
          await updateDoc( doc( db, "pedidos", pedidoId, "pagos", pagoId
            ),
            {
              comprobante_url: comprobanteUrl,
              fecha_actualizacion: serverTimestamp(),
            }
          );
        }
      }
      navigate("/pedidos");
    } catch (error) {
      console.error(
        "Error al guardar el pedido:",
        error
      );
      setError(
        "Error al guardar el pedido como borrador."
      );
    };
  };

  
  const guardarCompleto = async () => {
    if (!cliente.trim()) {
      setError("El nombre del cliente es obligatorio");
      return;
    }
    if (productosPedido.length === 0) {
      setError(
        "Debes agregar al menos un producto antes de guardar el pedido."
      );
      return;
    }
    if (!telefono.trim()){
      setError("El telefono del cliente es obligatorio");
      return;
    }
    if (!fechaEntrega.trim()){
      setError("La fecha de entrega del pedido es obligatoria");
      return;
    }
    setGuardando(true);

    try {
      const identificadorPedido = `PED-${Date.now().toString().slice(-6)}`;
      const pedidoRef = await addDoc( collection(db, "pedidos"),
        {
          numero_pedido: identificadorPedido,
          estado_guardado: "Guardado",
          estado_pedido: "Pendiente",
          estado_productos: "Pendiente",
          estado_pago: estadoPago,
          fecha_entrega: fechaEntrega,
          cliente: cliente.trim(),
          telefono: telefono,
          colegio: colegio || "Sin Afiliado",
          total_pedido: totalPrecio,
          fecha_creacion: serverTimestamp(),
          fecha_actualizacion: serverTimestamp(),
        }
      );
      const pedidoId = pedidoRef.id;
      const productosRef = collection( db, "pedidos", pedidoId, "productos" );
      for (const producto of productosPedido) {await addDoc(productosRef, 
        {
          producto_id: producto.producto_id,
          nombre: producto.nombre,
          colegio: producto.colegio || "Sin afiliado",
          tipo_prenda: producto.tipo_prenda,
          medidas_asig: producto.medidas_asig,
          talla: producto.talla,
          precio_talla: Number(producto.precio_talla),
          imagen: producto.imagen || "",
          cantidad: Number(producto.cantidad),
          estado_producto: "Pendiente",
          fecha_actualizacion: serverTimestamp(),
        });
      }
      const pagosRef = collection( db, "pedidos", pedidoId, "pagos" );
      for (const pago of pagos) {
        const pagoRef = await addDoc(pagosRef, {
          total_pago: Number(pago.total_pago),
          fecha_pago: pago.fecha_pago,
          cuenta_bancaria_id: pago.cuenta_bancaria_id,
          comprobante_url: "",
          fecha_actualizacion: serverTimestamp(),
        });
        const pagoId = pagoRef.id;
        if (pago.comprobante_archivo) {
          const archivo = pago.comprobante_archivo;
          const rutaStorage = `pedidos/${pedidoId}/pagos/${pagoId}/${pago.comprobante_nombre}`;
          const comprobanteRef = ref( storage, rutaStorage );
          await uploadBytes( comprobanteRef, archivo,
            {
              contentType: archivo.type,
            }
          );
          const comprobanteUrl = await getDownloadURL( comprobanteRef );
          await updateDoc( doc( db, "pedidos", pedidoId, "pagos", pagoId
            ),
            {
              comprobante_url: comprobanteUrl,
              fecha_actualizacion: serverTimestamp(),
            }
          );
        }
      }
      navigate("/pedidos");
    } catch (error) {
      console.error(
        "Error al guardar el pedido:",
        error
      );
      setError(
        "Error al guardar el pedido."
      );
    } finally { 
      setGuardando(false);
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

      <div className="agregarPedidoColumnaIzquierda">
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

        <div className="agregarPedidoColumnaPagos">
          <AgregarPedidoPagos
            pagosAgregados={pagos}
            onPagosChange={setPagos}
            totalPedido={totalPrecio}
          />
        </div>
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
        />
          <div className="productoCrearActions">
            <button
              type="button"
              className="productoCrearButton productoCrearButtonCancel"
              onClick={botonVolver}
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
              onClick={guardarCompleto}
              disabled={guardando}
            >
              <CirclePlus
                size={17}
                strokeWidth={2}
              />
              <span>
                {guardando ? "Guardando..." : "Guardar"}
              </span>
            </button>
          </div>
      </div>

        {estadoModalGuardarBorrador && (
        <ModalGuardarBorrador
          tipo = "pedido"
          dato = {cliente}
          modalAbierto= {estadoModalGuardarBorrador}
          onCerrarModal= {cerrarModalGuardarBorrador}
          onConfirmarGuardarBorrador= {guardarBorrador}
        /> )}  
    </div>
  );
}
export default AgregarPedido;