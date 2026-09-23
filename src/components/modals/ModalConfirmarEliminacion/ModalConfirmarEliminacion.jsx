import "./ModalConfirmarEliminacion.css";
import { useEffect, useRef, useState } from "react";
import { collection, collectionGroup, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

import { X, CircleX, Trash2, AlertTriangle, ArrowLeft, ArrowRight, School, Tag, Ruler, Package, CreditCard, Group } from "lucide-react";

const body = document.body;
const configuracion = {
  colegio: { titulo: "Borrar Colegio / Empresa", etiqueta: "Afiliado", icono: School
  },
  talla: { titulo: "Borrar Talla", etiqueta: "Talla", icono: Tag
  },
  tipoPrenda: { titulo: "Borrar Tipo de prenda", etiqueta: "Tipo de prenda", icono: Ruler,
  },
  producto: { titulo: "Borrar Producto", etiqueta: "Producto", icono: Package,
  },
  cuentaBancaria: { titulo: "Borrar Cuenta Bancaria", etiqueta: "Cuenta Bancaria", icono: CreditCard,
  },
};
const referencias = {
  colegio: [
    { coleccion: "productos", campo: "colegio_id" },
    { coleccion: "pedidos", campo: "colegio_id" },
  ],
  tipoPrenda: [
    { coleccion: "productos", campo: "tipo_prenda_id" },
  ],

  producto: [
    { coleccion: "productos", campo: "producto_id", grupo: true },
  ],

  cuentaBancaria: [
    { coleccion: "pagos", campo: "cuenta_bancaria_id", grupo: true }
  ],
};

export default function ModalConfirmarEliminacion({tipo, dato, modalAbierto, onCerrarModal, onConfirmarEliminacion}) {
    const RefAreaDelModal = useRef(null);
    const [error, setError] = useState("");
    
    const [pasoConfirmacion, setPasoConfirmacion] = useState(1);
    const [eliminando, setEliminando] = useState(false);

    const configuracionActual = configuracion[tipo];

    const verificarReferencias = async () => {
      const referenciasActuales = referencias[tipo] ?? [];
      for (const referencia of referenciasActuales) {
        const origen = referencia.grupo
          ? collectionGroup(db, referencia.coleccion)
          : collection(db, referencia.coleccion);

        const q = query(
          origen,
          where(referencia.campo, referencia.operador || "==", dato.id),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          return true;
        }
      }
      return false;
    };

    const obtenerNombreDato = (datoActual) => {
      if (!datoActual) { return "Sin nombre" }
      if (tipo === "colegio") { return datoActual.nombre || "Sin nombre" }
      if (tipo === "tipoPrenda") { return datoActual.tipo || "Sin tipo" }
      if (tipo === "talla") { return datoActual.talla || "Sin talla" }
      if (tipo === "producto") { return datoActual.nombre || "Sin nombre" }
      if (tipo === "cuentaBancaria") {return datoActual.nombre || "Sin nombre"}
      return "Sin nombre";
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

    const confirmarEliminacion = async () => {
      if (eliminando) return;
      try {
        setEliminando(true);
        setError("");
        const tieneReferencias = await verificarReferencias();
        if (tieneReferencias) {
          setError(
            `No se puede borrar ${configuracionActual.etiqueta}. Esta siendo utilizada por otros datos del sistema.`
          );
          return;
        }
        await onConfirmarEliminacion?.(dato);
        onCerrarModal();
      } catch (error) {
        console.error("Error al eliminar:", error);
        setError("No se pudo completar la eliminación. Esta siendo utilizada por otros datos del sistema.");
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
              disabled={eliminando}
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
                  <AlertTriangle
                    size={25}
                    strokeWidth={1.8}
                  />
                </div>

                <h3 className="modalEliminacionQuestion">
                  ¿Seguro que quieres borrar este/a {" "}
                  {configuracionActual.etiqueta}?
                </h3>
                <div className="modalEliminacionDato">
                  <IconoPrincipal
                  size={18}
                  strokeWidth={2}
                />
                  <span>
                    {nombreDato}
                  </span>
                </div>

              </>

            ) : (

              <>
                <div className="modalEliminacionDangerIcon">
                  <AlertTriangle
                    size={25}
                    strokeWidth={1.9}
                  />
                </div>

                <h3 className="modalEliminacionQuestion">
                  ¿Estás completamente seguro?
                </h3>
                <div className="modalEliminacionDato modalEliminacionDatoDanger">
                  <IconoPrincipal
                  size={18}
                  strokeWidth={2}
                />
                  <span>
                    {nombreDato}
                  </span>
                </div>

                <div className="modalEliminacionDangerMessage">
                  <strong>
                    Esta acción es DEFINITIVA, NO se puede DESHACER y puede afectar a los datos relacionados
                  </strong>
                </div>

                {error && (
                  <div className="modalEliminacionError">
                    {error}
                  </div>
                )}
              </>
            )}
          </div>

          <footer className="modalEliminacionActions">
            {pasoConfirmacion === 1 ? (
              <>
                <button
                  type="button"
                  className="modalEliminacionButton modalEliminacionButtonCancel"
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
                  className="modalEliminacionButton modalEliminacionButtonContinue"
                  onClick={continuarConfirmacion}
                  disabled={eliminando}
                >
                  <span>
                    Continuar
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
                  className="modalEliminacionButton modalEliminacionButtonCancel"
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
                  className="modalEliminacionButton modalEliminacionButtonDelete"
                  onClick={confirmarEliminacion}
                  disabled={eliminando || !!error}
                >
                  <Trash2
                    size={17}
                    strokeWidth={2}
                  />
                  <span>
                    {eliminando
                      ? "Borrando..."
                      : "Borrar definitivamente"
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