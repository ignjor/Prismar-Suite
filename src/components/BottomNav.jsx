import { NavLink } from "react-router-dom";
import { Home, ShoppingBag, Package, PiggyBank } from "lucide-react";

/* 

Todas las funciones del código tienen que ser comentadas, para su
correcto funcionamiento, aprendizaje y debuggeado en caso de cualquier
error.

*/ 

export default function BottomNav() {

    /* Definimos las variables de las direcciones de la barra
    de navegación, con sus nombres para reconocerlas, les asignamos
    direcciones a cada una, Las direcciones path estan dentro de App.jsx por si
    en el futuro se agregan mas páginas. */
    const direcciones = [

        {
            name: "Home",
            path: "/",
            icon: Home
        },
        {
            name: "Pedidos",
            path: "/pedidos",
            icon: ShoppingBag
        },
        {
            name: "Prodcutos",
            path: "/productos",
            icon: Package
        },
        {
            name: "Cuentas",
            path: "/cuentas",
            icon: PiggyBank
        }

    ];

    return (

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

    );
}


const styles = {

    bottomNav: {

        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",

        width: "min(90%, 430px)",

        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",

        padding: "12px 16px",

        background: "rgba(255,255,255,0.55)",

        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",

        borderRadius: "28px",

        border: "1px solid rgba(255,255,255,0.35)",

        boxShadow: "0 10px 30px rgba(0,0,0,.12)",

        zIndex: 1000
    },


    navItem: {

        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        gap: "4px",

        textDecoration: "none",

        color: "#777",

        fontSize: "11px",

        transition: "all .25s ease"

    },


    active: {

        color: "#000",

        transform: "translateY(-3px)"

    }

};