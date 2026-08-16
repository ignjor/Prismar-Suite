import { NavLink } from "react-router-dom";
import { Home, ShoppingBag, Package, PiggyBank, Plus, School } from "lucide-react";

import { useState, useEffect, useRef } from "react";

/* 

Todas las funciones del código tienen que ser comentadas, para su
correcto funcionamiento, aprendizaje y debuggeado en caso de cualquier
error.

*/ 

export default function BottomNav() {


    /* Variable para guardar el estado del boton y saber cuando esta abierto, predeterminado esta cerrado, por eso 
    eso el state en false */
    const [mostrarBoton, setMostrarBoton] = useState(false);
    const botonRef = useRef(null);

    /* Definimos las variables de las direcciones de la barra
    de navegación, con sus nombres para reconocerlas, les asignamos
    direcciones a cada una, Las direcciones path estan dentro de App.jsx por si
    en el futuro se agregan mas páginas. */
    const direcciones = [

        {
            name: "Inicio",
            path: "/",
            icon: Home
        },
        {
            name: "Pedidos",
            path: "/pedidos",
            icon: ShoppingBag
        },
        {
            name: "Productos",
            path: "/productos",
            icon: Package
        },
        {
            name: "Cuentas",
            path: "/cuentas",
            icon: PiggyBank
        },


    ];


    /* Definimos las variables de las direcciones que se van a mostrar en el boton verde. */
    const agregar = [
        {
            name: "Agregar Pedido",
            path: "/agregar-pedido",
            icon: ShoppingBag
        },
        {
            name: "Agregar Producto",
            path: "/agregar-producto",
            icon: Package
        },
        {
            name: "Colegios",
            path: "/admin-colegios",
            icon: School
        }
    ];

    /* Creamos la fucion para cambiar el estado del boton, la vamos a llamar cuando apretemos el boton */
    const cambiarEstadoBoton = () => {
        setMostrarBoton((estadoActual) => !estadoActual);
    };



    /* Funcion para escuchar donde clickea SOLO cuando el menu esta afuera */
    useEffect(() => {
        
        /* Si el menu del boton esta cerrado no tenemos porque estar escuchando el click, se ignora la funcion con este IF */
        if (!mostrarBoton) {
            return;
        }

        const clickFuera = (event) => {
            if (botonRef.current && !botonRef.current.contains(event.target)) {
                setMostrarBoton(false);
            }
        };

        document.addEventListener("mousedown", clickFuera);

        return () => {
            document.removeEventListener("mousedown", clickFuera);
        };
    }, [mostrarBoton]);






    return (
            
        <div style = {styles.bottomContainer}> 



            <nav style = {styles.bottomNav}>

            {/* Mapeamos el bloque de las variables de las direcciones
            para tenerlas todas, creamos la variable temporal de direccion
            para asignar la que esta activa en ese momento */}
            

                {direcciones.map((direccion) => {

                    const Icon = direccion.icon;

                    return (
                        <NavLink
                        key = { direccion.path } 
                        to = {direccion.path}

                        /* Ademas asignamos que la ventan que esta activa en ese momento
                        le asignamos un estilo especial a la barra */

                        style = {({isActive}) => ({
                            ...styles.navItem,
                            ...(isActive ? styles.active : {})
                        })}
                        
                        >

                            <Icon size = {23}/>

                            <span> {direccion.name} </span>
                            
                        </NavLink>
                    );
                })
                    
                }

            </nav>
            
            <div ref = {botonRef} style = {styles.addContainer}>    
            
                <div style = {{ 
                    ... styles.addMenu,
                    opacity: mostrarBoton ? 1 : 0,
                    transform: mostrarBoton ? "translateY(0) scale(1)" : "translateY(10px) scale(0.95)",

                    pointerEvents: mostrarBoton ? "auto" : "none"
                }}>

                    {agregar.map((opcion) => {
                        
                        const Icon = opcion.icon;

                        return (
                            <NavLink
                                key = {opcion.path}
                                to = {opcion.path}

                                onClick = {() => setMostrarBoton(false)}
                                style = {styles.addOption}
                            >

                            <Icon size = {18}/>

                            <span> {opcion.name} </span>
                            </NavLink>
                        )
                    }
                        )
                    
                    }

                </div>

                <button
                    type = "button"
                    onClick = {cambiarEstadoBoton}
                    style = {styles.addButton}
                    aria-label = "Agregar"
                    aria-expanded = {mostrarBoton}
                >
                    <Plus
                        size = {24}
                        strokeWidth = {2.3}
                        style = {{
                            transform: mostrarBoton ? "rotate(45deg)" : "rotate(0deg)",
                            transition: "transform .2s ease"
                        }}
                    /> 

                </button>  
            </div>
        </div>

    );
}

