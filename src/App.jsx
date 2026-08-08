import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Pedidos from "./pages/Pedidos";
import Productos from "./pages/Productos";
import Cuentas from "./pages/Cuentas";

import AgregarProducto from "./pages/AgregarProducto";
import AgregarPedido from "./pages/AgregarPedido";

import BottomNav from "./components/BottomNav";


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

      </Routes>

      <BottomNav />

    </BrowserRouter>
  );
}


export default App;