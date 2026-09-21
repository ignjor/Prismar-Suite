import "./cuentasBancarias.css";
import { useCuentas } from "../../querys/useCuentas";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase";

import ModalConfirmarEliminacion from "../../../../components/modals/ModalConfirmarEliminacion/ModalConfirmarEliminacion";
import ModalAgregarEditarCuenta from "../ModalAgregarEditarCuenta/ModalAgregarEditarCuenta";

import { PencilLine, Eraser, CreditCard, Search } from "lucide-react";

export default function CuentasBancarias() {
    const { data: datosDeCuentas = [],
      isLoading, isError, error
    } = useCuentas();

    const [cuentaAEditar, setCuentaAEditar] = useState(null);
    const [cuentaAEliminar, setCuentaAEliminar] = useState(null);

    const [estadoDelModal, setEstadoDelModal] = useState(false);
    const [estadoDelModalEliminar, setEstadoDelModalEliminar] = useState(false);
     

    const listarCuentas = [...datosDeCuentas].sort((a, b) => {
          const fechaA = a.fecha_actualizacion?.toMillis?.() || 0;
          const fechaB = b.fecha_actualizacion?.toMillis?.() || 0;
          return fechaB - fechaA;
    });

    const [buscador, setBuscador] = useState("");
    const buscadorDeColegios = listarCuentas.filter((cuenta) =>
      cuenta.nombre?.toLowerCase().includes(buscador.toLowerCase()))

    const abrirModalParaCrear = () => {
        setCuentaAEditar  (null); setEstadoDelModal(true); 
    };
    const abrirModalParaEditar = (datoCuentaEspecifica) => {
        setCuentaAEditar(datoCuentaEspecifica); setEstadoDelModal(true); 
    };
    const cerrarModal = () => {
        setCuentaAEditar(null); setEstadoDelModal(false); 
    };


    const abrirModalParaEliminar = (datoCuentaEspecifica) => {
        setCuentaAEliminar(datoCuentaEspecifica); setEstadoDelModalEliminar(true);
    };
    const cerrarModalEliminar = () => {
        setCuentaAEliminar(null); setEstadoDelModalEliminar(false);
    };

    const eliminarCuenta = async (cuenta) => {
      if (!cuenta?.id) { 
        console.error("No ser pudo encontrar la cuenta. Recarga la página.");
        throw new Error("La cuenta no tiene identificador valido.");
      }
      try {await deleteDoc(doc(db, "cuentas_bancarias", cuenta.id));
      }catch (error) {
        console.error("Error al eliminar la cuenta:", error);
        throw error;
      }
    };

    if (isLoading) { return <p>Cargando Cuentas...</p>}
    if (isError) { return <p>Error: {error.message}. Error al Cargar Cuentas, recargue la página.</p>}
    return(
      <main className="cuentasBancariasAdmin">
        <header className="cuentasBancariasHeader">
          <h1 className="cuentasBancariasTitle">
            Cuentas Bancarias
          </h1>
          
          <div className="cuentasBancariasBuscador">
            <Search
              className="cuentasBancariasBuscadorIcon"
              size={18}
              strokeWidth={2}
            />
            <input
              type="text"
              className="cuentasBancariasBuscadorInput"
              placeholder="Buscar una cuenta con el nombre..."
              value={buscador}
              onChange={(e) => setBuscador(e.target.value)}
              aria-label="Buscar empresa o colegio"
              autoComplete="off"
            />
          </div>
        </header>
        <section className="cuentasBancariasGrid">

          {buscadorDeColegios.map((datoCuentaEspecifica) => (
            <article
              key={datoCuentaEspecifica.id}
              className="cuentaBancariaCard"
            >
              <div className="cuentaBancariaCardContent">
                <div className="cuentaBancariaCardHeader">
                  <span className={`cuentaBancariaBancoActivo ${ datoCuentaEspecifica.activo ? "activo" : "desactivado" }`}>
                    {datoCuentaEspecifica.activo ? "Activa" : "Desactivada"}
                  </span>
                  <span className="cuentaBancariaBanco">
                    {datoCuentaEspecifica.banco}
                  </span>
                </div>

                <h2 className="cuentaBancariaNombre">
                  {datoCuentaEspecifica.nombre}
                </h2>

                <div className="cuentaBancariaNumero">
                  <span className="cuentaBancariaLabel">
                    N° de cuenta
                  </span>
                  <strong>
                    {datoCuentaEspecifica.numero_cuenta}
                  </strong>
                </div>

                <div className="cuentaBancariaDatos">
                  <div className="cuentaBancariaDato">
                    <span>
                      Tipo de cuenta
                    </span>
                    <strong>
                      {datoCuentaEspecifica.tipo_cuenta}
                    </strong>
                  </div>

                  <div className="cuentaBancariaDato">
                    <span>
                      Titular
                    </span>
                    <strong>
                      {datoCuentaEspecifica.titular_nombre}
                    </strong>
                  </div>

                  <div className="cuentaBancariaDato">
                    <span>
                      RUT
                    </span>
                    <strong>
                      {datoCuentaEspecifica.titular_rut}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="cuentaBancariaActions">
                <button
                  type="button"
                  className="cuentaBancariaAction cuentaBancariaActionEdit"
                  aria-label={`Editar ${datoCuentaEspecifica.titular}`}
                  onClick={() => abrirModalParaEditar(datoCuentaEspecifica)}
                >
                  <PencilLine size={17} strokeWidth={2} />
                  <span>
                    Editar
                  </span>
                </button>
                <button
                  type="button"
                  className="cuentaBancariaAction cuentaBancariaActionDelete"
                  aria-label={`Eliminar ${datoCuentaEspecifica.titular}`}
                  onClick= {() => abrirModalParaEliminar(datoCuentaEspecifica)}
                >
                  <Eraser size={17} strokeWidth={2} />
                  <span>
                    Eliminar
                  </span>
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="cuentasBancariasAgregar">
            <p className="cuentasBancariasAgregarTexto">
              ¿Necesitas agregar cuenta bancaria?
            </p>
            <button
              type="button"
              className="cuentasBancariasAgregarButton"
              aria-label="Agregar colegio"
              onClick={abrirModalParaCrear}
            >
              <CreditCard size={21} strokeWidth={2}/>
            </button>
        </section>
          {estadoDelModal && (
          <ModalAgregarEditarCuenta
            datoCuentaEditar = {cuentaAEditar}
            modalAbierto = {estadoDelModal}
            onCerrarModal = {cerrarModal}
          /> )}
          {estadoDelModalEliminar && (
          <ModalConfirmarEliminacion
            tipo = "cuentaBancaria"
            dato = {cuentaAEliminar}
            modalAbierto= {estadoDelModalEliminar}
            onCerrarModal= {cerrarModalEliminar}
            onConfirmarEliminacion= {eliminarCuenta}
          /> )}
      </main>
    );
}