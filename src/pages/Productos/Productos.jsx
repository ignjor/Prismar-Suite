/* Importamos el archivo que se conecta con la base de datos de Firestore */ 
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

import { useEffect, useState } from "react";

export default function Productos() {


  /* Con State generamos las variables para almacenar los productos */
  const [productos, setProductos] = useState([]);

  /* Con esta función, con el Effect solocitamos los datos a Firestore, luego vamos a definir exactamente la funcion obtenerProductos */
  useEffect(() => {
    obtenerProductos();
  }, []);

    /* Definimos la funcion como asyncrona, es decir que el sistema sigue trabajando a menos que coloquemos un await */
  const obtenerProductos = async () => {
    try {
      const productosRef = collection(db, "productos");

      /* Con este await quiere decir que el sistema para hasta que se complete la operación */
      const respuesta = await getDocs(productosRef);

      /* Con este map, mapeamos los documentos de la colección de la DB */
      const listaProductos = respuesta.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));


      setProductos(listaProductos);

    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };


  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Productos</h1>

      {/* Ya con todas las funciones hechas, presentamos los archivos obtenidos en la busqueda en Firestore */}

        {
          productos.map((producto) => (

            <div key={producto.id} style={styles.producto}>

              <h2 style={styles.productoNombre}>{producto.nombre}</h2>

              <p style={styles.texto}>Colegio: {producto.colegio}</p>

              <p style={styles.texto}>Precio: {producto.precio}</p>

              <p style={styles.texto}>Talla: {producto.talla}</p>

              <p style={styles.texto}>Stock: {producto.stock}</p>



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

    marginBottom: "28px"

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
