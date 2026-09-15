import "./AgregarPedidoDatosCliente.css";
import { parsePhoneNumberFromString } from "libphonenumber-js/min";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft, ShoppingBag } from "lucide-react";
import ModalSelector from "../../../../../components/modals/ModalSelector/ModalSelector";

const caracteresPermitidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.'\-&()]+$/;
const validarTextoDeInput = (nombre) => {
    const textoValidado = nombre.trim();
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
  if (!numeroTelefonico) { return "Ingresa un número de teléfono válido.";}
  if (!numeroTelefonico.isValid()) { return "El número de teléfono no es válido.";}
  return null;
};

export default function AgregarPedidoDatosCliente({cliente, telefono, colegio, onClienteChange, onTelefonoChange, onColegioChange} ) {
    const navigate = useNavigate();
    const [selectorAbierto, setSelectorAbierto] = useState(null);

    const [errorNombre, setErrorNombre] = useState("");

    const [pais, setPais] = useState("CL");
    const [errorTelefono, setErrorTelefono] = useState("");

    const nombreCliente = (event) => {
        const nombre = event.target.value;
        setErrorNombre(validarTextoDeInput(nombre))
        onClienteChange(nombre);
    };
    const telefonoCliente = (event) => {
        const valor = event.target.value;
        setErrorTelefono(validarNumero(valor, pais));
        onTelefonoChange(valor);
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

    const normalizarTelefono = (telefono, pais) => {
      const numeroTelefonico = parsePhoneNumberFromString(telefono, pais);
      if (!numeroTelefonico || !numeroTelefonico.isValid()) {
        return null;
      }
      return numeroTelefonico.number;
    };

    const telefonoNormalizado = useMemo(() => {
        return normalizarTelefono(telefono, pais);
    }, [telefono, pais]);

    const abrirSelectorColegio = () => {
        setSelectorAbierto("colegio");
    };

    const cerrarSelector = () => {
      setSelectorAbierto(null);
    };

    const seleccionarColegio = (colegioSeleccionado) => {
      onColegioChange(colegioSeleccionado);
      cerrarSelector()
    };

  return (
    <section className="agregarPedidoDatosCliente">
        <div className="header"> 
        <button
          type="button"
          className="productoVolver"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} strokeWidth={2} />
          Salir de Agregar pedido
        </button>
        <span className="agregarPedidoTitulo">Agregar Pedido <ShoppingBag/></span>
        </div>


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
              value={telefono}
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
              colegio?.nombre
                ? "agregarPedidoColegioSelectorSeleccionado"
                : ""
            }`}
            onClick={abrirSelectorColegio}
          >
            <span className="agregarPedidoColegioNombre">
              {colegio?.nombre || "Seleccionar empresa o colegio"}
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