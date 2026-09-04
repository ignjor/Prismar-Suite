import "./TipoPrenda.css";
import { useTipoPrenda } from "../../querys/useTipoPrenda";
import { useState } from "react";

import ModalAgregarEditarTipoPrenda from "../ModalAgregarEditarTipoPrenda/ModalAgregarEditarTipoPrenda";
import { PencilLine, Eraser, Ruler, Search } from "lucide-react";


export default function TipoPrenda() {
    const { data: datosDeTipoPrenda = [],
      isLoading, isError, error
    } = useTipoPrenda(); 

    const [tipoPrendaAEditar, setTipoPrendaAEditar] = useState(null);

    const [buscador, setBuscador] = useState("");
    const buscadorDeTipoPrenda = datosDeTipoPrenda.filter((tipo_prenda) =>
      tipo_prenda.tipo?.toLowerCase().includes(buscador.toLowerCase()))

    const [estadoDelModal, setEstadoDelModal] = useState(false);

    const abrirModalParaCrear = () => {
        setTipoPrendaAEditar(null); setEstadoDelModal(true); 
    };
    const abrirModalParaEditar = (datoTipoPrendaEspecifico) => {
        setTipoPrendaAEditar(datoTipoPrendaEspecifico); setEstadoDelModal(true); 
    };
    const cerrarModal = () => {
        setTipoPrendaAEditar(null); setEstadoDelModal(false); 
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

          <ModalAgregarEditarTipoPrenda
            datoTipoPrendaEditar = {tipoPrendaAEditar}
            modalAbierto = {estadoDelModal}
            onCerrarModal = {cerrarModal}
              />
      </main>
    );
  }
















