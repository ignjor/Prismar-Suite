import "./Productos.css";
import { db } from "../../../../firebase";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Eraser, Search, Eye } from "lucide-react";

export default function Productos() {
    const navigate = useNavigate();
    const [datosDeProductos, setDatosDeProductos] = useState([]);

    const [buscador, setBuscador] = useState("");
    const buscadorDeProductos = datosDeProductos.filter((producto) =>
      producto.nombre?.toLowerCase().includes(buscador.toLowerCase()))

    useEffect(() => {
        obtenerDatosDeProductos();
    }, []);

    const obtenerDatosDeProductos = async() => {
      try {
        const rutaProductosFirestore = await getDocs(collection(db, "productos"));
        const productos = rutaProductosFirestore.docs.map((documento) => ({
          id: documento.id, ...documento.data()
        }));
        const colegiosIDs = [...new Set(
          productos.map((producto) => producto.colegio_id).filter(Boolean)
        ),];
        const datosDeColegios = await Promise.all(
          colegiosIDs.map(async (colegioIDEspecifico) => {
            const rutaColegioFirestore = await getDoc(doc(db, "colegios", colegioIDEspecifico));
            return {id: colegioIDEspecifico, nombre:rutaColegioFirestore.exists()
              ? rutaColegioFirestore.data().nombre
              : "Sin Afiliado",
            };
          })
        );
        const colegiosMap = new Map(datosDeColegios
          .map((colegio) => [colegio.id, colegio.nombre])
        );
        const productosConColegio = productos.map((producto) => ({
          ...producto, nombreColegio:producto.colegio_id
          ? colegiosMap.get(producto.colegio_id) ?? "Sin Afiliado"
          : "Sin afiliado",
        }));
        setDatosDeProductos(productosConColegio);
      }catch(error) {console.error("Error al obtener los Productos:",error);
      }
    };

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