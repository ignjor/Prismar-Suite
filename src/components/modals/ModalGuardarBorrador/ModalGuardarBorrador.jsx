import "./ModalGuardarBorrador.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { X, NotebookPen, ArrowLeft, Package, Save, ShoppingBag, Trash2, TriangleAlert } from "lucide-react";

const body = document.body;
const configuracion = {
  producto: { titulo: "Guardar Borrador", etiqueta: "Producto", icono: Package,
  },
  pedido: { titulo: "Guardar Borrador", etiqueta: "Pedido", icono: ShoppingBag,
  },
};

export default function ModalGuardarBorrador({tipo, dato, modalAbierto, onCerrarModal, onConfirmarGuardarBorrador}) {
    const navigate = useNavigate();
    const RefAreaDelModal = useRef(null);
    
    const [pasoConfirmacion, setPasoConfirmacion] = useState(1);
    const [guardarBorrador, setGuardarBorrador] = useState(false);

    const configuracionActual = configuracion[tipo];

    const obtenerNombreDato = (datoActual) => {
      if (!datoActual) { return "Sin nombre" }
      if (tipo === "pedido") { return datoActual || "Sin Cliente" }
      if (tipo === "producto") { return datoActual.nombre || "Sin Nombre" }
      return "Sin nombre";
    };
    const nombreDato = obtenerNombreDato(dato)
      ? obtenerNombreDato(dato)
      : "";
    const IconoPrincipal = configuracionActual?.icono;

    const continuarGuardandoBorrador = () => {
      if (guardarBorrador) {return;    
      }
      setPasoConfirmacion(2);
    };
    const volverConfirmacion = () => {
      if (guardarBorrador) {return;    
      }
      setPasoConfirmacion(1);
    };

    const confirmarGuardandoBorrador = async () => {
      if (guardarBorrador) {
        return;
      }
      try {
        setGuardarBorrador(true);
        await onConfirmarGuardarBorrador?.(dato);
        onCerrarModal();

      } catch (error) { console.error("Error al guardar el borrador", error);
      } finally {
        setGuardarBorrador(false);
      }
    };

    useEffect(() => {
        if (!modalAbierto) {
            body.style.overflow="";
            setPasoConfirmacion(1);
            setGuardarBorrador(false);
            return;
        }
        body.style.overflow="hidden";
        setPasoConfirmacion(1);
        setGuardarBorrador(false);
        return () => {
            body.style.overflow = "";
        };
    }, [modalAbierto, dato])

    useEffect(() => {
        if (!modalAbierto) {
            body.style.overflow="";
            return;
        }
        const clickFueraDelModal = (event) => {
            if (RefAreaDelModal.current && !RefAreaDelModal.current.contains(event.target)){
                onCerrarModal();
            }
        };
        document.addEventListener("mousedown", clickFueraDelModal);
        return () => {document.removeEventListener("mousedown", clickFueraDelModal);
        };
    }, [modalAbierto, guardarBorrador, onCerrarModal]);

    if (!modalAbierto || !configuracionActual || !dato) {
      return null;
    }

    if (!modalAbierto) {
        body.style.overflow="";
        return null;
    }
    return (
      <div className="modalEliminacionOverlay">
        <div
          className="modalEliminacion"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalEliminacionTitle"
          ref={RefAreaDelModal}
        >
          <header className="modalEliminacionHeader">
            <div className="modalEliminacionHeading">
              <h2
                id="modalEliminacionTitle"
                className="modalEliminacionTitle"
              >
                {configuracionActual.titulo}
              </h2>
            </div>

            <button
              type="button"
              className="modalEliminacionClose"
              onClick={onCerrarModal}
              aria-label="Cerrar"
              disabled={guardarBorrador}
            >
              <X
                size={17}
                strokeWidth={2}
              />
            </button>
          </header>
          <div className="modalEliminacionContent">
            {pasoConfirmacion === 1 ? (

              <>
                <div className="modalEliminacionWarningIcon">
                  <NotebookPen
                    size={25}
                    strokeWidth={1.8}
                  />
                </div>

                <h3 className="modalEliminacionQuestion">
                  Antes de ir a otra ventana ¿quieres guardar este/a {" "}
                  {configuracionActual.etiqueta} como borrador?
                </h3>
                <div className="modalEliminacionDato">
                  <IconoPrincipal
                  size={18}
                  strokeWidth={2}
                />
                  <span>
                    {tipo === "pedido" && <strong>Cliente: </strong>}
                    {nombreDato}
                  </span>
                </div>

              </>

            ) : (

              <>
                <div className="modalEliminacionDangerIcon">
                  <TriangleAlert
                    size={25}
                    strokeWidth={1.9}
                  />
                </div>

                <h3 className="modalEliminacionQuestion">
                  ¿Seguro quieres salir sin guardar como Borrador?
                </h3>
                <div className="modalEliminacionDato modalEliminacionDatoDanger">
                  <IconoPrincipal
                  size={18}
                  strokeWidth={2}
                />
                  <span>
                    {tipo === "pedido" && <strong>Cliente: </strong>}
                    {nombreDato}
                  </span>
                </div>

                <div className="modalEliminacionDangerMessage">
                  <strong>
                    Perderas todos los datos del {tipo} y no los podras recuperar
                  </strong>

                </div>
              </>
            )}
          </div>

          <footer className="modalEliminacionActions">
            {pasoConfirmacion === 1 ? (
              <>
                <button
                  type="button"
                  className="modalEliminacionButton modalEliminacionButtonCancel"
                  onClick={continuarGuardandoBorrador}
                  disabled={guardarBorrador}
                >
                  <Trash2
                    size={17}
                    strokeWidth={2}
                  />
                  <span>
                    Salir sin Guardar
                  </span>
                </button>
                <button
                  type="button"
                  className="modalEliminacionButton modalEliminacionButtonContinue"
                  onClick={confirmarGuardandoBorrador}
                  disabled={guardarBorrador}
                >
                    {guardarBorrador
                      ? "Guardando..."
                      : "Guardar Borrador"
                    }
                  <Save
                    size={17}
                    strokeWidth={2}
                  />
                </button>
              </>

            ) : (

              <>
                <button
                  type="button"
                  className="modalEliminacionButton modalEliminacionButtonCancel"
                  onClick={volverConfirmacion}
                  disabled={guardarBorrador}
                >
                  <ArrowLeft
                    size={17}
                    strokeWidth={2}
                  />
                  <span>
                    Volver
                  </span>
                </button>

                <button
                  type="button"
                  className="modalEliminacionButton modalEliminacionButtonDelete"
                  onClick={() => navigate(-1)}
                  disabled={guardarBorrador}
                >
                  <Trash2
                    size={17}
                    strokeWidth={2}
                  />
                  <span>
                      Salir sin Guardar
                  </span>
                </button>
              </>
            )}
          </footer>
        </div>
      </div>
    );
}