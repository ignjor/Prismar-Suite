import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./BottomNav.css";

import { Home, ShoppingBag, Package, PiggyBank, Plus, School, BanknoteArrowDown, Shirt } from "lucide-react";

const rutasDeNavegacion = [
    {name: "Inicio", path: "/", icon: Home},
    {name: "Pedidos", path: "/pedidos", icon: ShoppingBag},
    {name: "Productos", path: "/productos", icon: Package},
    {name: "Cuentas", path: "/cuentas", icon: PiggyBank},
];
const rutasDeNavegacionBotonPlus = [
    {name: "Agregar Pedido", path: "/agregar-pedido", icon: ShoppingBag},
    {name: "Agregar Producto", path: "/agregar-producto", icon: Package},
    {name: "Agregar Gasto", path: "/agregar-gasto", icon: BanknoteArrowDown},
    {name: "Empresas", path: "/admin-colegios", icon: School},
    {name: "Tipos de Prenda", path: "/tipo-prenda", icon: Shirt},
];


export default function BottomNav() {
    const [estadoBotonPlus, setEstadoBotonPlus] = useState(false);
    const RefAreaBotonPlus = useRef(null);
    const cambiarEstadoBotonPlus = () => setEstadoBotonPlus(estado => !estado);

    
    useEffect(() => {
        if (!estadoBotonPlus) return;
        
        const clickFueraBotonPlus = (event) => { 
            if (RefAreaBotonPlus.current && !RefAreaBotonPlus.current.contains(event.target)){
                setEstadoBotonPlus(false);
            }
        };
        document.addEventListener("mousedown", clickFueraBotonPlus);

        return () => {document.removeEventListener("mousedown", clickFueraBotonPlus)};
    }, [estadoBotonPlus]);


    return (
        <div className="bottomContainer"> 
            <nav className="bottomNav">
                {rutasDeNavegacion.map((ruta) => {
                    const Icon = ruta.icon;
                    return (
                        <NavLink
                        key = { ruta.path } 
                        to = {ruta.path}
                        className = {({isActive}) => 
                            `navItem ${isActive ? "active" : ""}`
                        } 
                        >
                            <Icon size = {23}/>
                            <span> {ruta.name} </span>
                        </NavLink>
                    );
                })}
            </nav>
            
            <div ref = {RefAreaBotonPlus} className="addContainer">    
                <div 
                    className="addMenu"
                    style={{
                        opacity: estadoBotonPlus ? 1 : 0,
                        transform: estadoBotonPlus ? "translateY(0) scale(1)" : "translateY(10px) scale(0.95)",
                        pointerEvents: estadoBotonPlus ? "auto" : "none"
                    }}
                >
                    {rutasDeNavegacionBotonPlus.map((opcion) => {
                        const Icon = opcion.icon;
                        return (
                            <NavLink
                                key = {opcion.path}
                                to = {opcion.path}
                                onClick = {() => setEstadoBotonPlus(false)}
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
                    onClick = {cambiarEstadoBotonPlus}
                    className="addButton"
                    aria-label = "Agregar"
                    aria-expanded = {estadoBotonPlus}
                >
                    <Plus
                        size = {24}
                        strokeWidth = {2.3}
                        style = {{
                            transform: estadoBotonPlus ? "rotate(45deg)" : "rotate(0deg)",
                            transition: "transform .2s ease"
                        }}
                    /> 
                </button>  
            </div>
        </div>
    );
}