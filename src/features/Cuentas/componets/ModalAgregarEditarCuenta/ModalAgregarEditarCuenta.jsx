import "./ModalAgregarEditarCuenta.css";
import { useEffect, useRef, useState } from "react";
import { db } from "../../../../firebase";
import { addDoc, collection, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { bancosChile, tiposDeCuenta } from "../Cuentas/datosBancos";

import { CircleX, CirclePlus, X } from "lucide-react";

const body = document.body;
const caracteresPermitidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.'\-&()]+$/;
const rutPermitido = /^[0-9.kK-]+$/;
const numeroCuentaPermitido = /^[0-9]+$/;

const validarTexto = (texto, nombreCampo, maximo = 32) => {
    const textoValidado = texto.trim();
    if (!textoValidado) {return `El campo ${nombreCampo} es obligatorio.`;}
    if (textoValidado.length < 2) {return `El campo ${nombreCampo} debe tener al menos 2 caracteres.`;}
    if (textoValidado.length > maximo) {return `El campo ${nombreCampo} no puede superar ${maximo} caracteres.`;}
    if (!caracteresPermitidos.test(textoValidado)) {return `El campo ${nombreCampo} contiene caracteres no permitidos.`;}
    return null;
};
const validarRut = (rut) => {
    const rutValidado = rut.trim();
    if (!rutValidado) {return "El RUT del titular es obligatorio.";}
    if (!rutPermitido.test(rutValidado)) {return "El RUT contiene caracteres no permitidos.";}
    if (rutValidado.length < 8 || rutValidado.length > 12) {return "El RUT no tiene un formato válido.";}
    return null;
};
const validarNumeroCuenta = (numeroCuenta) => {
    const numeroValidado = numeroCuenta.trim();
    if (!numeroValidado) {return "El número de cuenta es obligatorio.";}
    if (!numeroCuentaPermitido.test(numeroValidado)) {return "El número de cuenta solo puede contener números.";}
    if (numeroValidado.length < 4 || numeroValidado.length > 30) {return "El número de cuenta no tiene un formato válido.";}
    return null;
};
const validarCorreo = (correo) => {
    const correoValidado = correo.trim();
    if (!correoValidado) {return "El correo es obligatorio.";}
    if (correoValidado.length > 120) {return "El correo no puede superar 120 caracteres.";}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoValidado)) {return "El correo no tiene un formato válido.";}
    return null;
};

