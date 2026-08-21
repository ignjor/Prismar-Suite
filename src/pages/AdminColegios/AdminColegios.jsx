/*  

Aqui vamos a hacer la estructura completa para poder administrar los colegios
mi idea es luego crear un modal para poder crear los colegios, que ese mismo modal sirva
para editarlos, para los colegios solo necesitamos un nombre, nada más. 

*/

import "./AdminColegios.css";
import ModalAgregarColegio from "../../modals/ModalAgregarColegio/ModalAgregarColegio";

/* Importamos firebase de donde lo tenemos y las funciones que usamos obvio */
import {db} from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import {PencilLine, Eraser, School} from "lucide-react";


export default function AdminColegios() {

  /* Cremoas el estado para colegios, aqui se va a guardar y listar los colegios
  que rescatemos de la base de datos que llamamos de firestore en nuestro caso */
  const [colegios, setColegios] = useState([]);
  const [editarColegio, setEditarColegio] = useState(null);


  /* Vamos a definir los estos del modal para crear el colegio, abierto o cerrado o eso
  Y obvio, lo definimos como que este cerrado predeterminadamente.*/
  const [modalAbierto, setModalAbierto] = useState(false);
  const abrirModal = () => {
    setEditarColegio(null);
    setModalAbierto(true);
  };
  const abrirModalEdit = (colegio) => {
    setEditarColegio(colegio);
    setModalAbierto(true);
  };
  const cerrarModal = () => {
    setModalAbierto(false);
    setEditarColegio(null);
  };



  useEffect(() => {
    obtenerColegios();
  }, []);

  const obtenerColegios = async() => {
    try {
      /* Cremoas la Ref dentro de la colleccion de la base de datos
      para luego no tenerque llamarla de nuevo tan complicada, y asi la funcion de arriba
      cuando llamamos obtener colegios sabe donde tiene que buscar, en esta colleccion donde tenemos
      colegios */
      const colegiosRef = collection(db, "colegios")
      const respuesta = await getDocs(colegiosRef)
      const listaColegios = respuesta.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      /* AAqui luego de listar la collecion guardamos todo dentro del setColegios
       */
      setColegios(listaColegios);
    } catch (error) {
      console.error("Error", error);
    }
  };

    return (

      <main className="adminColegios">

        {/* Encabezado de la página */}
        <header className="adminColegiosHeader">

          <h1 className="adminColegiosTitle">
            Empresas / Colegios
          </h1>

        </header>


        {/* 
          Contenedor de todas las tarjetas.

          El CSS se encarga de mostrar:
          - máximo 3 columnas en escritorio.
          - 2 columnas en móvil.
        */}
        <section className="colegiosGrid">

          {colegios.map((colegio) => (

            <article
              key={colegio.id}
              className="colegioCard"
            >

              {/* Parte superior de la tarjeta */}
              <div className="colegioCardContent">

                <h2 className="colegioNombre">
                  {colegio.nombre}
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
                  aria-label={`Editar ${colegio.nombre}`}
                  onClick={() => abrirModalEdit(colegio)}
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
                  aria-label={`Eliminar ${colegio.nombre}`}
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

              <School size={21} strokeWidth={2}/>

            </button>

        </section>
          <ModalAgregarColegio
            abierto = {modalAbierto}
            onCerrar = {cerrarModal}
            colegio = {editarColegio}
            onColegioAgregado={obtenerColegios}
              />

      </main>
    );
  }
















