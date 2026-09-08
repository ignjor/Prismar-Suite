import "./VerProducto.css";
import { useProductos } from "../../querys/useProductos";
import { useColegios } from "../../../Colegios/querys/useColegios";
import { useTipoPrenda } from "../../../TiposProducto/querys/useTipoPrenda";
import ModalFotoProducto from "../modals/ModalFotoProducto/ModalFotoProducto";

import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, Shirt } from "lucide-react";

export default function VerProducto() {
  const {id} = useParams();
  const navigate = useNavigate();
  
  const [estadoDelModal, setEstadoDelModal] = useState(false);

  const { data: datosDeProductos = [], isLoading, isError, error} = useProductos();
  const { data: datosDecolegios = []} = useColegios();
  const { data: datosDeTipoPrenda = []} = useTipoPrenda();

  const producto = useMemo(() => {
    return datosDeProductos.find((producto) => producto.id === id);
  }, [datosDeProductos, id]);

  const colegio = useMemo(() => {
    return datosDecolegios.find((colegio) => colegio.id === producto?.colegio_id);
  }, [datosDecolegios, producto]);

  const tipoPrenda = useMemo(() => {
    return datosDeTipoPrenda.find((tipoPrenda) => tipoPrenda.id === producto?.tipo_prenda_id);
  }, [datosDeTipoPrenda, producto]);

  if (isLoading) { return <p>Cargando el Producto...</p>}
  if (isError) { return <p>Error: {error.message}. Error al Cargar el Producto, recargue la página.</p>}

  if (!producto) {
    return <p>Producto no encontrado.</p>;
  }
  const precios = Object.entries(producto.precios_tallas || {})
    .sort(([, a], [, b]) => Number(a) - Number(b));

  return (
    <main className="adminColegios productoDetallePage">
      <button
        type="button"
        className="productoVolver"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={17} strokeWidth={2} />
        Volver a productos
      </button>
      <section className="productoDetalle">
        <div className="productoDetalleImagenWrapper">
          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt={`Imagen de ${producto.nombre}`}
              className="productoDetalleImagen"
            />
          ) : (
            <div className="productoDetalleImagen productoDetalleImagenVacia">
              <span>
                <Shirt size={50} />
              </span>
            </div>
          )}
          <button
            type="button"
            className="productoEditarFoto"
            onClick={() => setEstadoDelModal(true)}
          >
            <span>
              Editar foto
            </span>
          </button>
        </div>

        <div className="productoDetalleContenido">
          <h1 className="productoDetalleNombre">
            {producto.nombre}
          </h1>
          <div className="productoDetalleEtiquetas">
            <span className="ColegioAsignadoTitle">
              {colegio?.nombre || "Sin Empresa o Colegio Afiliado"}
            </span>
          </div>
          <div className="productoDetalleSeparador" />

          <div className="productoDetalleSeccion">
            <h2 className="preciosAsignadosTitle">
              PRECIOS POR TALLA
            </h2>
            {precios.length > 0 ? (
              <div className="productoDetallePrecios">
                {precios.map(([talla, precio]) => (
                  <div
                    className="productoDetallePrecio"
                    key={talla}
                  >
                    <span className="productoDetalleTalla">
                      {talla}
                    </span>
                    <span className="productoDetalleValor">
                      ${Number(precio).toLocaleString("es-CL")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="productoDetalleSinDatos">
                No hay precios registrados.
              </p>
            )}
          </div>
          <div className="productoDetalleSeccion">
            <h2 className="medidasAsignadasTitle">
              MEDIDAS {tipoPrenda?.tipo || "Sin tipo de prenda Asignado"}
            </h2>
            {tipoPrenda?.medidas_asig &&
            Object.keys(tipoPrenda.medidas_asig).length > 0 ? (
              <div className="productoDetallePrecios">
                {Object.entries(tipoPrenda.medidas_asig).map(
                  ([medida]) => (
                    <div
                      className="productoDetallePrecio"
                      key={medida}
                    >
                      <span className="productoDetalleValor">
                        {medida}
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="productoDetalleSinDatos">
                No hay medidas asignadas.
              </p>
            )}
          </div>
        </div>
      </section>

      <ModalFotoProducto
        producto={producto}
        modalAbierto={estadoDelModal}
        onCerrarModal={() =>
          setEstadoDelModal(false)
        }
      />
    </main>
  );
}