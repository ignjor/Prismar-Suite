import "./TipoPrenda.css";
import { useTipoPrenda } from "../../querys/useTipoPrenda";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase";

import ModalAgregarEditarTipoPrenda from "../ModalAgregarEditarTipoPrenda/ModalAgregarEditarTipoPrenda";
import ModalConfirmarEliminacion from "../../../../components/modals/ModalConfirmarEliminacion/ModalConfirmarEliminacion";
import { PencilLine, Eraser, Ruler, Search } from "lucide-react";

export default function TipoPrenda() {
    const { data: datosDeTipoPrenda = [],
      isLoading, isError, error
    } = useTipoPrenda(); 

    const [tipoPrendaAEditar, setTipoPrendaAEditar] = useState(null);
    const [tipoPrendaAEliminar, setTipoPrendaAEliminar] = useState(null);

    const listarTipoPrenda = [...datosDeTipoPrenda].sort((a, b) => {
          const fechaA = a.fecha_actualizacion?.toMillis?.() || 0;
          const fechaB = b.fecha_actualizacion?.toMillis?.() || 0;
          return fechaB - fechaA;
    });

    const [buscador, setBuscador] = useState("");
    const buscadorDeTipoPrenda = listarTipoPrenda.filter((tipo_prenda) =>
      tipo_prenda.tipo?.toLowerCase().includes(buscador.toLowerCase()))

    const [estadoDelModalEditar, setEstadoDelModalEditar] = useState(false);
    const [estadoDelModalEliminar, setEstadoDelModalEliminar] = useState(false);

    const abrirModalParaCrear = () => {
        setTipoPrendaAEditar(null); setEstadoDelModalEditar(true); 
    };
    const abrirModalParaEditar = (datoTipoPrendaEspecifico) => {
        setTipoPrendaAEditar(datoTipoPrendaEspecifico); setEstadoDelModalEditar(true); 
    };
    const cerrarModal = () => {
        setTipoPrendaAEditar(null); setEstadoDelModalEditar(false); 
    };


    const abrirModalParaEliminar = (datoTipoPrendaEspecifico) => {
        setTipoPrendaAEliminar(datoTipoPrendaEspecifico); setEstadoDelModalEliminar(true);
    };
    const cerrarModalEliminar = () => {
        setTipoPrendaAEliminar(null); setEstadoDelModalEliminar(false);
    };

    const eliminarTipoPrenda = async (tipo_prenda) => {
      if (!tipo_prenda?.id) { 
        console.error("No ser pudo encontrar el colegio. Recarga la página.");
        throw new Error("El colegio no tiene identificador valido.");
      }
      try {await deleteDoc(doc(db, "tipo_prenda", tipo_prenda.id));
      }catch (error) {
        console.error("Error al eliminar el colegio:", error);
        throw error;
      }
    };

    if (isLoading) { return <p>Cargando Tipos de Prendas...</p>}
    if (isError) { return <p>Error: {error.message}. Error al Cargar los Tipos de Prendas, recargue la página.</p>}

    return (
      <main className="adminColegios">
        <header className="adminColegiosHeader">
          <h1 className="adminColegiosTitle">
            Tipos de Prenda / Producto
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
              placeholder="Buscar tipo de prenda o producto..."
              value={buscador}
              onChange={(e) => setBuscador(e.target.value)}
              aria-label="Buscar tipo de prenda o producto"
            />
          </div>
        </header>
        <section className="colegiosGrid">
          {buscadorDeTipoPrenda.map((datoTipoPrendaEspecifico) => (

            <article
              key={datoTipoPrendaEspecifico.id}
              className="colegioCard"
            >
              <div className="colegioCardContent">
                <h2 className="colegioNombre">
                  {datoTipoPrendaEspecifico.tipo}
                </h2>
                <h2 className="medidasAsignadasTitle">
                  Atributos:
                </h2>
                <div className="medidasAsignadas">
                  {Object.entries(datoTipoPrendaEspecifico.medidas_asig || {}).map(([medida]) => (
                    <span className="atributosTipoPrenda" key={medida}>
                    {medida}
                    </span>
                  ))}
                </div>
              </div>

              <div className="colegioActions">
                <button
                  type="button"
                  className="colegioAction colegioActionEdit"
                  aria-label={`Editar ${datoTipoPrendaEspecifico.tipo}`}
                  onClick={() => abrirModalParaEditar(datoTipoPrendaEspecifico)}
                >
                  <PencilLine size={17} strokeWidth={2} />
                  <span>
                    Editar
                  </span>
                </button>
                <button
                  type="button"
                  className="colegioAction colegioActionDelete"
                  aria-label={`Eliminar ${datoTipoPrendaEspecifico.tipo}`}
                  onClick= {() => abrirModalParaEliminar(datoTipoPrendaEspecifico)}
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
              ¿Necesitas agregar un tipo de prenda o producto?
            </p>
            <button
              type="button"
              className="agregarColegioButton"
              aria-label="Agregar colegio"
              onClick={abrirModalParaCrear}
            >
              <Ruler size={21} strokeWidth={2}/>
            </button>
        </section>
          {estadoDelModalEditar && (
          <ModalAgregarEditarTipoPrenda
            datoTipoPrendaEditar = {tipoPrendaAEditar}
            modalAbierto = {estadoDelModalEditar}
            onCerrarModal = {cerrarModal}
              /> )}

          {estadoDelModalEliminar && (
          <ModalConfirmarEliminacion
            tipo = "tipoPrenda"
            dato = {tipoPrendaAEliminar}
            modalAbierto= {estadoDelModalEliminar}
            onCerrarModal= {cerrarModalEliminar}
            onConfirmarEliminacion= {eliminarTipoPrenda}
          /> )}
      </main>
    );
}