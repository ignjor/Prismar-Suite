import "./AdminColegios.css";
import {db} from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import ModalAgregarEditarColegio from "../../modals/ModalAgregarEditarColegio/ModalAgregarEditarColegio";
import {PencilLine, Eraser, School} from "lucide-react";

export default function AdminColegios() {
    const [datosDeColegios, setDatosDeColegios] = useState([]);
    const [colegioAEditar, setColegioAEditar] = useState(null);

    useEffect (() => {
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


    const [estadoDelModal, setEstadoDelModal] = useState(false);

    const abrirModalParaCrear = () => {
        setEstadoDelModal(true); setColegioAEditar(null); 
    };
    const abrilModalParaEditar = (datoColegioEspecifico) => {
        setEstadoDelModal(true); setColegioAEditar(datoColegioEspecifico); 
    };
    const cerrarModal = () => {
        setEstadoDelModal(false); setColegioAEditar(null); 
    };

    return(
      <main className="adminColegios">
        <header className="adminColegiosHeader">
          <h1 className="adminColegiosTitle">
            Empresas / Colegios
          </h1>
        </header>
        <section className="colegiosGrid">

          {datosDeColegios.map((datoColegioEspecifico) => (
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
                  className="colegioAction colegioActionEdit"
                  aria-label={`Editar ${datoColegioEspecifico.nombre}`}
                  onClick={() => abrilModalParaEditar(datoColegioEspecifico)}
                >
                  <PencilLine size={17} strokeWidth={2} />
                  <span>
                    Editar
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

        <section className="agregarColegio">
            <p className="agregarColegioTexto">
              ¿Necesitas agregar una empresa o un colegio?
            </p>
            <button
              type="button"
              className="agregarColegioButton"
              aria-label="Agregar colegio"
              onClick={abrirModalParaCrear}
            >
              <School size={21} strokeWidth={2}/>
            </button>
        </section>
          <ModalAgregarEditarColegio
            datoColegioEditar = {colegioAEditar}
            modalAbierto = {estadoDelModal}
            onCerrarModal = {cerrarModal}
            onGuardarColegio={obtenerDatosDeColegios}
              />
      </main>
    );
}