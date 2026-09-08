import { BrowserRouter, Routes, Route, useLoaderData, useLocation } from "react-router-dom";

import BottomNav from "./components/navigation/BottomNav/BottomNav";

import Home from "./features/Home/componets/Home/Home";

import Productos from "./features/Productos/componets/Productos/Productos";
import VerProducto from "./features/Productos/componets/VerProducto/VerProducto";
import AgregarProducto from "./features/Productos/componets/AgregarProducto/AgregarProducto";

import Colegios from "./features/Colegios/components/Colegios/Colegios";
import TipoPrenda from "./features/TiposProducto/componets/TipoPrenda/TipoPrenda";
import Tallas from "./features/Tallas/componets/Tallas/Tallas";

/*import Cuentas from "./features/Cuentas/componets/Cuentas/Cuentas";
import AgregarPedido from "./agregar/AgregarPedido/AgregarPedido";*/

function AppContent() {
  const location = useLocation();
  const rutasSinBottomNav = ["/agregar-producto"]
  const ocultarNav = rutasSinBottomNav.includes(location.pathname);

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
          path="/ver-producto/:id" 
          element={<VerProducto />} 
        />
        <Route 
          path="/agregar-producto" 
          element={<AgregarProducto />} 
        />

        
      </Routes>
      {!ocultarNav && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;