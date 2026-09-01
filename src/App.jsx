import { BrowserRouter, Routes, Route } from "react-router-dom";

import BottomNav from "./components/navigation/BottomNav/BottomNav";

import Home from "./features/Home/componets/Home/Home";

import Productos from "./features/Productos/componets/Productos/Productos";
import VerProducto from "./features/Productos/componets/VerProducto/VerProducto";
/*import AgregarProducto from "./agregar/AgregarProducto/AgregarProducto"; */

import Colegios from "./features/Colegios/components/Colegios/Colegios";
import TipoPrenda from "./features/TiposProducto/componets/TipoPrenda/TipoPrenda";
import Tallas from "./features/Tallas/componets/Tallas/Tallas";

/*import Cuentas from "./features/Cuentas/componets/Cuentas/Cuentas";
import AgregarPedido from "./agregar/AgregarPedido/AgregarPedido";*/

function App() {
  return (
    <BrowserRouter>
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

        
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}
export default App;