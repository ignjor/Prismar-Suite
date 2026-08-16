import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Pedidos from "./pages/Pedidos/Pedidos";
import Productos from "./pages/Productos/Productos";
import Cuentas from "./pages/Cuentas/Cuentas";

import AgregarProducto from "./agregar/AgregarProducto/AgregarProducto";
import AgregarPedido from "./agregar/AgregarPedido/AgregarPedido";
import Colegios from "./agregar/AdminColegios/AdminColegios";

import BottomNav from "./components/BottomNav/BottomNav";


function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route 
          path="/" 
          element={<Home />} 
        />

        <Route 
          path="/pedidos" 
          element={<Pedidos />} 
        />

        <Route 
          path="/productos" 
          element={<Productos />} 
        />

        <Route 
          path="/cuentas" 
          element={<Cuentas />} 
        />

        <Route 
          path="/agregar-producto" 
          element={<AgregarProducto />} 
        />

        <Route 
          path="/agregar-pedido" 
          element={<AgregarPedido />} 
        />

        <Route 
          path="/admin-colegios" 
          element={<Colegios />} 
        />

      </Routes>

      <BottomNav />

    </BrowserRouter>
  );
}


export default App;