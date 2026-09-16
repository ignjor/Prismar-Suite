import "./Tallas.css";
import { useTallas } from "../../querys/useTallas";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase";

import ModalAgregarEditarTalla from "../ModalAgregarEditarTalla/ModalAgregarEditarTalla";
import ModalConfirmarEliminacion from "../../../../components/modals/ModalConfirmarEliminacion/ModalConfirmarEliminacion";
import { PencilLine, Eraser, Tag, Search } from "lucide-react";

export default function Tallas() {
    const { data: datosDeTallas = [],
      isLoading, isError, error
    } = useTallas();

    const [tallaAEditar, setTallaAEditar] = useState(null);
    const [tallaAEliminar, setTallaAEliminar] = useState(null);

    const listarTallas = [...datosDeTallas].sort((a, b) => {
          const fechaA = a.fecha_actualizacion?.toMillis?.() || 0;
          const fechaB = b.fecha_actualizacion?.toMillis?.() || 0;
          return fechaB - fechaA;
    });

    const [buscador, setBuscador] = useState("");
    const buscadorDeTallas = listarTallas.filter((talla) =>
      talla.talla?.toLowerCase().includes(buscador.toLowerCase()))

    const [estadoDelModalEditar, setEstadoDelModalEditar] = useState(false);
    const [estadoDelModalEliminar, setEstadoDelModalEliminar] = useState(false);

    const abrirModalParaCrear = () => {
        setTallaAEditar(null); setEstadoDelModalEditar(true); 
    };
    const abrirModalParaEditar = (datoTallaEspecifica) => {
        setTallaAEditar(datoTallaEspecifica); setEstadoDelModalEditar(true); 
    };
    const cerrarModal = () => {
        setTallaAEditar(null); setEstadoDelModalEditar(false); 
    };
    
    const abrirModalParaEliminar = (datoTallaEspecifica) => {
        setTallaAEliminar(datoTallaEspecifica); setEstadoDelModalEliminar(true);
    };
    const cerrarModalEliminar = () => {
        setTallaAEliminar(null); setEstadoDelModalEliminar(false);
    };

    const eliminarTalla = async (talla) => {
      if (!talla?.id) { 
        console.error("No ser pudo encontrar la talla. Recarga la página.");
        throw new Error("La talla no tiene identificador valido.");
      }
      try {await deleteDoc(doc(db, "tallas", talla.id));
      }catch (error) {
        console.error("Error al eliminar la talla:", error);
        throw error;
      }
    };

    if (isLoading) { return <p>Cargando Tallas...</p>}
    if (isError) { return <p>Error: {error.message}. Error al Cargar Tallas, recargue la página.</p>}
    return(
      <main className="adminColegios">
        <header className="adminColegiosHeader">
          <h1 className="adminColegiosTitle">
            Unidades de Medida
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
                  onClick= {() => abrirModalParaEliminar(datoTallaEspecifica)}
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
          {estadoDelModalEditar && (
          <ModalAgregarEditarTalla
            datoTallaEditar = {tallaAEditar}
            modalAbierto = {estadoDelModalEditar}
            onCerrarModal = {cerrarModal}
              /> )}

          {estadoDelModalEliminar && (
          <ModalConfirmarEliminacion
            tipo = "talla"
            dato = {tallaAEliminar}
            modalAbierto= {estadoDelModalEliminar}
            onCerrarModal= {cerrarModalEliminar}
            onConfirmarEliminacion= {eliminarTalla}
          /> )}
      </main>
    );
}