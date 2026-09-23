import "./ModalSelector.css";
import { useEffect, useRef, useState, useMemo } from "react";

import { useColegios } from "../../../features/Colegios/querys/useColegios";
import { useTipoPrenda } from "../../../features/TiposProducto/querys/useTipoPrenda";
import { useTallas } from "../../../features/Tallas/querys/useTallas";
import { useCuentas } from "../../../features/Cuentas/querys/useCuentas";

import ModalAgregarEditarColegio from "../../../features/Colegios/components/ModalAgregarEditarColegio/ModalAgregarEditarColegio";
import ModalAgregarEditarTalla from "../../../features/Tallas/componets/ModalAgregarEditarTalla/ModalAgregarEditarTalla";
import ModalAgregarEditarTipoPrenda from "../../../features/TiposProducto/componets/ModalAgregarEditarTipoPrenda/ModalAgregarEditarTipoPrenda";

import { X, Search, Plus, School, Tag, Ruler, CreditCard } from "lucide-react";

const body = document.body;
const configuracion = {
  colegio: {
    titulo: "Empresa / Colegio",
    placeholder: "Buscar empresa o colegio...",
    icono: School,
    crearTexto: "Crear Empresa / Colegio"
  },
  tipoPrenda: {
    titulo: "Tipo de prenda",
    placeholder: "Buscar tipo de prenda...",
    icono: Ruler,
    crearTexto: "Crear Tipo de Prenda / Producto"
    },
  talla: {
    titulo: "Talla",
    placeholder: "Buscar talla...",
    icono: Tag,
    crearTexto: "Crear talla"
    },
  cuentaBancaria: {
    titulo: "Cuentas Bancarias",
    placeholder: "Buscar cuenta por nombre...",
    icono: CreditCard,
    crearTexto: "Ir a Cuentas Bancarias (saldras de la página)"
  }
  };

