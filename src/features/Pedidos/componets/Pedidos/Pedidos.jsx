import "./Pedidos.css";
import { usePedidos } from "../../querys/usePedidos";

import { useMemo, useState } from "react";

import { Search, Eye} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Pedidos() {
    const navigate = useNavigate();
    const [buscador, setBuscador] = useState("");

    const { data: datosDePedidos = [],
      isLoading, isError, error} = usePedidos();


    const listarPedidos = useMemo(() => {
      return [...datosDePedidos]
        .sort((a, b) => {
          const fechaA = a.fecha_entrega?.toMillis?.() || 0;
          const fechaB = b.fecha_entrega?.toMillis?.() || 0;
          return fechaB - fechaA;
        })
    });

    const buscadorDePedidos = listarPedidos.filter(
      (pedido) =>
        pedido.cliente
          ?.toLowerCase()
          .includes(buscador.toLowerCase())
    );

    if (isLoading) { return <p>Cargando los Pedidos...</p>}
    if (isError) { return <p>Error: {error.message}. Error al Cargar los Pedidos, recargue la página.</p>}

    return(
      <main className="adminColegios">
        <header className="adminColegiosHeader">
          <h1 className="adminColegiosTitle">
            Pedidos
          </h1>
          
          <div className="colegiosBuscador">
            <Search
              className="colegiosBuscadorIcon"
              size={18}
              strokeWidth={2}
            />
            <input
              type="text"
              className="colegiosBuscadorInput"
              placeholder="Buscar un pedido con nombre del cliente..."
              value={buscador}
              onChange={(e) => setBuscador(e.target.value)}
              aria-label="Buscar Colegio"
            />
          </div>
        </header>
        <section className="colegiosGrid">

          {buscadorDePedidos.map((datoPedidoEspecifico) => (
            <article
              key={datoPedidoEspecifico.id}
              className="colegioCard"
            >
              <div className="colegioCardContent">

                <div className="productoCardHeader">

                <div className="productoCardInfo">

                  <h2 className="colegioNombre">
                    {datoPedidoEspecifico.cliente}
                  </h2>


                  <span className="TipoPrendaAsignadoTitle">
                    {datoPedidoEspecifico.numero_pedido}
                  </span>

                </div>

              </div>


                <h2 className="medidasAsignadasTitle">
                  Total:
                </h2>
                    <span className="atributosTipoPrenda">
                       ${Number(datoPedidoEspecifico.total).toLocaleString("es-CL")}
                     </span>
              </div>
              <div className="colegioActions">
                <button
                  type="button"
                  className="colegioAction colegioActionEye"
                  aria-label={`Editar ${datoPedidoEspecifico.cliente}`}
                  onClick={() => navigate(`/pedido/${datoPedidoEspecifico.id}`)}
                >
                  <Eye size={17} strokeWidth={2} />
                  <span>
                    Abrir
                  </span>
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    );
}