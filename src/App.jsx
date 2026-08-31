import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./features/Home/Home/Home";
import Productos from "./features/Productos/Productos/Productos";
import Cuentas from "./features/Cuentas/Cuentas/Cuentas";
import Colegios from "./features/Colegios/Colegios/Colegios";
import TipoPrenda from "./features/TiposProducto/TipoPrenda/TipoPrenda";
import Tallas from "./features/Tallas/Tallas/Tallas";

/*import AgregarProducto from "./agregar/AgregarProducto/AgregarProducto";
import AgregarPedido from "./agregar/AgregarPedido/AgregarPedido";*/

import BottomNav from "./components/navigation/BottomNav/BottomNav";

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

        
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}
export default App;