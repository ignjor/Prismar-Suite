import { useParams } from "react-router-dom";

export default function VerProducto() {
  const { id } = useParams();

  return (
    <main>
      <h1>Ver Producto</h1>

      <p>ID del producto: {id}</p>
    </main>
  );
}
