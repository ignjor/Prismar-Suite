import "./AgregarPedidoProductos.css";
import { useMemo, useState } from "react";
import { useColegios } from "../../../../Colegios/querys/useColegios";
import { useTipoPrenda } from "../../../../TiposProducto/querys/useTipoPrenda";

import ModalSelectorProductos from "../../../../../components/modals/ModalSelectorProductos/ModalSelectorProductos";

import { Trash2, Shirt } from "lucide-react";

export default function AgregarPedidoProductos({productosPedido = [], onProductoChange}){
    const [error, setError] = useState("");
    const [selectorAbierto, setSelectorAbierto] = useState(false);

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
        setError("");

        const colegioAsignado = colegiosPorId.get(productoSeleccionado.colegio_id);
        const tipoPrendaAsignado = tiposPrendaPorId.get(
        productoSeleccionado.tipo_prenda_id
        );

        if (productoSeleccionado.tipo_prenda_id && !tipoPrendaAsignado
        ) {
        setError("No se pudo encontrar el tipo de prenda asociado al producto.");
        return;
        }
  
        const nuevoProductoPedido = {
        producto_id: productoSeleccionado.id || null,
        nombre: productoSeleccionado.nombre || "Producto sin nombre",
        colegio:  colegioAsignado?.nombre || "Sin colegio asignado",
        tipo_prenda: tipoPrendaAsignado?.tipo || "Sin tipo de prenda",
        talla: productoSeleccionado.talla || "",
        precio_talla: Number(productoSeleccionado.precio || 0 ),
        imagen: productoSeleccionado.imagen || "",
        cantidad: 1,
        };

        const nuevosProductos = [
        ...productosPedido,
        nuevoProductoPedido,
        ];
        onProductoChange(nuevosProductos);
        cerrarSelectorProducto();
    };

    const eliminarProducto = (index) => {
        const nuevosProductos = productosPedido.filter((_, i) => i !== index);
        onProductoChange(nuevosProductos);
        setError("");
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
                    El pedido esta vacio
                </h3>
                </div>
            </div>
            ) : (

            productosPedido.map((producto, index) => (
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
                    Precio
                    </span>
                    <strong>
                    $
                    {Number(producto.precio_talla || 0 ).toLocaleString("es-CL")}
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
                </article>
            ))
            )}
        </div>
        <ModalSelectorProductos
            modalAbierto={selectorAbierto}
            onCerrarModal={cerrarSelectorProducto}
            onSeleccionarProducto={seleccionarProducto}
        />
        </section>
    );
}