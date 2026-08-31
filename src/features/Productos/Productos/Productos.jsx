import "./Productos.css";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import { Eraser, Search, Eye } from "lucide-react";

export default function Productos() {
    const [datosDeProductos, setDatosDeProductos] = useState([]);
    const [verElProducto, setVerElProducto] = useState(null);

    const [buscador, setBuscador] = useState("");
    const buscadorDeProductos = datosDeProductos.filter((producto) =>
      producto.nombre?.toLowerCase().includes(buscador.toLowerCase()))

    const abrirVerProducto = (datoProductoEspecifico) => {
        setVerElProducto(datoProductoEspecifico); setEstadoDelModal(true); 
    };


    useEffect(() => {
        obtenerDatosDeProductos();
    }, []);
    const obtenerDatosDeProductos = async () => {
        try {
            const listaDatosDeProductos = (await getDocs
                (collection(db, "productos"))).docs.map((documento) => ({
                id: documento.id, ...documento.data(),
            }));
            setDatosDeProductos(listaDatosDeProductos);
        } catch (error) {console.error("Error al obtener los Productos:", error);
        }};

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
                  /*onClick={() => abrirVerProducto(datoProductoEspecifico)}*/
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

        {/*  
          <ModalAgregarEditarColegio
            datoColegioEditar = {colegioAEditar}
            modalAbierto = {estadoDelModal}
            onCerrarModal = {cerrarModal}
            onRecargarColegios={obtenerDatosDeColegios}
              /> */}
      </main>
    );
}