import "./Tallas.css";
import { db } from "../../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import ModalAgregarEditarTalla from "../ModalAgregarEditarTalla/ModalAgregarEditarTalla";
import { PencilLine, Eraser, Tag, Search } from "lucide-react";

export default function Tallas() {
    const [datosDeTallas, setDatosDeTallas] = useState([]);
    const [tallaAEditar, setTallaAEditar] = useState(null);

    const [buscador, setBuscador] = useState("");
    const buscadorDeTallas = datosDeTallas.filter((talla) =>
      talla.talla?.toLowerCase().includes(buscador.toLowerCase()))

    const [estadoDelModal, setEstadoDelModal] = useState(false);

    const abrirModalParaCrear = () => {
        setTallaAEditar(null); setEstadoDelModal(true); 
    };
    const abrirModalParaEditar = (datoTallaEspecifica) => {
        setTallaAEditar(datoTallaEspecifica); setEstadoDelModal(true); 
    };
    const cerrarModal = () => {
        setTallaAEditar(null); setEstadoDelModal(false); 
    };


    useEffect(() => {
        obtenerDatosDeTallas();
    }, []);
    const obtenerDatosDeTallas = async () => {
        try {
            const listaDatosDeTallas = (await getDocs
                (collection(db, "tallas"))).docs.map((documento) => ({
                id: documento.id, ...documento.data(),
            }));
            setDatosDeTallas(listaDatosDeTallas);
        } catch (error) {console.error("Error al obtener las Tallas:", error);
        }};

    return(
      <main className="adminColegios">
        <header className="adminColegiosHeader">
          <h1 className="adminColegiosTitle">
            Tallas
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
              placeholder="Buscar talla..."
              value={buscador}
              onChange={(e) => setBuscador(e.target.value)}
              aria-label="Buscar talla"
            />
          </div>
        </header>
        <section className="colegiosGrid">

          {buscadorDeTallas.map((datoTallaEspecifica) => (
            <article
              key={datoTallaEspecifica.id}
              className="colegioCard"
            >
              <div className="colegioCardContent">
                <h2 className="colegioNombre">
                  {datoTallaEspecifica.talla}
                </h2>
              </div>
              <div className="colegioActions">
                <button
                  type="button"
                  className="colegioAction colegioActionEdit"
                  aria-label={`Editar ${datoTallaEspecifica.talla}`}
                  onClick={() => abrirModalParaEditar(datoTallaEspecifica)}
                >
                  <PencilLine size={17} strokeWidth={2} />
                  <span>
                    Editar
                  </span>
                </button>
                <button
                  type="button"
                  className="colegioAction colegioActionDelete"
                  aria-label={`Eliminar ${datoTallaEspecifica.talla}`}
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

        <section className="agregarColegio">
            <p className="agregarColegioTexto">
              ¿Necesitas agregar una Talla?
            </p>
            <button
              type="button"
              className="agregarColegioButton"
              aria-label="Agregar colegio"
              onClick={abrirModalParaCrear}
            >
              <Tag size={21} strokeWidth={2}/>
            </button>
        </section>

          <ModalAgregarEditarTalla
            datoTallaEditar = {tallaAEditar}
            modalAbierto = {estadoDelModal}
            onCerrarModal = {cerrarModal}
            onRecargarTallas={obtenerDatosDeTallas}
              />
      </main>
    );
}