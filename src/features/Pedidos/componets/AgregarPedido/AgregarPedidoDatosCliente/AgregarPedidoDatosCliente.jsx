import "./AgregarPedidoDatosCliente.css";
import { parsePhoneNumberFromString } from "libphonenumber-js/min";
import { useState } from "react";

import ModalSelector from "../../../../../components/modals/ModalSelector/ModalSelector";

const caracteresPermitidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.'\-&()]+$/;
const validarTextoDeInput = (nombre) => {
    const textoValidado = nombre.trim();
    if (!textoValidado) { return "El nombre del cliente es obligatorio."}
    if (!caracteresPermitidos.test(textoValidado)) {return "El nombre contiene caracteres no invalidos.";}
    if (textoValidado.length < 2) {return "El nombre debe tener al menos 2 caracteres.";}
    if (textoValidado.length > 32) {return "El nombre no puede superar 32 caracteres.";}
    return null
};

const validarNumero = (valor, pais) => {
  const numeroLimpio = valor.trim();
  if (!numeroLimpio) { return "El número de contacto es obligatorio."}
  if (!/^[0-9\s()+-]+$/.test(numeroLimpio)) { return "El número contiene caracteres no válidos.";}

  const numeroTelefonico = parsePhoneNumberFromString( numeroLimpio, pais);
  if (!numeroTelefonico.isValid()) { return "El número de teléfono no es válido.";}
  return null;
};

export default function AgregarPedidoProductos({cliente, telefono, colegio, onClienteChange, onTelefonoChange, onColegioChange} ) {
    const [selectorAbierto, setSelectorAbierto] = useState(null);

    const [errorNombre, setErrorNombre] = useState("");

    const [pais, setPais] = useState("CL");
    const [telefonoInput, setTelefonoInput] = useState("");
    const [errorTelefono, setErrorTelefono] = useState("");

    const nombreCliente = (event) => {
        const nombre = event.target.value;
        setErrorNombre(validarTextoDeInput(nombre))
        onClienteChange(nombre);
    };

    const normalizarTelefono = (telefono, pais) => {
      const numeroTelefonico = parsePhoneNumberFromString(telefono, pais);
      if (!numeroTelefonico || !numeroTelefonico.isValid()) {
        return null;
      }
      return numeroTelefonico.number;
    };

    const telefonoCliente = (event) => {
        const valor = event.target.value;
        setTelefonoInput(valor);
        setErrorTelefono(validarNumero(valor, pais));
        const telefonoNormalizado  = normalizarTelefono(valor, pais)
        onTelefonoChange(telefonoNormalizado ?? "");
    };

    const cambiarPais = (event) => {
      const nuevoPais = event.target.value;
      setPais(nuevoPais);
      if (telefono) {
        setErrorTelefono(
          validarNumero(telefono, nuevoPais)
        );
      }
    };

    const abrirSelectorColegio = () => {
        setSelectorAbierto("colegio");
    };

    const cerrarSelector = () => {
      setSelectorAbierto(null);
    };

    const seleccionarColegio = (colegioSeleccionado) => {
      onColegioChange(colegioSeleccionado.nombre);
      cerrarSelector()
    };
  return (
    <section className="agregarPedidoDatosCliente">
      <div className="agregarPedidoDatosClienteHeader">
          <h2 className="agregarPedidoDatosClienteTitulo">
            DATOS DEl CLIENTE
          </h2>
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
            maxLength={32}
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

          <div className="telefonoInputWrapper">
            <select
              className="selectorPais"
              value={pais}
              onChange={cambiarPais}
              aria-label="País del número de teléfono"
            >
              <option value="CL">CL +56</option>
              <option value="AR">AR +54</option>
              <option value="PE">PE +51</option>
              <option value="VE">VE +58</option>
              <option value="BR">BR +55</option>
              <option value="HT">HT +509</option>
              <option value="CO">CO +57</option>
              <option value="US">US +1</option>
            </select>

            <input
              id="telefonoCliente"
              type="tel"
              value={telefonoInput}
              onChange={telefonoCliente}
              placeholder="Ej. 912345678"
              autoComplete="off"
              maxLength={15}
            />
          </div>
          {errorTelefono && (
            <p className="agregarPedidoCampoError">
              {errorTelefono}
            </p>
          )}
        </div>

        <div className="agregarPedidoCampo agregarPedidoCampoColegio">
          <label>Empresa o Colegio Afiliado el Pedido (opcional)</label>
          <button
            type="button"
            className={`agregarPedidoColegioSelector ${
              colegio
                ? "agregarPedidoColegioSelectorSeleccionado"
                : ""
            }`}
            onClick={abrirSelectorColegio}
          >
            <span className="agregarPedidoColegioNombre">
              {colegio || "Seleccionar empresa o colegio"}
            </span>
          </button>
        </div>
      </div>
      
      {selectorAbierto && (
      <ModalSelector
        tipo={selectorAbierto}
        modalAbierto={Boolean(selectorAbierto)}
        onCerrarModal={cerrarSelector}
        onSeleccionarColegio={seleccionarColegio}
      />)}
    </section>
  );
}