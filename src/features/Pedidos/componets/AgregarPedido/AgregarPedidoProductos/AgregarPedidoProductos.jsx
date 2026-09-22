import "./AgregarPedidoProductos.css";
import { useMemo, useState } from "react";
import { useColegios } from "../../../../Colegios/querys/useColegios";
import { useTipoPrenda } from "../../../../TiposProducto/querys/useTipoPrenda";

import ModalSelectorProductos from "../../../../../components/modals/ModalSelectorProductos/ModalSelectorProductos";
import ModalTomarMedidas from "../../ModalTomarMedidas/ModalTomarMedidas";
import { Trash2, Shirt, Minus, Plus, Ghost, ChevronDown } from "lucide-react";

export default function AgregarPedidoProductos({productosPedido = [], onProductoChange}){
    const [error, setError] = useState("");
    const [selectorAbierto, setSelectorAbierto] = useState(false);
    const [modalTomarMedidasAbierto, setModalTomarMedidasAbierto] = useState(false);

    const [medidasAbiertas, setMedidasAbiertas] = useState({});
    const [productoEditarMedidas, setProdutoEditarMedidas] = useState(null);

    const { data: datosDeColegios = [] } = useColegios();
    const { data: datosDeTipoPrenda = [] } = useTipoPrenda();

    const colegiosPorId = useMemo(() => {
        return new Map(datosDeColegios.map((colegio) => [
            colegio.id,
            colegio
        ]));
    }, [datosDeColegios]);

    const tiposPrendaPorId = useMemo(() => {
        return new Map(datosDeTipoPrenda.map((tipoPrenda) => [
            tipoPrenda.id,
            tipoPrenda
        ]));
    }, [datosDeTipoPrenda]);

    const abrirSelectorProducto = () => {
        setError("");
        setSelectorAbierto(true);
    };
    const cerrarSelectorProducto = () => {
        setSelectorAbierto(false);
    };

    const seleccionarProducto = (productoSeleccionado) => {
        if (!productoSeleccionado) {
        return;
        }

        const colegioAsignado = colegiosPorId.get(productoSeleccionado.colegio_id);
        const tipoPrendaAsignado = tiposPrendaPorId.get(
        productoSeleccionado.tipo_prenda_id
        );
        if (productoSeleccionado.tipo_prenda_id && !tipoPrendaAsignado
        ) {
        setError( `El producto "${productoSeleccionado.nombre}" no tiene un tipo de prenda asignado, por lo que no podrás agregar medidas personalizadas con este producto.`);
        }

        const productoYaAgregado = productosPedido.some(
            (producto) =>
                producto.producto_id === productoSeleccionado.id &&
                producto.talla === productoSeleccionado.talla
        );

        if (productoYaAgregado) {
            setError("El producto se agrego nuevamente, pero ya estaba en la lista, si no es intencional recomendamos borrar el producto duplicado");
            cerrarSelectorProducto();
        }

        const nuevoProductoPedido = {
        producto_id: productoSeleccionado.id,
        nombre: productoSeleccionado.nombre,
        colegio:  colegioAsignado?.nombre || "Sin colegio asignado",

        tipo_prenda: tipoPrendaAsignado?.tipo || "Sin tipo de prenda asignado",
        medidas_asig: tipoPrendaAsignado?.medidas_asig,

        talla: productoSeleccionado.talla || "",
        precio_talla: Number(productoSeleccionado.precio || 0 ),
        cantidad: 1,

        imagen: productoSeleccionado.imagen || "",
        estado_producto: "pendiente"
        };

        const nuevosProductos = [
        ...productosPedido,
        nuevoProductoPedido,
        ];
        onProductoChange(nuevosProductos);
        cerrarSelectorProducto();
    };

    const cambiarCantidad = (index, nuevaCantidad) => {
        const cantidad = Math.min(50, Math.max(1, Number(nuevaCantidad) || 1));
        const nuevosProductos = productosPedido.map((producto, i) => 
        i === index
            ? {... producto, cantidad}
            : producto
        );
        onProductoChange(nuevosProductos);
    };
    const eliminarProducto = (index) => {
        const nuevosProductos = productosPedido.filter((_, i) => i !== index);
        onProductoChange(nuevosProductos);
        setError("");
    };


    const abrirTomarMedidas = (producto, index) => {
        setError("");
        setProdutoEditarMedidas({producto, index});
        setModalTomarMedidasAbierto(true);
    };
    const cerrarTomarMedidas = () => {
        setProdutoEditarMedidas(null);
        setModalTomarMedidasAbierto(false);
    };
    const editarMedidas = (nuevasMedidas) => {
        if (!productoEditarMedidas) {
            return;
        }
        const { index } = productoEditarMedidas;
        const nuevosProductos = productosPedido.map((producto, i) =>
            i === index
                ? {
                    ...producto, medidas_asig: nuevasMedidas,
                }
                : producto
        );
        onProductoChange(nuevosProductos);
    };

    const toggleMedidas = (index) => {
        setMedidasAbiertas((prev) => ({
            ...prev, [index]: !prev[index],
        }));
    };
    return (
        <section className="agregarPedidoProductos">
        <div className="agregarPedidoProductosHeader">
            <div>
            <span className="agregarPedidoProductosEyebrow">
                PRODUCTOS DEL PEDIDO
            </span>
            </div>

            <button
            type="button"
            className="agregarPedidoProductosButton"
            onClick={abrirSelectorProducto}
            >
            <span>
                Agregar producto
            </span>
            </button>
        </div>

        {error && (
            <p className="agregarPedidoProductosError">
            {error}
            </p>
        )}

        <div className="agregarPedidoProductosLista">
            {productosPedido.length === 0 ? (
            <div className="agregarPedidoProductosEmpty">
                <div>
                <h3>
                    <Ghost size={17} strokeWidth={1.5} style={{marginRight: "10px"}}/> No hay nada por aquí
                </h3>
                </div>
            </div>
            ) : (
        productosPedido.map((producto, index) => {
            const precioUnitario = Number(producto.precio_talla || 0);
            const cantidad = Number(producto.cantidad || 1);
            const precioTotal = precioUnitario * cantidad;

            const medidas = producto.medidas_asig instanceof Map
                ? Array.from(producto.medidas_asig.entries())
                : Object.entries(producto.medidas_asig || {});

            return (
                <article
                    className="agregarPedidoProductoItem"
                    key={`${producto.producto_id || "producto"}-${producto.talla || "sin-talla"}-${index}`}
                >
                    <div className="agregarPedidoProductoImagen">
                        {producto.imagen ? (
                            <img
                                src={producto.imagen}
                                alt=""
                            />
                        ) : (
                            <Shirt
                                size={22}
                                strokeWidth={1.7}
                            />
                        )}
                    </div>
                    <div className="agregarPedidoProductoContenido">
                        <div className="agregarPedidoProductoPrincipal">
                            <h3>
                                {producto.nombre}
                            </h3>
                            <span className="agregarPedidoProductoTalla">
                                Medida / Talla {producto.talla}
                            </span>

                        </div>
                        <div className="agregarPedidoProductoMeta">
                            <span>
                                {producto.colegio}
                            </span>
                        </div>
                    </div>

                    <div className="agregarPedidoProductoPrecio">
                        <span>
                            Precio u.
                        </span>

                        <strong>
                            ${precioUnitario.toLocaleString("es-CL")}
                        </strong>
                    </div>
                    <div className="agregarPedidoProductoCantidad">
                        <div className="agregarPedidoProductoCantidadControl">
                            <button
                                type="button"
                                onClick={() =>
                                    cambiarCantidad(index, cantidad - 1)
                                }
                                disabled={cantidad <= 1}
                                aria-label={`Disminuir cantidad de ${producto.nombre}`}
                            >
                                <Minus  
                                    size={16}
                                    strokeWidth={2}/>
                            </button>
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={cantidad}
                                onChange={(e) =>
                                    cambiarCantidad(index, e.target.value)
                                }
                                aria-label={`Cantidad de ${producto.nombre}`}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    cambiarCantidad(index, cantidad + 1)
                                }
                                aria-label={`Aumentar cantidad de ${producto.nombre}`}
                                disabled={cantidad >= 50}
                            >
                                <Plus  
                                    size={16}
                                    strokeWidth={2}/>
                            </button>
                        </div>
                    </div>
                    <div className="agregarPedidoProductoTotal">
                        <span>
                            Total
                        </span>
                        <strong>
                            ${precioTotal.toLocaleString("es-CL")}
                        </strong>
                    </div>
                    <button
                        type="button"
                        className="agregarPedidoProductoEliminar"
                        onClick={() =>
                            eliminarProducto(index)
                        }
                        aria-label={`Eliminar ${producto.nombre}`}
                    >
                        <Trash2
                            size={17}
                            strokeWidth={1.8}
                        />
                    </button>
                    {medidas.length > 0 && (
                        <div className="agregarPedidoProductoMedidas">
                            {medidasAbiertas[index] && (
                                <div className="agregarPedidoProductoMedidasLista">
                                <button className="tomarMedidasButton"
                                onClick={() => abrirTomarMedidas(producto, index)}
                                >
                                    EDITAR MEDIDAS
                                </button>
                                    {medidas.map(([nombre, valor]) => (
                                        <div
                                            className="agregarPedidoProductoMedida"
                                            key={nombre}
                                        >
                                            <span>
                                                {nombre}:
                                            </span>
                                            <strong>
                                                {(valor) !== ""
                                                    ? valor
                                                    : "Sin medidas asignadas"}
                                            </strong>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button
                                type="button"
                                className="agregarPedidoProductoMedidasToggle"
                                onClick={() => toggleMedidas(index)}
                                aria-expanded={medidasAbiertas[index] || false}
                            >
                                <span>
                                    {medidasAbiertas[index]
                                        ? "Ocultar medidas"
                                        : "Ver medidas"}
                                </span>
                                <ChevronDown
                                    size={16}
                                    strokeWidth={1.8}
                                    className={
                                        medidasAbiertas[index]
                                            ? "agregarPedidoProductoMedidasIcon abierta"
                                            : "agregarPedidoProductoMedidasIcon"
                                    }
                                />
                            </button>
                        </div>
                    )}
                </article>
            );
            })
        )}
        </div>

        {modalTomarMedidasAbierto && (
            <ModalTomarMedidas
                modalAbierto={modalTomarMedidasAbierto}
                producto={productoEditarMedidas?.producto}
                onEditarMedidas={editarMedidas}
                onCerrarModal={cerrarTomarMedidas}
            />
        )}
        {selectorAbierto && (
        <ModalSelectorProductos
            modalAbierto={selectorAbierto}
            onCerrarModal={cerrarSelectorProducto}
            onSeleccionarProducto={seleccionarProducto}
        /> )}
        </section>
    );
}