export default function ModalAgregarEditarCuenta({datoCuentaEditar, modalAbierto, onCerrarModal}){
    const [errores, setErrores] = useState({});
    const [guardandoCuenta, setGuardandoCuenta] = useState(false);
    const RefAreaDelModal = useRef(null);

    const [nombreDeCuenta, setNombreDeCuenta] = useState("");
    const [banco, setBanco] = useState("");
    const [numeroCuenta, setNumeroCuenta] = useState("");
    const [tipoCuenta, setTipoCuenta] = useState("");
    const [titularNombre, setTitularNombre] = useState("");
    const [titularRut, setTitularRut] = useState("");
    const [correo, setCorreo] = useState("");
    const [activo, setActivo] = useState(true);

    useEffect(() => {
        if (!modalAbierto) {
            body.style.overflow="";
            setNombreDeCuenta("");
            setBanco("");
            setNumeroCuenta("");
            setTipoCuenta("");
            setTitularNombre("");
            setTitularRut("");
            setCorreo("");
            setActivo(true);
            setErrores({});
            return;
        }

        body.style.overflow="hidden";

        if (datoCuentaEditar) {
            setNombreDeCuenta(datoCuentaEditar.nombre || "");
            setBanco(datoCuentaEditar.banco || "");
            setNumeroCuenta(datoCuentaEditar.numero_cuenta || "");
            setTipoCuenta(datoCuentaEditar.tipo_cuenta || "");
            setTitularNombre(datoCuentaEditar.titular_nombre || "");
            setTitularRut(datoCuentaEditar.titular_rut || "");
            setCorreo(datoCuentaEditar.correo || "");
            setActivo(datoCuentaEditar.activo ?? true);
        }else{
            setNombreDeCuenta("");
            setBanco("");
            setNumeroCuenta("");
            setTipoCuenta("");
            setTitularNombre("");
            setTitularRut("");
            setCorreo("");
            setActivo(true);
        }

        setErrores({});

        return () => {
            body.style.overflow="";
        };
    }, [modalAbierto, datoCuentaEditar]);

    useEffect(() => {
        if (!modalAbierto) {
            body.style.overflow="";
            return;
        }

        body.style.overflow="hidden";

        const clickFueraDelModal = (event) => {
            if (RefAreaDelModal.current && !RefAreaDelModal.current.contains(event.target)){
                onCerrarModal();
            }
        };

        document.addEventListener("mousedown", clickFueraDelModal);

        return () => {
            document.removeEventListener("mousedown", clickFueraDelModal);
        };
    }, [modalAbierto, onCerrarModal]);

    const actualizarCampo = (setter, valor, campo) => {
        setter(valor);
        if (errores[campo]) {
            setErrores((erroresActuales) => {
                const nuevosErrores = {...erroresActuales};
                delete nuevosErrores[campo];
                return nuevosErrores;
            });
        }
    };

    const validarFormulario = () => {
        const nuevosErrores = {};
        const errorNombre = validarTexto(nombreDeCuenta, "nombre de la cuenta", 32);
        if (errorNombre) {nuevosErrores.nombre = errorNombre;}
        if (!banco) {nuevosErrores.banco = "Debes seleccionar un banco.";}

        const errorNumeroCuenta = validarNumeroCuenta(numeroCuenta);
        if (errorNumeroCuenta) {nuevosErrores.numeroCuenta = errorNumeroCuenta;}
        if (!tipoCuenta) {nuevosErrores.tipoCuenta = "Debes seleccionar un tipo de cuenta.";}

        const errorTitularNombre = validarTexto(titularNombre, "nombre del titular", 32);
        if (errorTitularNombre) {nuevosErrores.titularNombre = errorTitularNombre;}

        const errorRut = validarRut(titularRut);
        if (errorRut) {nuevosErrores.titularRut = errorRut;}

        const errorCorreo = validarCorreo(correo);
        if (errorCorreo) {nuevosErrores.correo = errorCorreo;}
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const guardarCuentaCreadoOEditado = async () => {
        if (!validarFormulario()) {return;}

        const datosCuenta = {
            nombre: nombreDeCuenta.trim(),
            banco,
            numero_cuenta: numeroCuenta.trim(),
            tipo_cuenta: tipoCuenta,
            titular_nombre: titularNombre.trim(),
            titular_rut: titularRut.trim(),
            correo: correo.trim(),
            activo
        };
        if (datoCuentaEditar) {
            await guardarCuentaEditado(datosCuenta);
        }else{
            await guardarCuentaCreado(datosCuenta);
        }
    };
    const guardarCuentaCreado = async (datosCuenta) => {
        try {
            setGuardandoCuenta(true); setErrores({});
            await addDoc(collection(db, "cuentas_bancarias"), {
                ...datosCuenta,
                fecha_actualizacion: serverTimestamp()
            });
            onCerrarModal();
        }catch(error){
            console.error("Error al Crear la Cuenta Bancaria:", error);
            setErrores({general: "No se pudo crear la cuenta bancaria, intente de nuevo."});
        }finally{
            setGuardandoCuenta(false);
        }
    };
    const guardarCuentaEditado = async (datosCuenta) => {
        try {
            setGuardandoCuenta(true); setErrores({});
            await updateDoc(doc(db, "cuentas_bancarias", datoCuentaEditar.id), {
                ...datosCuenta,
                fecha_actualizacion: serverTimestamp()
            });
            onCerrarModal();
        }catch(error){
            console.error("Error al Editar la Cuenta Bancaria:", error);
            setErrores({general: "No se pudo editar la cuenta bancaria, intente de nuevo."});
        }finally{
            setGuardandoCuenta(false);
        }
    };
    if (!modalAbierto) {
        return null;
    }
    return (
        <div className="modalCuentaOverlay">
            <div
                className="modalCuenta"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modalCuentaTitle"
                ref={RefAreaDelModal}
            >
                <header className="modalCuentaHeader">
                    <h2 id="modalCuentaTitle" className="modalCuentaTitle">
                        {datoCuentaEditar ? "Editar Cuenta Bancaria" : "Agregar Cuenta Bancaria"}
                    </h2>
                    <button
                        type="button"
                        className="modalCuentaClose"
                        onClick={onCerrarModal}
                        aria-label="Cerrar"
                        disabled={guardandoCuenta}
                    >
                        <X size={17} strokeWidth={2} />
                    </button>
                </header>

                <div className="modalCuentaContent">
                    {errores.general && (
                        <p className="modalCuentaErrorGeneral">
                            {errores.general}
                        </p>
                    )}

                    <div className="modalCuentaGrid">
                        <div className="modalCuentaField modalCuentaFieldFull">
                            <label htmlFor="nombreCuenta" className="modalCuentaLabel">
                                {datoCuentaEditar ? "Nombre de la cuenta (el nombre no se enviara a los clientes)" : "Nombre de la cuenta (el nombre no se enviara a los clientes)"}
                            </label>
                            <input
                                id="nombreCuenta"
                                type="text"
                                className="modalCuentaInput"
                                placeholder="Ej. JOSE CARLOS CUENTA RUT"
                                value={nombreDeCuenta}
                                onChange={(event) => actualizarCampo(setNombreDeCuenta, event.target.value, "nombre")}
                                maxLength={32}
                                autoComplete="off"
                                disabled={guardandoCuenta}
                            />
                            {errores.nombre && (
                                <p className="modalCuentaError">
                                    {errores.nombre}
                                </p>
                            )}
                        </div>

                        <div className="modalCuentaField">
                            <label htmlFor="bancoCuenta" className="modalCuentaLabel">
                                Seleccion el Banco
                            </label>
                            <select
                                id="bancoCuenta"
                                className="modalCuentaInput modalCuentaSelect"
                                value={banco}
                                onChange={(event) => actualizarCampo(setBanco, event.target.value, "banco")}
                                disabled={guardandoCuenta}
                            >
                                <option value="">Selecciona un banco</option>
                                {bancosChile.map((bancoDisponible) => (
                                    <option key={bancoDisponible} value={bancoDisponible}>
                                        {bancoDisponible}
                                    </option>
                                ))}
                            </select>
                            {errores.banco && (
                                <p className="modalCuentaError">
                                    {errores.banco}
                                </p>
                            )}
                        </div>

                        <div className="modalCuentaField">
                            <label htmlFor="tipoCuenta" className="modalCuentaLabel">
                                Tipo de cuenta
                            </label>
                            <select
                                id="tipoCuenta"
                                className="modalCuentaInput modalCuentaSelect"
                                value={tipoCuenta}
                                onChange={(event) => actualizarCampo(setTipoCuenta, event.target.value, "tipoCuenta")}
                                disabled={guardandoCuenta}
                            >
                                <option value="">Selecciona un tipo</option>
                                {tiposDeCuenta.map((tipoDisponible) => (
                                    <option key={tipoDisponible} value={tipoDisponible}>
                                        {tipoDisponible}
                                    </option>
                                ))}
                            </select>
                            {errores.tipoCuenta && (
                                <p className="modalCuentaError">
                                    {errores.tipoCuenta}
                                </p>
                            )}
                        </div>

                        <div className="modalCuentaField">
                            <label htmlFor="numeroCuenta" className="modalCuentaLabel">
                                Número de cuenta
                            </label>
                            <input
                                id="numeroCuenta"
                                type="text"
                                inputMode="numeric"
                                className="modalCuentaInput"
                                placeholder="Ej. 12345678"
                                value={numeroCuenta}
                                onChange={(event) => actualizarCampo(setNumeroCuenta, event.target.value, "numeroCuenta")}
                                maxLength={30}
                                autoComplete="off"
                                disabled={guardandoCuenta}
                            />
                            {errores.numeroCuenta && (
                                <p className="modalCuentaError">
                                    {errores.numeroCuenta}
                                </p>
                            )}
                        </div>

                        <div className="modalCuentaField">
                            <label htmlFor="titularRut" className="modalCuentaLabel">
                                RUT del titular
                            </label>
                            <input
                                id="titularRut"
                                type="text"
                                className="modalCuentaInput"
                                placeholder="Ej. 12.345.678-9"
                                value={titularRut}
                                onChange={(event) => actualizarCampo(setTitularRut, event.target.value, "titularRut")}
                                maxLength={12}
                                autoComplete="off"
                                disabled={guardandoCuenta}
                            />
                            {errores.titularRut && (
                                <p className="modalCuentaError">
                                    {errores.titularRut}
                                </p>
                            )}
                        </div>

                        <div className="modalCuentaField modalCuentaFieldFull">
                            <label htmlFor="titularNombre" className="modalCuentaLabel">
                                Nombre del titular
                            </label>
                            <input
                                id="titularNombre"
                                type="text"
                                className="modalCuentaInput"
                                placeholder="Ej. JOSE CARLOS"
                                value={titularNombre}
                                onChange={(event) => actualizarCampo(setTitularNombre, event.target.value, "titularNombre")}
                                maxLength={32}
                                autoComplete="off"
                                disabled={guardandoCuenta}
                            />
                            {errores.titularNombre && (
                                <p className="modalCuentaError">
                                    {errores.titularNombre}
                                </p>
                            )}
                        </div>

                        <div className="modalCuentaField modalCuentaFieldFull">
                            <label htmlFor="correoCuenta" className="modalCuentaLabel">
                                Correo
                            </label>
                            <input
                                id="correoCuenta"
                                type="email"
                                className="modalCuentaInput"
                                placeholder="Ej. CORREO@EJEMPLO.CL"
                                value={correo}
                                onChange={(event) => actualizarCampo(setCorreo, event.target.value, "correo")}
                                maxLength={120}
                                autoComplete="off"
                                disabled={guardandoCuenta}
                            />
                            {errores.correo && (
                                <p className="modalCuentaError">
                                    {errores.correo}
                                </p>
                            )}
                        </div>

                        <div className="modalCuentaField modalCuentaFieldFull">
                            <label className="modalCuentaLabel">
                                Estado de la cuenta
                            </label>
                            <label className="modalCuentaSwitch">
                                <input
                                    type="checkbox"
                                    checked={activo}
                                    onChange={(event) => setActivo(event.target.checked)}
                                    disabled={guardandoCuenta}
                                />
                                <span className="modalCuentaSwitchTrack">
                                    <span className="modalCuentaSwitchThumb" />
                                </span>
                                <span className="modalCuentaSwitchText">
                                    {activo ? "Cuenta activa" : "Cuenta desactivada"}
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <footer className="modalCuentaActions">
                    <button
                        type="button"
                        className="modalCuentaButton modalCuentaButtonCancel"
                        onClick={onCerrarModal}
                        disabled={guardandoCuenta}
                    >
                        <CircleX size={17} strokeWidth={2} />
                        <span>Cancelar</span>
                    </button>
                    <button
                        type="button"
                        className="modalCuentaButton modalCuentaButtonPrimary"
                        disabled={guardandoCuenta}
                        onClick={guardarCuentaCreadoOEditado}
                    >
                        <CirclePlus size={17} strokeWidth={2} />
                        <span>
                            {guardandoCuenta ? "Guardando..." : datoCuentaEditar ? "Guardar cambios" : "Agregar"}
                        </span>
                    </button>
                </footer>
            </div>
        </div>
    );
}