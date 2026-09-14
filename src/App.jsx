import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./ScrollTop";
import BottomNav from "./components/navigation/BottomNav/BottomNav";

import Home from "./features/Home/componets/Home/Home";

import Productos from "./features/Productos/componets/Productos/Productos";
import VerProducto from "./features/Productos/componets/VerProducto/VerProducto";
import AgregarProducto from "./features/Productos/componets/AgregarProducto/AgregarProducto";
import EditarProducto from "./features/Productos/componets/EditarProducto/EditarProducto";

import Colegios from "./features/Colegios/components/Colegios/Colegios";
import TipoPrenda from "./features/TiposProducto/componets/TipoPrenda/TipoPrenda";
import Tallas from "./features/Tallas/componets/Tallas/Tallas";

import Pedidos from "./features/Pedidos/componets/Pedidos/Pedidos";
import AgregarPedido from "./features/Pedidos/componets/AgregarPedido/AgregarPedido";
import VerPedido from "./features/Pedidos/componets/VerPedido/VerPedido";

function AppContent() {
  const location = useLocation();
  const rutasSinBottomNav = ["/agregar-producto", "/agregar-pedido"];
  const ocultarNav = rutasSinBottomNav.includes(location.pathname) || location.pathname.startsWith("/editar-producto/");

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={<Home />}
        />


        <Route 
          path="/colegios" 
          element={<Colegios />} 
        />
        <Route 
          path="/tipo-prenda"
          element={<TipoPrenda/>}
        />
        <Route 
          path="/tallas" 
          element={<Tallas />} 
        />


        <Route 
          path="/productos" 
          element={<Productos />} 
        />
        <Route 
          path="/agregar-producto" 
          element={<AgregarProducto />} 
        />
        <Route 
          path="/producto/:id" 
          element={<VerProducto />} 
        />
        <Route 
          path="/editar-producto/:id" 
          element={<EditarProducto />} 
        />


        <Route 
          path="/pedidos" 
          element={<Pedidos />} 
        />
        <Route 
          path="/agregar-pedido" 
          element={<AgregarPedido />} 
        />
        <Route 
          path="/pedido/:id" 
          element={<VerPedido />} 
        />
        <Route 
          path="/ver-pedido/:id" 
          element={<VerProducto />} 
        />
        
      </Routes>
      {!ocultarNav && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;