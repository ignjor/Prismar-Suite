/* Importamos el archivo que se conecta con la base de datos de Firestore */ 
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { AlignCenter, AlignJustify, ListCheck } from "lucide-react";

import { useEffect, useState } from "react";

export default function Colegios() {


  /* Con State generamos las variables para almacenar los productos */
  const [colegios, setColegios] = useState([]);

  /* Con esta función, con el Effect solocitamos los datos a Firestore, luego vamos a definir exactamente la funcion obtenerProductos */
  useEffect(() => {
    obtenerColegios();
  }, []);

    /* Definimos la funcion como asyncrona, es decir que el sistema sigue trabajando a menos que coloquemos un await */
  const obtenerColegios = async () => {
    try {
      const colegiosRef = collection(db, "colegios");

      /* Con este await quiere decir que el sistema para hasta que se complete la operación */
      const respuesta = await getDocs(colegiosRef);

      /* Con este map, mapeamos los documentos de la colección de la DB */
      const listaColegios = respuesta.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));


      setColegios(listaColegios);

    } catch (error) {
      console.error("Error al obtener los Colegios:", error);
    }
  };


  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Colegios</h1>

      {/* Ya con todas las funciones hechas, presentamos los archivos obtenidos en la busqueda en Firestore */}

        {
          colegios.map((colegio) => (

            <div key={colegio.id} style={styles.producto}>

              <h2 style={styles.productoNombre}>{colegio.nombre}</h2>


            </div>
          ))}
           </div>
  );
}


const styles = {

  container: {

    width: "min(92%, 500px)",

    margin: "0 auto",

    padding: "40px 0 120px 0",

    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif",

    color: "#1d1d1f"

  },


  title: {

    fontSize: "34px",

    fontWeight: "700",

    letterSpacing: "-1px",

    marginBottom: "28px",

  },


  producto: {

    background: "#f5f5f7",

    borderRadius: "50px",

    padding: "30px",

    marginBottom: "16px",

    boxShadow: "0 15px 15px rgba(0, 0, 0, 0.06)"

  },


  productoNombre: {

    fontSize: "21px",

    fontWeight: "600",

    marginTop: "0",

    marginBottom: "16px",

    letterSpacing: "-0.3px"

  },


  texto: {

    margin: "8px 0",

    fontSize: "15px",

    color: "#6e6e73",

    lineHeight: "1.5"

  },

};
