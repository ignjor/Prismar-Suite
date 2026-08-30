import "./Productos.css";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import { Eraser, Search, Eye } from "lucide-react";

export default function Productos() {
    const [datosDeColegios, setDatosDeColegios] = useState([]);
    const [colegioAEditar, setColegioAEditar] = useState(null);

    const [buscador, setBuscador] = useState("");
    const buscadorDeColegios = datosDeColegios.filter((colegio) =>
      colegio.nombre?.toLowerCase().includes(buscador.toLowerCase()))

    const [estadoDelModal, setEstadoDelModal] = useState(false);

    const abrirModalParaCrear = () => {
        setColegioAEditar(null); setEstadoDelModal(true); 
    };
    const abrirModalParaEditar = (datoColegioEspecifico) => {
        setColegioAEditar(datoColegioEspecifico); setEstadoDelModal(true); 
    };
    const cerrarModal = () => {
        setColegioAEditar(null); setEstadoDelModal(false); 
    };


    useEffect(() => {
        obtenerDatosDeColegios();
    }, []);
    const obtenerDatosDeColegios = async () => {
        try {
            const listaDatosDeColegios = (await getDocs
                (collection(db, "colegios"))).docs.map((documento) => ({
                id: documento.id, ...documento.data(),
            }));
            setDatosDeColegios(listaDatosDeColegios);
        } catch (error) {console.error("Error al obtener los colegios:", error);
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
              placeholder="Buscar empresa o colegio..."
              value={buscador}
              onChange={(e) => setBuscador(e.target.value)}
              aria-label="Buscar empresa o colegio"
            />
          </div>
        </header>
        <section className="colegiosGrid">

          {buscadorDeColegios.map((datoColegioEspecifico) => (
            <article
              key={datoColegioEspecifico.id}
              className="colegioCard"
            >
              <div className="colegioCardContent">
                <h2 className="colegioNombre">
                  {datoColegioEspecifico.nombre}
                </h2>
              </div>
              <div className="colegioActions">
                <button
                  type="button"
                  className="colegioAction colegioActionEye"
                  aria-label={`Editar ${datoColegioEspecifico.nombre}`}
                  onClick={() => abrirModalParaEditar(datoColegioEspecifico)}
                >
                  <Eye size={17} strokeWidth={2} />
                  <span>
                    Ver
                  </span>
                </button>
                <button
                  type="button"
                  className="colegioAction colegioActionDelete"
                  aria-label={`Eliminar ${datoColegioEspecifico.nombre}`}
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