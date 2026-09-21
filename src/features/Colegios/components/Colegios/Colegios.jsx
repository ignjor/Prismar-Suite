import "./Colegios.css";
import { useColegios } from "../../querys/useColegios";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase";

import ModalAgregarEditarColegio from "../ModalAgregarEditarColegio/ModalAgregarEditarColegio";
import ModalConfirmarEliminacion from "../../../../components/modals/ModalConfirmarEliminacion/ModalConfirmarEliminacion";

import { PencilLine, Eraser, School, Search } from "lucide-react";

export default function Colegios() {
    const { data: datosDeColegios = [],
      isLoading, isError, error
    } = useColegios();

    const [colegioAEditar, setColegioAEditar] = useState(null);
    const [colegioAEliminar, setColegioAEliminar] = useState(null);

    const [estadoDelModal, setEstadoDelModal] = useState(false);
    const [estadoDelModalEliminar, setEstadoDelModalEliminar] = useState(false);
     

    const listarColegios = [...datosDeColegios].sort((a, b) => {
          const fechaA = a.fecha_actualizacion?.toMillis?.() || 0;
          const fechaB = b.fecha_actualizacion?.toMillis?.() || 0;
          return fechaB - fechaA;
    });

    const [buscador, setBuscador] = useState("");
    const buscadorDeColegios = listarColegios.filter((colegio) =>
      colegio.nombre?.toLowerCase().includes(buscador.toLowerCase()))

    const abrirModalParaCrear = () => {
        setColegioAEditar(null); setEstadoDelModal(true); 
    };
    const abrirModalParaEditar = (datoColegioEspecifico) => {
        setColegioAEditar(datoColegioEspecifico); setEstadoDelModal(true); 
    };
    const cerrarModal = () => {
        setColegioAEditar(null); setEstadoDelModal(false); 
    };


    const abrirModalParaEliminar = (datoColegioEspecifico) => {
        setColegioAEliminar(datoColegioEspecifico); setEstadoDelModalEliminar(true);
    };
    const cerrarModalEliminar = () => {
        setColegioAEliminar(null); setEstadoDelModalEliminar(false);
    };

    const eliminarColegio = async (colegio) => {
      if (!colegio?.id) { 
        console.error("No ser pudo encontrar el colegio. Recarga la página.");
        throw new Error("El colegio no tiene identificador valido.");
      }
      try {await deleteDoc(doc(db, "colegios", colegio.id));
      }catch (error) {
        console.error("Error al eliminar el colegio:", error);
        throw error;
      }
    };

    if (isLoading) { return <p>Cargando Colegios...</p>}
    if (isError) { return <p>Error: {error.message}. Error al Cargar Colegios, recargue la página.</p>}
    return(
      <main className="adminColegios">
        <header className="adminColegiosHeader">
          <h1 className="adminColegiosTitle">
            Empresas / Colegios
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
              autoComplete="off"
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
                  className="colegioAction colegioActionEdit"
                  aria-label={`Editar ${datoColegioEspecifico.nombre}`}
                  onClick={() => abrirModalParaEditar(datoColegioEspecifico)}
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
                  onClick= {() => abrirModalParaEliminar(datoColegioEspecifico)}
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
          {estadoDelModal && (
          <ModalAgregarEditarColegio
            datoColegioEditar = {colegioAEditar}
            modalAbierto = {estadoDelModal}
            onCerrarModal = {cerrarModal}
          /> )}
          {estadoDelModalEliminar && (
          <ModalConfirmarEliminacion
            tipo = "colegio"
            dato = {colegioAEliminar}
            modalAbierto= {estadoDelModalEliminar}
            onCerrarModal= {cerrarModalEliminar}
            onConfirmarEliminacion= {eliminarColegio}
          /> )}
      </main>
    );
}