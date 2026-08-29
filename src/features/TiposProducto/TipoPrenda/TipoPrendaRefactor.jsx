import "./TipoPrenda.css";
import {db} from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import ModalAgregarTipoProducto from "../ModalAgregarTipoProducto/ModalAgregarTipoProducto";
import {PencilLine, Eraser, Ruler} from "lucide-react";

export default function TipoPrenda() {
    const [datosDeTipoPrenda, setDatosDeTipoPrenda] = useState([]);
    const [tipoPrendaAEditar, setTipoPrendaAEditar] = useState(null);

    useEffect (() => {
        obtenerDatosDeTipoPrenda();
    }, []);
    const obtenerDatosDeTipoPrenda = async () => {
        try {
            const listaDatosDeTipoPrenda = (await getDocs
                (collection(db, "tipo_prenda"))).docs.map((documento) => ({
                id: documento.id, ...documento.data(),
            }));
            setDatosDeTipoPrenda(listaDatosDeTipoPrenda);
        } catch (error) {console.error("Error al obtener los tipos de prenda:", error);
        }};


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

    return (
      <main className="adminColegios">
        <header className="adminColegiosHeader">
          <h1 className="adminColegiosTitle">
            Tipos de Prenda / Producto
          </h1>
        </header>
        <section className="colegiosGrid">
          {datosDeTipoPrenda.map((datoTipoPrendaEspecifico) => (

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
                <h2 className="medidasAsignadas">
                  {Object.entries(datoTipoPrendaEspecifico.medidas_asig || {}).map(([medida]) => (
                    <p key={medida}>
                    - {medida}
                    </p>
                  ))}
                </h2>
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

          <ModalAgregarTipoProducto
            datoTipoPrendaEditar = {tipoPrendaAEditar}
            modalAbierto = {estadoDelModal}
            onCerrarModal = {cerrarModal}
            onRecargarTipoPrenda={obtenerDatosDeTipoPrenda}
              />
      </main>
    );
  }
















