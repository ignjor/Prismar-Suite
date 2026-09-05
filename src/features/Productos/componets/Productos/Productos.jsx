import "./Productos.css";
import { useProductos } from "../../querys/useProductos";
import { useColegios } from "../../../Colegios/querys/useColegios";
import { useTipoPrenda } from "../../../TiposProducto/querys/useTipoPrenda";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Eraser, Search, Eye } from "lucide-react";

export default function Productos() {
    const navigate = useNavigate();
    const [buscador, setBuscador] = useState("");

    const { data: datosDeProductos = [],
      isLoading, isError, error
    } = useProductos();
    const { data: datosDecolegios = []} = useColegios();
    const { data: datosDeTipoPrenda = []} = useTipoPrenda();

    const colegiosMap = useMemo(() => {
      return new Map(datosDecolegios.map(
        (colegio) => [colegio.id, colegio.nombre]
      ));
    }, [datosDecolegios]);
    const tipoPrendaMap = useMemo(() => {
      return new Map(datosDeTipoPrenda.map(
        (tipo_prenda) => [tipo_prenda.id, tipo_prenda.tipo]
      ));
    }, [datosDeTipoPrenda]);

    const listarProductos = useMemo(() => {
      return datosDeProductos.map((producto) => ({
        ...producto,

        nombreColegio: producto.colegio_id
          ? colegiosMap.get(producto.colegio_id) ?? "Sin Afiliado"
          : "Sin Afiliado",

        nombreTipoPrenda: producto.tipo_prenda_id
          ? tipoPrendaMap.get(producto.tipo_prenda_id) ?? "Sin Afiliado"
          : "Sin Afiliado",
      }));
    }, [datosDeProductos, colegiosMap, tipoPrendaMap]);

    const buscadorDeProductos = listarProductos.filter(
      (producto) =>
        producto.nombre
          ?.toLowerCase()
          .includes(buscador.toLowerCase())
    );

    if (isLoading) { return <p>Cargando los Productos...</p>}
    if (isError) { return <p>Error: {error.message}. Error al Cargar los Productos, recargue la página.</p>}
    return(
      <main className="adminColegios">
        <header className="adminColegiosHeader">
          <h1 className="adminColegiosTitle">
            Productos
          </h1>
          
          <div className="colegiosBuscador">
            <Search
              className="colegiosBuscadorIcon"
              size={18}
              strokeWidth={2}
            />
            <input
              type="text"
              className="colegiosBuscadorInput"
              placeholder="Buscar un producto con su nombre..."
              value={buscador}
              onChange={(e) => setBuscador(e.target.value)}
              aria-label="Buscar Colegio"
            />
          </div>
        </header>
        <section className="colegiosGrid">

          {buscadorDeProductos.map((datoProductoEspecifico) => (
            <article
              key={datoProductoEspecifico.id}
              className="colegioCard"
            >
              <div className="colegioCardContent">
                <h2 className="colegioNombre">
                  {datoProductoEspecifico.nombre}
                </h2>

                <h2 className="ColegioAsignadoTitle">
                  {datoProductoEspecifico.nombreColegio}
                </h2>
                <h2 className="TipoPrendaAsignadoTitle">
                  {datoProductoEspecifico.nombreTipoPrenda}
                </h2>

                <h2 className="medidasAsignadasTitle">
                  PRECIOS:
                </h2>
                <div className="medidasAsignadas">
                  {Object.entries(datoProductoEspecifico.precios_tallas || {}).map(([talla, precio]) => (
                    <span className="atributosTipoPrenda" key={talla}>
                    {talla}: ${Number(precio).toLocaleString("es-CL")}
                    </span>
                  ))}
                </div>
              </div>
              <div className="colegioActions">
                <button
                  type="button"
                  className="colegioAction colegioActionEye"
                  aria-label={`Editar ${datoProductoEspecifico.nombre}`}
                  onClick={() => navigate(`/ver-producto/id=${datoProductoEspecifico.id}`)}
                >
                  <Eye size={17} strokeWidth={2} />
                  <span>
                    Ver
                  </span>
                </button>
                <button
                  type="button"
                  className="colegioAction colegioActionDelete"
                  aria-label={`Eliminar ${datoProductoEspecifico.nombre}`}
                >
                  <Eraser size={17} strokeWidth={2} />
                  <span>
                    Eliminar
                  </span>
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    );
}