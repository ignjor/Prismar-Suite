import "./ModalConfirmar.css";
import { useEffect, useRef, useState } from "react";
import { X, CircleX, ArrowLeft, ArrowRight, Package, Truck } from "lucide-react";

const body = document.body;
const configuracion = {
  producto: { titulo: "Actualizar estado del producto", etiqueta: "Producto", icono: Package,
  },
  pedidoEntrega: { titulo: "Actualizar estado de la entrega", etiqueta: "Entrega del Pedido", icono: Truck,
  },


};
export default function ModalConfirmar({tipo, dato, modalAbierto, onCerrarModal, onConfirmar}) {
    const RefAreaDelModal = useRef(null);
    const [error, setError] = useState("");
    
    const [pasoConfirmacion, setPasoConfirmacion] = useState(1);
    const [eliminando, setEliminando] = useState(false);
    const configuracionActual = configuracion[tipo];

    const obtenerNombreDato = (datoActual) => {
      if (!datoActual) { return "Sin estado" }
      if (tipo === "producto") { return datoActual.estado_producto || "Sin estado" }
      if (tipo === "pedidoEntrega") { return datoActual.estado_pedido || "Sin estado" }
      return "Sin estado";
    };

    const nombreDato = obtenerNombreDato(dato)
      ? obtenerNombreDato(dato)
      : "";
    const IconoPrincipal = configuracionActual?.icono;

    const continuarConfirmacion = () => {
      if (eliminando) {return;    
      }
      setPasoConfirmacion(2);
    };
    const volverConfirmacion = () => {
      if (eliminando) {return;    
      }
      setPasoConfirmacion(1);
    };

    const confirmar = async () => {
      if (eliminando) return;
      try {
        setEliminando(true);
        setError("");
        await onConfirmar?.(dato);
        onCerrarModal();

      } catch (error) {
        console.error("Error al actualizar:", error);
        setError("No se pudo actualizar el estado. El registro está siendo utilizado por otros datos del sistema.");
        
      } finally {
        setEliminando(false);
      }
    };

    useEffect(() => {
        setError("");
        if (!modalAbierto) {
            body.style.overflow="";
            setPasoConfirmacion(1);
            setEliminando(false);
            return;
        }
        body.style.overflow="hidden";
        setPasoConfirmacion(1);
        setEliminando(false);
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
    }, [modalAbierto, eliminando, onCerrarModal]);

    if (!modalAbierto || !configuracionActual || !dato) {
      return null;
    }

    if (!modalAbierto) {
        body.style.overflow="";
        return null;
    }
    return (
      <div className="modalEstadoOverlay">
        <div
          className="modalEstado"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalEstadoTitle"
          ref={RefAreaDelModal}
        >
          <header className="modalEstadoHeader">
            <div className="modalEstadoHeading">
              <h2
                id="modalEstadoTitle"
                className="modalEstadoTitle"
              >
                {configuracionActual.titulo}
              </h2>
            </div>

            <button
              type="button"
              className="modalEstadoClose"
              onClick={onCerrarModal}
              aria-label="Cerrar"
              disabled={eliminando}
            >
              <X
                size={17}
                strokeWidth={2}
              />
            </button>
          </header>
          <div className="modalEstadoContent">
            {pasoConfirmacion === 1 ? (

              <>
                <div className="modalEstadoWarningIcon">
                  <IconoPrincipal
                  size={25}
                  strokeWidth={2}
                />
                </div>

                <h3 className="modalEstadoQuestion">
                  ¿Deseas actualizar el estado del {" "}
                  {configuracionActual.etiqueta}?
                </h3>
                <div className="modalEstadoDato">

                  <span>
                    Estado actual: {nombreDato}
                  </span>
                </div>

              </>

            ) : (

              <>
                <div className="modalEstadoConfirmIcon">
                  <IconoPrincipal
                  size={25}
                  strokeWidth={2}
                />
                </div>

                <h3 className="modalEstadoQuestion">
                  ¿Confirmas el cambio de estado?
                </h3>
                <div className="modalEstadoDato modalEstadoDatoConfirm">
                  <span>
                    Estado Actual: {nombreDato}
                  </span>
                </div>

                <div className="modalEstadoConfirmMessage">
                  <strong>
                    Se actualizará el estado de este registro y los cambios pueden afectar a los datos relacionados
                  </strong>
                </div>

                {error && (
                  <div className="modalEstadoError">
                    {error}
                  </div>
                )}
              </>
            )}
          </div>

          <footer className="modalEstadoActions">
            {pasoConfirmacion === 1 ? (
              <>
                <button
                  type="button"
                  className="modalEstadoButton modalEstadoButtonCancel"
                  onClick={onCerrarModal}
                  disabled={eliminando}
                >
                  <CircleX
                    size={17}
                    strokeWidth={2}
                  />
                  <span>
                    Cancelar
                  </span>
                </button>
                <button
                  type="button"
                  className="modalEstadoButton modalEstadoButtonContinue"
                  onClick={continuarConfirmacion}
                  disabled={eliminando}
                >
                  <span>
                    Revisar cambio
                  </span>
                  <ArrowRight
                    size={17}
                    strokeWidth={2}
                  />
                </button>
              </>

            ) : (

              <>
                <button
                  type="button"
                  className="modalEstadoButton modalEstadoButtonCancel"
                  onClick={volverConfirmacion}
                  disabled={eliminando}
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
                  className="modalEstadoButton modalEstadoButtonConfirm"
                  onClick={confirmar}
                  disabled={eliminando || !!error}
                >
                  <span>
                    {eliminando
                      ? "Actualizando..."
                      : "Confirmar actualización"
                    }
                  </span>
                </button>
              </>
            )}
          </footer>
        </div>
      </div>
    );
}