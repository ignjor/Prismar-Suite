/*  

Aqui queremos agregar toda la estructura para los tipos de prenda, tipo de prenda funciona como un string en tipo
por ej pantalon, y pantalon tiene unas medidas_asig como un map, que puede ser cintura largo, etc, segun lo requeriera,
y cada tipo de prenda va asignado a un producto, por ej tipo de prenda pantalon, vestido, o amigurumi tambien.

Reciclamos gran parte de la estructura de AdminColegios porque es basicamente lo mismo, pero leyendo los maps de
medidas asignadas, para optimizar el tiempo de desarrollo y obvio para mantener la linea visual, por eso las clases del .css son
practicamente identicas
*/

import "./TipoPrenda.css";
import ModalAgregarTipoProducto from "../ModalAgregarTipoProducto/ModalAgregarTipoProducto";

/* Importamos firebase de donde lo tenemos y las funciones que usamos obvio */
import {db} from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import {PencilLine, Eraser, Ruler} from "lucide-react";


export default function TipoPrenda() {

  const [tipoPrenda, setTipoPrenda] = useState([]);
  const [editarTipoPrenda, setEditarTipoPrenda] = useState(null);


  /* Vamos a definir los estos del modal para crear el colegio, abierto o cerrado o eso
  Y obvio, lo definimos como que este cerrado predeterminadamente.*/
  const [modalAbierto, setModalAbierto] = useState(false);
  const abrirModal = () => {
    setEditarTipoPrenda(null);
    setModalAbierto(true);
  };
  const abrirModalEdit = (tipoPrenda) => {
    setEditarTipoPrenda(tipoPrenda);
    setModalAbierto(true);
  };
  const cerrarModal = () => {
    setModalAbierto(false);
    setEditarTipoPrenda(null);
  };

  useEffect(() => {
    obtenerTipoPrenda();
  }, []);

  const obtenerTipoPrenda = async() => {
    try {
      /* Cremoas la Ref dentro de la colleccion de la base de datos
      para luego no tenerque llamarla de nuevo tan complicada, y asi la funcion de arriba
      cuando llamamos obtener colegios sabe donde tiene que buscar, en esta colleccion donde tenemos
      colegios */
      const tipoPrendaRef = collection(db, "tipo_prenda")
      const respuesta = await getDocs(tipoPrendaRef)
      const listaTipoPrenda = respuesta.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      /* AAqui luego de listar la collecion guardamos todo dentro del setColegios
       */
      setTipoPrenda(listaTipoPrenda);
    } catch (error) {
      console.error("Error", error);
    }
  };

    return (

      <main className="adminColegios">

        {/* Encabezado de la página */}
        <header className="adminColegiosHeader">

          <h1 className="adminColegiosTitle">
            Tipos de Prenda / Producto
          </h1>

        </header>


        {/* 
          Contenedor de todas las tarjetas.

          El CSS se encarga de mostrar:
          - máximo 3 columnas en escritorio.
          - 2 columnas en móvil.
        */}
        <section className="colegiosGrid">

          {tipoPrenda.map((tipoPrenda) => (

            <article
              key={tipoPrenda.id}
              className="colegioCard"
            >

              {/* Parte superior de la tarjeta */}
              <div className="colegioCardContent">

                <h2 className="colegioNombre">
                  {tipoPrenda.tipo}
                </h2>

                
                <h2 className="medidasAsignadasTitle">
                  Atributos:
                </h2>
                

                <h2 className="medidasAsignadas">
                  {Object.entries(tipoPrenda.medidas_asig || {}).map(([nombre]) => (
                    <p key={nombre}>
                    - {nombre}
                    </p>
                  ))}
                </h2>

              </div>


              {/* Botones de acciones */}
              <div className="colegioActions">

                {/* 
                  Botón de editar.

                  Por ahora no tiene onClick porque la función
                  será agregada posteriormente.
                */}
                <button
                  type="button"
                  className="colegioAction colegioActionEdit"
                  aria-label={`Editar ${tipoPrenda.tipo}`}
                  onClick={() => abrirModalEdit(tipoPrenda)}
                >

                  <PencilLine size={17} strokeWidth={2} />

                  <span>
                    Editar
                  </span>

                </button>


                {/* 
                  Botón de eliminar.

                  Por ahora no tiene onClick porque la función
                  será agregada posteriormente.
                */}
                <button
                  type="button"
                  className="colegioAction colegioActionDelete"
                  aria-label={`Eliminar ${tipoPrenda.tipo}`}
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


            {/* 
              Botón para agregar un colegio.

              Por ahora solamente dejamos preparada
              la interfaz. La función se agregará después.
            */}
            <button
              type="button"
              className="agregarColegioButton"
              aria-label="Agregar colegio"
              onClick={abrirModal}
            >

              <Ruler size={21} strokeWidth={2}/>

            </button>

        </section>
          <ModalAgregarTipoProducto
            abierto = {modalAbierto}
            onCerrar = {cerrarModal}
            tipoPrenda = {editarTipoPrenda}
            onTipoPrendaAgregado={obtenerTipoPrenda}
              />

      </main>
    );
  }
















