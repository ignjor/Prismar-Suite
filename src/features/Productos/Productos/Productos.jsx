import "./Productos.css";
import { db } from "../../../firebase";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
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

    const obtenerDatosDeProductos = async() => {
      try {
          const listaDatosDeProductos = (await getDocs
              (collection(db, "productos"))).docs.map((documento) => ({
              id: documento.id, ...documento.data()
          }));
          await obtenerDatosDeColegios(listaDatosDeProductos);
      } catch (error) {console.error("Error al obtener los Productos:", error);
      }};

    const obtenerDatosDeColegios = async(listaDatosDeProductos) => {
      try {
          const productosConColegio = await Promise.all
            (listaDatosDeProductos.map(async (producto) => {
              if (!producto.colegio_id) {
                return {
                  ...producto, nombreColegio: "Sin Afiliado",
                };
              }

              const listaDatosDeColegios = (await getDoc
                  (doc(db, "colegios", producto.colegio_id)));
                  return {
                    ...producto, nombreColegio: listaDatosDeColegios.exists()
                     ? listaDatosDeColegios.data().nombre
                     : "Sin Afiliado",
                  };
              }));
          setDatosDeProductos(productosConColegio);
      } catch (error) {console.error("Error al obtener los Colegios:", error);
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

                <h2 className="ColegioAsignadoTitle">
                  {datoProductoEspecifico.nombreColegio}
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