/* Todos los estilos son auspiciados por la IA jsdja */
const styles = {


    /* Contenedor general de la barra y el botón.
    Ambos elementos ahora pertenecen al mismo bloque horizontal,
    por lo que nunca se van a superponer. */
    bottomContainer: {

        position: "fixed",

        bottom: "20px",

        left: "50%",

        transform: "translateX(-50%)",

        width: "min(92%, 390px)",

        display: "flex",

        alignItems: "center",

        gap: "8px",

        zIndex: 1000

    },


    /* Barra de navegación.
    La hacemos un poco más pequeña para dejar espacio al botón
    verde sin romper el diseño en pantallas pequeñas. */
    bottomNav: {

        flex: "1 1 auto",

        minWidth: 0,

        display: "flex",

        justifyContent: "space-around",

        alignItems: "center",

        padding: "10px 10px",

        background: "rgba(255,255,255,0.55)",

        backdropFilter: "blur(20px)",

        WebkitBackdropFilter:
            "blur(20px)",

        borderRadius: "24px",

        border:
            "1px solid rgba(255,255,255,0.35)",

        boxShadow:
            "0 8px 24px rgba(0,0,0,.10)"

    },


    /* Cada elemento individual de la navegación. */
    navItem: {

        display: "flex",

        flexDirection: "column",

        alignItems: "center",

        gap: "3px",

        textDecoration: "none",

        color: "#777",

        fontSize: "10px",

        minWidth: 0,

        transition: "all .25s ease"

    },


    /* Estilo de la opción que está activa. */
    active: {

        color: "#000",

        transform:
            "translateY(-2px)"

    },


    /* Contenedor del botón +.
    Tiene posición relativa para que el menú pueda aparecer
    justo encima de él. */
    addContainer: {

        position: "relative",

        flexShrink: 0,

        width: "48px",

        height: "48px",

        display: "flex",

        alignItems: "center",

        justifyContent: "center"

    },


    /* Pequeño menú que aparece encima del botón.
    El estilo es intencionalmente sencillo y limpio. */
    addMenu: {

        position: "absolute",

        bottom: "65px",

        right: "0",

        display: "flex",

        flexDirection: "column",

        gap: "5px",

        padding: "7px",

        minWidth: "175px",

        background: "rgba(255,255,255,0.82)",

        backdropFilter: "blur(18px)",

        WebkitBackdropFilter:
            "blur(18px)",

        borderRadius: "15px",

        border:
            "1px solid rgba(255,255,255,0.5)",

        boxShadow:
            "0 10px 25px rgba(0,0,0,.12)",

        transformOrigin: "bottom right",

        transition:
            "opacity .22s ease, transform .28s ease"

    },


    /* Cada una de las dos opciones del menú. */
    addOption: {

        display: "flex",

        alignItems: "center",

        gap: "9px",

        padding: "9px 11px",

        color: "#333",

        textDecoration: "none",

        fontSize: "12px",

        borderRadius: "10px",

        transition:
            "background .2s ease"

    },


    /* Botón verde de agregar. */
    addButton: {

        width: "48px",

        height: "48px",

        padding: 0,

        border: "none",

        borderRadius: "50%",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        background: "#22b84b",

        color: "#fff",

        cursor: "pointer",

        boxShadow:
            "0 7px 18px rgba(34,184,75,.28)",

        transition:
            "transform .2s ease, background .2s ease"

    }

};