import "./AgregarPedidoDatosCliente.css";
import { useMemo, useState } from "react";
import { School, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useColegios } from "../../../../Colegios/querys/useColegios";
import ModalSelector from "../../../../../components/modals/ModalSelector/ModalSelector";

const caracteresPermitidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.'\-&()]+$/;
const validarTextoDeInput = (nombre) => {
    const textoValidado = nombre.trim();
    if (!caracteresPermitidos.test(textoValidado)) {return "El nombre contiene caracteres no invalidos.";}
    if (textoValidado.length < 2) {return "El nombre debe tener al menos 2 caracteres.";}
    if (textoValidado.length > 32) {return "El nombre no puede superar 32 caracteres.";}
    return null
};

const validarNumero = (valor) => {
    const textoValidado = valor.trim();
    if (!/^\d+$/.test(textoValidado)) {return "El numero tiene caracteres invalidos";}
    if (textoValidado.length < 8) {return "El numero debe tener al menos 8 número.";}
    if (textoValidado.length > 14) {return "El numero debe tener menos de 14 números.";}
    return null
}

export default function AgregarPedidoDatosCliente({cliente, telefono, colegio, onClienteChange, onTelefonoChange, onColegioChange} ) {
    const navigate = useNavigate();
    const [selectorAbierto, setSelectorAbierto] = useState("false");
    const [error, setError] = useState("")

    const [errorNombre, setErrorNombre] = useState("");
    const [errorTelefono, setErrorTelefono] = useState("");

    const { data: datosDecolegios = []} = useColegios();
    const [colegioNombre, setColegioNombre] = useState("");

    const nombreCliente = (event) => {
        const nombre = event.target.value;
        setErrorNombre(validarTextoDeInput(nombre))
        onClienteChange(nombre);
    };
    const telefonoCliente = (event) => {
        const valor = event.target.value;
        onTelefonoChange(valor);
        setErrorTelefono(validarNumero(valor))
    };

    const colegioSeleccionado = useMemo(() => {return datosDecolegios.find(
        (colegio) => colegio.nombre === colegioNombre);
    }, [datosDecolegios, colegioNombre])

    const abrirSelectorColegio = () => {
        setError("");
        setSelectorAbierto("colegio");
    };

    const cerrarSelector = () => {
      setSelectorAbierto(null);
    };

    const seleccionarColegio = (colegio) => {
      setColegioNombre(colegio.nombre);
      onColegioChange(colegio);
      cerrarSelector()
    };

  return (
    <section className="agregarPedidoDatosCliente">
      <div className="productoDetalleHeader">
        <button
          type="button"
          className="productoVolver"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} strokeWidth={2} />
          Salir de Agregar pedido
        </button>
      </div>

      <div className="agregarPedidoDatosClienteHeader">
        <div>
          <h2 className="agregarPedidoDatosClienteTitulo">
            Datos del Cliente
          </h2>
        </div>
      </div>

      <div className="agregarPedidoDatosClienteCampos">
        <div className="agregarPedidoCampo">
          <label htmlFor="nombreCliente">
            Nombre del cliente
          </label>

          <input
            id="nombreCliente"
            type="text"
            value={cliente}
            onChange={nombreCliente}
            placeholder="Ej. María González"
            autoComplete="off"
          />

          {errorNombre && (
            <p className="agregarPedidoCampoError">
              {errorNombre}
            </p>
          )}
        </div>

        <div className="agregarPedidoCampo">
          <label htmlFor="telefonoCliente">
            Número de contacto
          </label>
          <input
            id="telefonoCliente"
            type="tel"
            inputMode="numeric"
            value={telefono}
            onChange={telefonoCliente}
            placeholder="Ej. 912345678"
            autoComplete="off"
          />
          {errorTelefono && (
            <p className="agregarPedidoCampoError">
              {errorTelefono}
            </p>
          )}
        </div>

        <div className="agregarPedidoCampo">
          <label>Empresa o Colegio Afiliado el Pedido (opcional)</label>
          <button
            type="button"
            className={`agregarPedidoColegioSelector ${
              colegioSeleccionado?.nombre
                ? "agregarPedidoColegioSelectorSeleccionado"
                : ""
            }`}
            onClick={abrirSelectorColegio}
          >
            <span className="agregarPedidoColegioIcono">
              <School
                size={16}
                strokeWidth={1.8}
              />
            </span>
            <span className="agregarPedidoColegioNombre">
              {colegioSeleccionado?.nombre || "Seleccionar empresa o colegio"}
            </span>
          </button>
        </div>
      </div>
      <ModalSelector
        tipo={selectorAbierto}
        modalAbierto={Boolean(selectorAbierto)}
        onCerrarModal={cerrarSelector}
        onSeleccionarColegio={seleccionarColegio}
      />
    </section>
  );
}