export default function ModalSelector({tipo, modalAbierto, onCerrarModal, onSeleccionarColegio, onSeleccionarTipoPrenda, onSeleccionarTalla, onSeleccionarCuenta}) {
    const RefAreaDelModal = useRef(null);
    const [modalCrearAbierto, setModalCrearAbierto] = useState(null);
     
    const { data: datosDecolegios = []} = useColegios();
    const { data: datosDeTipoPrenda = []} = useTipoPrenda();
    const { data: datosDeTallas = []} = useTallas();
    const { data: datosDeCuentas = []} = useCuentas();
  
    const [buscador, setBuscador] = useState("");
    const buscadorNormalizado = buscador
      .trim()
      .toLowerCase();

    const listarColegios = useMemo(() => {
      return [...datosDecolegios]
        .sort((a, b) => {
          const fechaA = a.fecha_actualizacion?.toMillis?.() || 0;
          const fechaB = b.fecha_actualizacion?.toMillis?.() || 0;
          return fechaB - fechaA
        })}, [datosDecolegios]);
    const buscadorDeColegios = listarColegios.filter(
      (colegio) => colegio.nombre
          ?.toLowerCase()
          .includes(buscadorNormalizado)
    );

    const listarTallas = useMemo(() => {
      return [...datosDeTallas]
        .sort((a, b) => {
          const fechaA = a.fecha_actualizacion?.toMillis?.() || 0;
          const fechaB = b.fecha_actualizacion?.toMillis?.() || 0;
          return fechaB - fechaA
        })}, [datosDeTallas]);
    const buscadorDeTallas = listarTallas.filter(
      (talla) => talla.talla
          ?.toLowerCase()
          .includes(buscadorNormalizado)
    );

  
    const listarTipoPrenda = useMemo(() => {
      return [...datosDeTipoPrenda]
        .sort((a, b) => {
          const fechaA = a.fecha_actualizacion?.toMillis?.() || 0;
          const fechaB = b.fecha_actualizacion?.toMillis?.() || 0;
          return fechaB - fechaA;
        })}, [datosDeTipoPrenda])
    const buscadorDeTipoPrenda = listarTipoPrenda.filter(
      (tipoPrenda) => tipoPrenda.tipo
          ?.toLowerCase()
          .includes(buscadorNormalizado)
    );

    const listarCuentas = useMemo(() => {
      return [...datosDeCuentas]
        .sort((a, b) => {
          const fechaA = a.fecha_actualizacion?.toMillis?.() || 0;
          const fechaB = b.fecha_actualizacion?.toMillis?.() || 0;
          return fechaB - fechaA;
        })}, [datosDeTipoPrenda])
    const buscadorDeCuentas = listarCuentas.filter(
      (cuenta) => cuenta.nombre
          ?.toLowerCase()
          .includes(buscadorNormalizado)
    );

    useEffect(() => {
      if (!modalAbierto) {
        body.style.overflow = "";
        setBuscador("");
        setModalCrearAbierto(null);
        return;
      }

      body.style.overflow = "hidden";
      setBuscador("");
      return () => {
          body.style.overflow = "";
      };
    }, [modalAbierto, tipo]);

    useEffect(() => {
      if (!modalAbierto) { body.style.overflow = "";
        return;
      }
      body.style.overflow="hidden";
      const clickFueraDelModal = (event) => {
        if (
          RefAreaDelModal.current &&
          !RefAreaDelModal.current.contains(event.target)
        ) {
          if (!modalCrearAbierto) {
            onCerrarModal();
          }
        }
      };
      document.addEventListener(
        "mousedown",
        clickFueraDelModal
      );
      return () => {
        document.removeEventListener(
          "mousedown",
          clickFueraDelModal
        );
      };
    }, [ modalAbierto, modalCrearAbierto, onCerrarModal]);


    const configuracionActual = configuracion[tipo];
    if (!modalAbierto || !configuracionActual) {
      return null;
    };

    const IconoPrincipal  = configuracionActual.icono;
    let datosFiltrados = [];
    if (tipo === "colegio") { datosFiltrados = buscadorDeColegios};
    if (tipo === "tipoPrenda") { datosFiltrados = buscadorDeTipoPrenda};
    if (tipo === "talla") { datosFiltrados = buscadorDeTallas};
    if (tipo === "cuentaBancaria") { datosFiltrados = buscadorDeCuentas};

    const seleccionarDato = (dato)  => {
      if (tipo === "colegio") { onSeleccionarColegio?.(dato);
        onCerrarModal();
        return;
      }
      if (tipo === "tipoPrenda") { onSeleccionarTipoPrenda?.(dato);
        onCerrarModal();
        return;
      }
      if (tipo === "talla") { onSeleccionarTalla?.(dato);
        onCerrarModal();
        return;
      }
      if (tipo === "cuentaBancaria") { onSeleccionarCuenta?.(dato);
        onCerrarModal();
        return;
      }
    };
    const obtenerNombreDato = (dato) => {
      if (tipo === "colegio") { return dato.nombre || "Sin nombre";
      }
      if (tipo === "tipoPrenda") { return dato.tipo || "Sin tipo";
      }
      if (tipo === "talla") { return dato.talla || "Sin talla";
      }
      if (tipo === "cuentaBancaria") { return dato.nombre || "Sin nombre";
      }
      return "Sin nombre";
    };
    
    const abrirModalCrear = () => { setModalCrearAbierto(tipo);
    };
    const cerrarDespuesDeCrear = () => { setModalCrearAbierto(null);
    };

    if (!modalAbierto) {
          return null;
      }


  return (
    <>
      <div className="modalSelectorOverlay">
        <div
          className="modalSelector"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalSelectorTitle"
          ref={RefAreaDelModal}
        >
          <header className="modalSelectorHeader">
            <div className="modalSelectorHeading">
              <div>
                <h2
                  id="modalSelectorTitle"
                  className="modalSelectorTitle"
                >
                  {configuracionActual.titulo}
                </h2>
              </div>
            </div>

            <button
              type="button"
              className="modalSelectorClose"
              onClick={onCerrarModal}
              aria-label="Cerrar"
            >
              <X
                size={17}
                strokeWidth={2}
              />
            </button>
          </header>
          <div className="modalSelectorContent">
            <div className="modalSelectorSearch">
              <Search
                size={17}
                strokeWidth={2}
              />
              <input
                type="text"
                value={buscador}
                onChange={(event) =>
                  setBuscador(event.target.value)
                }
                placeholder={
                  configuracionActual.placeholder
                }
                autoComplete="off"
              />
              {buscador && (
                <button
                  type="button"
                  className="modalSelectorClearSearch"
                  onClick={() =>
                    setBuscador("")
                  }
                  aria-label="Limpiar búsqueda"
                >
                  <X
                    size={14}
                    strokeWidth={2}
                  />
                </button>
              )}
            </div>
            <div className="modalSelectorResults">
              {datosFiltrados.length > 0 ? (
                datosFiltrados.map((dato) => (
                  <button
                    type="button"
                    className="modalSelectorItem"
                    key={dato.id}
                    onClick={() =>
                      seleccionarDato(
                        dato
                      )
                    }
                  >
                    <div className="modalSelectorItemIcon">
                      <IconoPrincipal
                        size={16}
                        strokeWidth={1.8}
                      />
                    </div>
                    <span className="modalSelectorItemName">
                      {obtenerNombreDato(
                        dato
                      )}
                    </span>
                  </button>
                ))
              ) : (
                <div className="modalSelectorEmpty">
                  <div className="modalSelectorEmptyIcon">
                    <Search
                      size={21}
                      strokeWidth={1.7}
                    />
                  </div>
                  <p className="modalSelectorEmptyText">
                    {buscador
                      ? `No hay resultados para "${buscador}".`
                      : "Todavía no hay datos disponibles."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <footer className="modalSelectorActions">
            <button
              type="button"
              className="modalSelectorCreateButton"
              onClick={abrirModalCrear}
            >
              <Plus
                size={17}
                strokeWidth={2}
              />
              <span>
                {configuracionActual.crearTexto}
              </span>
            </button>
          </footer>
        </div>
      </div>

      <ModalAgregarEditarColegio
        datoColegioEditar={null}
        modalAbierto={
          modalCrearAbierto === "colegio"
        }
        onCerrarModal={cerrarDespuesDeCrear}
      />
      <ModalAgregarEditarTalla
        datoTallaEditar={null}
        modalAbierto={
          modalCrearAbierto === "talla"
        }
        onCerrarModal={cerrarDespuesDeCrear}
      />
      <ModalAgregarEditarTipoPrenda
        datoTipoPrendaEditar={null}
        modalAbierto={
          modalCrearAbierto === "tipoPrenda"
        }
        onCerrarModal={cerrarDespuesDeCrear}
      />
    </>
  );
}