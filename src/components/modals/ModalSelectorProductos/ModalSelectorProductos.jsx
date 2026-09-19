import "./ModalSelectorProductos.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useProductos } from "../../../features/Productos/querys/useProductos";
import { useColegios } from "../../../features/Colegios/querys/useColegios";
import { useTipoPrenda } from "../../../features/TiposProducto/querys/useTipoPrenda";

import ModalSelector from "../ModalSelector/ModalSelector";

import { X, Search, Shirt, Tag } from "lucide-react";

const body = document.body;

export default function ModalSelectorProductos({modalAbierto, onCerrarModal, onSeleccionarProducto}) {
  const RefAreaDelModal = useRef(null);
  const [buscador, setBuscador] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const { data: datosDeProductos = [], isLoading } = useProductos();
  const { data: datosDeColegios = [] } = useColegios();
  const { data: datosDeTipoPrenda = []} = useTipoPrenda();

  const tipoPrendaMap = useMemo(() => {
     return new Map(datosDeTipoPrenda.map(
      (tipo_prenda) => [tipo_prenda.id, tipo_prenda.tipo]
    ));
  }, [datosDeTipoPrenda]);
  const colegiosMap = useMemo(() => {
    return new Map(datosDeColegios.map(
      (colegio) => [colegio.id, colegio.nombre]
    ));
   }, [datosDeColegios]);

  const buscadorNormalizado = buscador.trim().toLowerCase();
  const productosOrdenados = useMemo(() => {
    return [...datosDeProductos].sort((a, b) => {
      const fechaA = a.fecha_actualizacion?.toMillis?.() || 0;
      const fechaB = b.fecha_actualizacion?.toMillis?.() || 0;
      return fechaB - fechaA;
        })
      .map((producto) => ({
        ...producto,
        nombreColegio: producto.colegio_id
          ? colegiosMap.get(producto.colegio_id) ?? "Sin Afiliado"
          : "Sin Afiliado",
        nombreTipoPrenda: producto.tipo_prenda_id
          ? tipoPrendaMap.get(producto.tipo_prenda_id) ?? "Sin Afiliado"
          : "Sin Afiliado"
       }));
  }, [datosDeProductos, colegiosMap, tipoPrendaMap]);

  const productosFiltrados = useMemo(() => {
    if (!buscadorNormalizado) {
      return productosOrdenados;
    }
    return productosOrdenados.filter((producto) =>
      producto.nombre?.toLowerCase().includes(buscadorNormalizado)
    );
  }, [productosOrdenados, buscadorNormalizado]);

  useEffect(() => {
    if (!modalAbierto) {
      body.style.overflow = "";
      setBuscador("");
      setProductoSeleccionado(null);
      return;
    }

    body.style.overflow = "hidden";
    setBuscador("");
    setProductoSeleccionado(null);

    return () => {
      body.style.overflow = "";
    };
  }, [modalAbierto]);

  useEffect(() => {
    if (!modalAbierto) {
      body.style.overflow = "";
      return;
    }

    body.style.overflow = "hidden";

    const clickFueraDelModal = (event) => {
      if (
        RefAreaDelModal.current &&
        !RefAreaDelModal.current.contains(event.target)
      ) {
        onCerrarModal();
      }
    };

    document.addEventListener("mousedown", clickFueraDelModal);

    return () => {
      document.removeEventListener("mousedown", clickFueraDelModal);
    };
  }, [modalAbierto, onCerrarModal]);

  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setBuscador("");
  };

  const volverAProductos = () => {
    setProductoSeleccionado(null);
    setBuscador("");
  };

  const seleccionarPrecio = (talla, precio) => {
    if (!productoSeleccionado) {
      return;
    }

    onSeleccionarProducto?.({
      ...productoSeleccionado,
      talla,
      precio: Number(precio),
    });

    onCerrarModal();
  };

  const preciosDisponibles = useMemo(() => {
    if (!productoSeleccionado?.precios_tallas) {
      return [];
    }

    return Object.entries(productoSeleccionado.precios_tallas)
      .map(([talla, precio]) => ({
        talla,
        precio: Number(precio),
      }))
      .sort((a, b) => a.precio - b.precio);
  }, [productoSeleccionado]);

  if (!modalAbierto) {
    return null;
  }

  if (!productoSeleccionado) {
    return (
      <div className="modalSelectorProductosOverlay">
        <div
          className="modalSelectorProductos"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalSelectorProductosTitle"
          ref={RefAreaDelModal}
        >
          <header className="modalSelectorProductosHeader">
            <div className="modalSelectorProductosHeading">

              <div>
                <h2
                  id="modalSelectorProductosTitle"
                  className="modalSelectorProductosTitle"
                >
                  Productos
                </h2>
              </div>
            </div>

            <button
              type="button"
              className="modalSelectorProductosClose"
              onClick={onCerrarModal}
              aria-label="Cerrar"
            >
              <X size={17} strokeWidth={2} />
            </button>
          </header>

          <div className="modalSelectorProductosContent">
            <div className="modalSelectorProductosSearch">
              <Search size={17} strokeWidth={2} />

              <input
                type="text"
                value={buscador}
                onChange={(event) => setBuscador(event.target.value)}
                placeholder="Buscar producto..."
                autoComplete="off"
              />

              {buscador && (
                <button
                  type="button"
                  className="modalSelectorProductosClearSearch"
                  onClick={() => setBuscador("")}
                  aria-label="Limpiar búsqueda"
                >
                  <X size={14} strokeWidth={2} />
                </button>
              )}
            </div>

            <div className="modalSelectorProductosResults">
              {isLoading ? (
                <div className="modalSelectorProductosEmpty">
                  <div className="modalSelectorProductosEmptyIcon">
                    <Shirt size={21} strokeWidth={1.7} />
                  </div>

                  <p className="modalSelectorProductosEmptyText">
                    Cargando productos...
                  </p>
                </div>
              ) : productosFiltrados.length > 0 ? (
                productosFiltrados.map((producto) => (
                  <button
                    type="button"
                    className="modalSelectorProductosItem"
                    key={producto.id}
                    onClick={() => seleccionarProducto(producto)}
                  >
                    <div className="modalSelectorProductosItemImage">
                      {producto.imagen ? (
                        <img src={producto.imagen} alt="" />
                      ) : (
                        <Shirt size={18} strokeWidth={1.5} />
                      )}
                    </div>

                    <div className="modalSelectorProductosItemContent">
                      <span className="modalSelectorProductosItemName">
                        {producto.nombre || "Producto sin nombre"} - <strong><em>({producto.nombreColegio})</em></strong>
                      </span>
                      <span className="modalSelectorProductosItemMeta">
                        {Object.entries(producto.precios_tallas || {})
                          .sort(([, precioA], [, precioB]) => Number(precioA) - Number(precioB))
                          .map(([talla]) => talla)
                          .join(" - ")}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="modalSelectorProductosEmpty">
                  <div className="modalSelectorProductosEmptyIcon">
                    <Search size={21} strokeWidth={1.7} />
                  </div>

                  <p className="modalSelectorProductosEmptyText">
                    {buscador
                      ? `No hay productos para "${buscador}".`
                      : "Todavía no hay productos disponibles."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modalSelectorProductosOverlay">
      <div
        className="modalSelectorProductos"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalSelectorPrecioTitle"
        ref={RefAreaDelModal}
      >
        <header className="modalSelectorProductosHeader">
          <div className="modalSelectorProductosHeading">

            <div className="modalSelectorProductosSelectedImage">
              {productoSeleccionado.imagen ? (
                <img src={productoSeleccionado.imagen} alt="" />
              ) : (
                <Shirt size={18} strokeWidth={1.7} />
              )}
            </div>

            <div className="modalSelectorProductosSelectedInfo">
              <h2
                id="modalSelectorPrecioTitle"
                className="modalSelectorProductosTitle"
              >
                {productoSeleccionado.nombre || "Producto sin nombre"}
              </h2>
            </div>
          </div>

          <button
            type="button"
            className="modalSelectorProductosClose"
            onClick={onCerrarModal}
            aria-label="Cerrar"
          >
            <X size={17} strokeWidth={2} />
          </button>
        </header>

        <div className="modalSelectorProductosContent">
          <div className="modalSelectorProductosPrices">
            {preciosDisponibles.length > 0 ? (
              preciosDisponibles.map(({ talla, precio }) => (
                <button
                  type="button"
                  className="modalSelectorProductosPriceItem"
                  key={talla}
                  onClick={() => seleccionarPrecio(talla, precio)}
                >
                  <div className="modalSelectorProductosPriceSize">
                    {talla}
                  </div>

                  <div className="modalSelectorProductosPriceInfo">
                    <span className="modalSelectorProductosPriceValue">
                      ${precio.toLocaleString("es-CL")}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="modalSelectorProductosEmpty">
                <div className="modalSelectorProductosEmptyIcon">
                  <Tag size={21} strokeWidth={1.7} />
                </div>

                <p className="modalSelectorProductosEmptyText">
                  Este producto no tiene precios.
                </p>
              </div>
            )}
          </div>
        </div>

        <footer className="modalSelectorProductosFooter">
          <button
            type="button"
            className="modalSelectorProductosCancel"
            onClick={volverAProductos}
          >
            Buscar otro producto
          </button>
        </footer>
      </div>
    </div>
  );
} 