import { NavLink } from "react-router-dom";
import { Home, ShoppingBag, Package, PiggyBank, Plus, School } from "lucide-react";

import { useState, useEffect, useRef } from "react";

import "./BottomNav.css";

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
            
        <div className="bottomContainer"> 



            <nav className="bottomNav">

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

                        className = {({isActive}) => 
                            `navItem ${isActive ? "active" : ""}`
                        }
                        
                        >

                            <Icon size = {23}/>

                            <span> {direccion.name} </span>
                            
                        </NavLink>
                    );
                })
                    
                }

            </nav>
            
            <div ref = {botonRef} className="addContainer">    
            
                <div 
                    className="addMenu"
                    style={{
                        opacity: mostrarBoton ? 1 : 0,
                        transform: mostrarBoton ? "translateY(0) scale(1)" : "translateY(10px) scale(0.95)",
                        pointerEvents: mostrarBoton ? "auto" : "none"
                    }}
                >

                    {agregar.map((opcion) => {
                        
                        const Icon = opcion.icon;

                        return (
                            <NavLink
                                key = {opcion.path}
                                to = {opcion.path}

                                onClick = {() => setMostrarBoton(false)}
                                className="addOption"
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
                    className="addButton"
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