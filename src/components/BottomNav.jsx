// src/components/BottomNav.jsx

import { NavLink } from "react-router-dom";
import { Home, ShoppingBag, Package, UserRound } from "lucide-react";

export default function BottomNav() {

  const items = [
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
      name: "Productos",
      path: "/productos",
      icon: Package
    },
    {
      name: "Cuentas",
      path: "/cuentas",
      icon: UserRound
    }
  ];


  return (
    <nav style={styles.bottomNav}>

      {items.map((item) => {

        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={({isActive}) => ({
              ...styles.navItem,
              ...(isActive ? styles.active : {})
            })}
          >

            <Icon size={23}/>

            <span>{item.name}</span>

          </NavLink>
        );

      })}

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