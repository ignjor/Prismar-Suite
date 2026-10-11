import "./EditarPedido.css";
import { useMemo, useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp, updateDoc, doc, getDocs, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { db, storage } from "../../../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { usePedidos } from "../../querys/usePedidos";

import EditarPedidoDatosCliente from "./EditarPedidoDatosCliente/EditarPedidoDatosCliente";
import EditarPedidoProductos from "./EditarPedidoProductos/EditarPedidoProductos";
import EditarPedidoPagos from "./EditarPedidoPagos/EditarPedidoPagos";

import { ArrowLeft, ShoppingBag, CircleX, CirclePlus } from "lucide-react";

function EditarPedido() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [colegio, setColegio] = useState(null);
  const [fechaEntrega, setFechaEntrega] = useState("");
  
  const [productosPedido, setProductosPedido] = useState([]);
  const [pagos, setPagos] = useState([])

  const { data: datosDePedidos = [], isLoading, isError } = usePedidos();

  const pedido = useMemo(() => {
    return datosDePedidos.find((pedidoActual) => pedidoActual.id === id);
  }, [datosDePedidos, id]);

  useEffect(() => {
    if (pedido) {
      setCliente(pedido.cliente);
      setTelefono(pedido.telefono || "");
      setColegio(pedido.colegio === "Sin Afiliado" ? null : pedido.colegio);
      if (pedido.fecha_entrega && pedido.fecha_entrega !== "Sin fecha de entrega") {
        const fecha = typeof pedido.fecha_entrega?.toDate === "function" 
          ? pedido.fecha_entrega.toDate() 
          : new Date(pedido.fecha_entrega);
        if (!isNaN(fecha.getTime())) {
          const fechaFormateada = fecha.toISOString().split('T')[0];
          setFechaEntrega(fechaFormateada);
        }
      }
      if (pedido.productos && pedido.productos.length > 0) {
        const productosFormateados = pedido.productos.map(prod => ({
          ...prod,
          medidas_asig: prod.medidas_asig instanceof Map 
            ? Object.fromEntries(prod.medidas_asig) 
            : prod.medidas_asig || {}
        }));
        setProductosPedido(productosFormateados);
      }
      if (pedido.pagos && pedido.pagos.length > 0) {
        setPagos(pedido.pagos);
      }
      setCargando(false);
    }
  }, [pedido, id]);

  const totalPrecio = useMemo(() => {
    return productosPedido.reduce((total, producto) => {
      const precio = Number(producto.precio_talla);
      const cantidad = Number(producto.cantidad);
      return total + precio * cantidad;
    }, 0);
  }, [productosPedido]);

  const botonVolver = () => {
    setError("");
    navigate(`/pedidos/`);
  };

  const actualizarProductos = async (pedidoId, nuevosProductos) => {
    const productosRef = collection(db, "pedidos", pedidoId, "productos");
    const productosExistentes = await getDocs(productosRef);
    const productosExistentesMap = new Map();
    productosExistentes.forEach(doc => {
      productosExistentesMap.set(doc.id, doc.data());
    });
    const nuevosProductosMap = new Map();
    nuevosProductos.forEach(prod => {
      if (prod.id) {
        nuevosProductosMap.set(prod.id, prod);
      }
    });
    for (const [prodId] of productosExistentesMap) {
      if (!nuevosProductosMap.has(prodId)) {
        await deleteDoc(doc(db, "pedidos", pedidoId, "productos", prodId));
      }
    }
    for (const producto of nuevosProductos) {
      if (producto.id) {
        await updateDoc(doc(db, "pedidos", pedidoId, "productos", producto.id), {
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
      } else {
        await addDoc(productosRef, {
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
    }
  };

  const actualizarPagos = async (pedidoId, nuevosPagos) => {
    const pagosRef = collection(db, "pedidos", pedidoId, "pagos");
    const pagosExistentes = await getDocs(pagosRef);
    const pagosExistentesMap = new Map();
    pagosExistentes.forEach(doc => {
      pagosExistentesMap.set(doc.id, doc.data());
    });
    const nuevosPagosMap = new Map();
    nuevosPagos.forEach(pago => {
      if (pago.id) {
        nuevosPagosMap.set(pago.id, pago);
      }
    });
    for (const [pagoId] of pagosExistentesMap) {
      if (!nuevosPagosMap.has(pagoId)) {
        try {
          const carpetaPago = ref(storage, `pedidos/${pedidoId}/pagos/${pagoId}`);
          const archivos = await listAll(carpetaPago);
          await Promise.all(archivos.items.map(archivo => deleteObject(archivo)));
        } catch (error) {
          console.warn("No se pudo eliminar archivos del pago:", error);
        }
        await deleteDoc(doc(db, "pedidos", pedidoId, "pagos", pagoId));
      }
    }
    
    for (const pago of nuevosPagos) {
      if (pago.id) {
        const datosPago = {
          total_pago: Number(pago.total_pago),
          fecha_pago: pago.fecha_pago,
          cuenta_bancaria_id: pago.cuenta_bancaria_id,
          fecha_actualizacion: serverTimestamp(),
        };
        if (pago.comprobante_archivo) {
          const archivo = pago.comprobante_archivo;
          const extension = archivo.name.split('.').pop();
          const nuevaRutaStorage = `pedidos/${pedidoId}/pagos/${pago.id}/comprobante_${Date.now()}.${extension}`;
          const comprobanteRef = ref(storage, nuevaRutaStorage);
          await uploadBytes(comprobanteRef, archivo, { contentType: archivo.type });
          const nuevaComprobanteUrl = await getDownloadURL(comprobanteRef);
          datosPago.comprobante_url = nuevaComprobanteUrl;
          datosPago.comprobante_path = nuevaRutaStorage;
          if (pago.comprobante_path) {
            try {
              const oldRef = ref(storage, pago.comprobante_path);
              await deleteObject(oldRef);
            } catch (deleteError) {
              console.warn("No se pudo eliminar comprobante antiguo:", deleteError);
            }
          }
        }
        await updateDoc(doc(db, "pedidos", pedidoId, "pagos", pago.id), datosPago);
      } else {
        const nuevoPagoRef = await addDoc(pagosRef, {
          total_pago: Number(pago.total_pago),
          fecha_pago: pago.fecha_pago,
          cuenta_bancaria_id: pago.cuenta_bancaria_id,
          comprobante_url: "",
          comprobante_path: "",
          fecha_actualizacion: serverTimestamp(),
        });
        if (pago.comprobante_archivo) {
          const archivo = pago.comprobante_archivo;
          const extension = archivo.name.split('.').pop();
          const rutaStorage = `pedidos/${pedidoId}/pagos/${nuevoPagoRef.id}/comprobante_${Date.now()}.${extension}`;
          const comprobanteRef = ref(storage, rutaStorage);
          await uploadBytes(comprobanteRef, archivo, { contentType: archivo.type });
          const comprobanteUrl = await getDownloadURL(comprobanteRef);
          await updateDoc(nuevoPagoRef, {
            comprobante_url: comprobanteUrl,
            comprobante_path: rutaStorage,
            fecha_actualizacion: serverTimestamp(),
          });
        }
      }
    }
  };

  const guardarCompleto = async () => {
    if (!cliente.trim()) {
      setError("El nombre del cliente es obligatorio");
      return;
    }
    if (productosPedido.length === 0) {
      setError("Debes agregar al menos un producto antes de guardar el pedido.");
      return;
    }
    if (!telefono.trim()) {
      setError("El telefono del cliente es obligatorio");
      return;
    }
    if (!fechaEntrega.trim()) {
      setError("La fecha de entrega del pedido es obligatoria");
      return;
    }
    setGuardando(true);
    try {
      const pedidoRef = doc(db, "pedidos", id);
      await updateDoc(pedidoRef, {
        estado_guardado: "Guardado",
        fecha_entrega: fechaEntrega,
        cliente: cliente.trim().toUpperCase(),
        telefono: telefono,
        colegio: colegio || "Sin Afiliado",
        fecha_actualizacion: serverTimestamp(),
      });
      await actualizarProductos(id, productosPedido);
      await actualizarPagos(id, pagos);
      navigate("/pedidos");
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      setError("Error al guardar el pedido.");
    } finally { 
      setGuardando(false);
    }
  };
  if (isLoading || cargando) {
    return <p>Cargando pedido...</p>;
  }
  if (isError) {
    return <p>Error al cargar el pedido. Recargue la página.</p>;
  }
  if (!pedido) {
    return <p>Pedido no encontrado.</p>;
  }
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
            Editar Pedido <ShoppingBag />
          </span>
        </div>
      </div>

      <div className="agregarPedidoColumnaIzquierda">
        <div className="agregarPedidoColumnaCliente">
          <EditarPedidoDatosCliente
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
          <EditarPedidoPagos
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

        <EditarPedidoProductos
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
    </div>
  );
}
export default EditarPedido;