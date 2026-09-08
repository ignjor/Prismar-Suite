import "./AgregarProducto.css";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { useColegios } from "../../../Colegios/querys/useColegios";
import { useTipoPrenda } from "../../../TiposProducto/querys/useTipoPrenda";
import { useTallas } from "../../../Tallas/querys/useTallas";
import ModalFotoProducto from "../ModalFotoProducto/ModalFotoProducto";

import { ArrowLeft, Shirt, CirclePlus, CircleX, Trash2, CircleDollarSign } from "lucide-react";

const caracteresPermitidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.'\-&()]+$/;
const validarTextoDeInput = (datosDelInput) => {
    const textoValidado = datosDelInput.trim();
    if (textoValidado.length < 2) {return "El nombre debe tener al menos 2 caracteres.";}
    if (textoValidado.length > 32) {return "El nombre no puede superar 32 caracteres.";}
    if (!caracteresPermitidos.test(textoValidado)) {return "El nombre contiene caracteres no permitidos.";}
    return null
};

const validarPrecio = (datosDelInput) => {
    const textoValidado = String(datosDelInput).trim();
    if (textoValidado.length < 1) {return "El texto debe tener al menos 1 número.";}
    if (textoValidado.length > 9) {return "El precio debe tener menos de 9 números.";}
    if (!/^\d+$/.test(textoValidado)) {return "El precio solo puede tener números.";}
    return null
}


export default function AgregarProducto() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [estadoDelModal, setEstadoDelModal] = useState(false);
    const [imagen, setImagen] = useState("");
    const [guardandoProducto, setGuardandoProducto] = useState(false);

    const [nombreDeProducto, setNombreDeProducto] = useState("");
    const [tipoPrendaId, setTipoPrendaId] = useState("");
    const [preciosPorTallas, setPreciosPorTallas] = useState([]);
    const [colegioId, setColegioId] = useState("");

    const { data: datosDecolegios = []} = useColegios();
    const { data: datosDeTipoPrenda = []} = useTipoPrenda();
    const { data: datosDeTallas = []} = useTallas();


    const tipoPrendaSeleccionado = useMemo(() => {return datosDeTipoPrenda.find(
      (tipoPrenda) => tipoPrenda.id === tipoPrendaId);
    }, [datosDeTipoPrenda, tipoPrendaId])

    const medidasDisponibles = useMemo(() => {if (!tipoPrendaSeleccionado?.medidas_asig) {
        return [];
      }
      return Object.entries(tipoPrendaSeleccionado.medidas_asig
      ).map(([medida]) => medida);
    }, [tipoPrendaSeleccionado]);

    const cambiarTipoPrenda = (e) => {
        setTipoPrendaId(e.target.value);
      };


    const tallasDisponibles = useMemo(() => {const tallasYaSeleccionadas = new Set(
      preciosPorTallas.map((item) => item.tallaId)
    );
    return datosDeTallas.filter((talla) => !tallasYaSeleccionadas.has(talla.id));
    }, [datosDeTallas, preciosPorTallas]);

    const agregarTalla = () => {if (tallasDisponibles.length === 0) {
      return;
      }
      const primerPrecio = tallasDisponibles[0];
      setPreciosPorTallas((actuales) => [...actuales, {
        tallaId: primerPrecio.id,
        talla: primerPrecio.talla,
        precio: "",
      },
      ]);
    };

    const cambiarTalla = (index, tallaId) => {
      const tallaSeleccionada = datosDeTallas.find((talla) => talla.id === tallaId
      );
      if (!tallaSeleccionada) {
        return;
      }
      setPreciosPorTallas((actuales) =>
        actuales.map((item, i) => i === index
            ? {...item,
                tallaId: tallaSeleccionada.id,
                talla: tallaSeleccionada.talla,
              }
            : item
      ));
    };
    
    const eliminarTalla = (index) => {
      setPreciosPorTallas((actuales) =>
        actuales.filter((_, i) => i !== index)
      );
    };

    const cambiarPrecio = (index, precio) => {
      const precioLimpio = precio.replace(/\D/g, "");
      setPreciosPorTallas((actuales) => actuales.map((item, i) =>
          i === index
            ? {
                ...item,
                precio: precioLimpio,
              }
            : item
        ));
    };

    const guardarProducto = async (e) => {
        e.preventDefault();

        setError("");

        const errorNombre = validarTextoDeInput(nombreDeProducto);

        if (errorNombre) {
          setError(errorNombre);
          return;
        }

        if (!tipoPrendaId) {
          setError("Debes seleccionar un tipo de prenda.");
          return;
        }

        if (preciosPorTallas.length === 0) {setError("Debes agregar al menos una talla.");
          return;
        }

        for (const item of preciosPorTallas) {
          const errorPrecio = validarPrecio(item.precio);

          if (errorPrecio) {
            setError(
              `Precio de talla ${item.talla}: ${errorPrecio}`
            );
            return;
          }
        }

        const preciosMap = {};
        for (const item of preciosPorTallas) {
          preciosMap[item.talla] = Number(item.precio);
        }

        const nuevoProducto = {
          nombre: nombreDeProducto.trim(),
          colegio_id: colegioId || null,
          tipo_prenda_id: tipoPrendaId,
          precios_tallas: preciosMap,
          imagen: imagen || "",
          fecha_actualizacion: serverTimestamp(),
        };

        try {
          setGuardandoProducto(true);
          await addDoc(collection(db, "productos"), nuevoProducto
          );
          navigate(-1);
        } catch (error) {
          console.error(
            "Error al crear producto:", error);
          setError("No se pudo crear el producto. Inténtalo nuevamente.");
        } finally {
          setGuardandoProducto(false);
        }
      };

  return (
    <main className="adminColegios productoDetallePage">
      <button
        type="button"
        className="productoVolver"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft
          size={17}
          strokeWidth={2}
        />

        Salir de Agregar producto
      </button>
      <form
        className="productoDetalle"
        onSubmit={guardarProducto}
      >
        <div className="productoDetalleImagenWrapper">

          {imagen ? (
            <img
              src={imagen}
              alt={`Imagen de ${nombreDeProducto || "producto"}`}
              className="productoDetalleImagen"
            />
          ) : (
            <div className="productoDetalleImagen productoDetalleImagenVacia">
              <span>
                <Shirt size={50} />
              </span>
            </div>
          )}
          <button
            type="button"
            className="productoEditarFoto"
            onClick={() => setEstadoDelModal(true)}
          >
            <span>
              Editar foto
            </span>
          </button>

        </div>
        <div className="productoDetalleContenido">
          <div className="productoCrearCampo productoCrearNombre">
            <input
              id="nombreProducto"
              type="text"
              value={nombreDeProducto}
              onChange={(e) => setNombreDeProducto(e.target.value)}
              placeholder="Nombre del producto"
              maxLength={32}
              className="productoCrearInput productoCrearInputNombre"
              autoComplete="off"
            />
          </div>

          <div className="productoDetalleEtiquetas productoCrearSelectorWrapper">
            <select
              id="colegioProducto"
              value={colegioId}
              onChange={(e) => setColegioId(e.target.value)}
              className="productoCrearSelect"
            >
              <option value="">
                Seleccionar Empresa o Colegio
              </option>

              {datosDecolegios.map((colegio) => (
                <option
                  key={colegio.id}
                  value={colegio.id}
                >
                  {colegio.nombre}
                </option>
              ))}
            </select>
            <select
              id="tipoPrendaProducto"
              value={tipoPrendaId}
              onChange={cambiarTipoPrenda}
              className="productoCrearSelect"
            >
              <option value="">
                Seleccionar tipo de prenda
              </option>

              {datosDeTipoPrenda.map((tipoPrenda) => (
                <option
                  key={tipoPrenda.id}
                  value={tipoPrenda.id}
                >
                  {tipoPrenda.tipo}
                </option>
              ))}
            </select>

          </div>

          <div className="productoDetalleSeparador" />

          <div className="productoDetalleSeccion">
            <div className="productoCrearSeccionHeader">
              <h2 className="preciosAsignadosTitle">
                PRECIOS POR TALLA
              </h2>
              {tallasDisponibles.length > 0 && (
                <button
                  type="button"
                  className="productoAgregarTalla"
                  onClick={agregarTalla}
                >
                  <CircleDollarSign
                    size={16}
                    strokeWidth={2}
                  />
                  Agregar Precio
                </button>
              )}
            </div>

            {preciosPorTallas.length > 0 ? (
              <div className="productoDetallePrecios">

                {preciosPorTallas.map((item, index) => {
                  const tallasParaEsteSelector =
                    datosDeTallas.filter((talla) => {
                      const usadaPorOtroCampo =
                        preciosPorTallas.some(
                          (otraTalla, otroIndex) =>
                            otroIndex !== index &&
                            otraTalla.tallaId === talla.id
                        );
                      return (
                        !usadaPorOtroCampo ||
                        talla.id === item.tallaId
                      );
                    });
                  return (
                    <div
                      className="productoDetallePrecio productoCrearPrecio"
                      key={`${item.tallaId}-${index}`}
                    >
                      <select
                        value={item.tallaId}
                        onChange={(e) =>
                          cambiarTalla(
                            index,
                            e.target.value
                          )
                        }
                        className="productoCrearTallaSelect"
                        aria-label={`Talla ${index + 1}`}
                      >
                        {tallasParaEsteSelector.map(
                          (talla) => (
                            <option
                              key={talla.id}
                              value={talla.id}
                            >
                              {talla.talla}
                            </option>
                          )
                        )}
                      </select>

                      <div className="productoCrearPrecioInputWrapper">
                        <span className="productoCrearPrecioSimbolo">
                          $
                        </span>

                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={7}
                          value={item.precio === "" || item.precio == null
                            ? ""
                            : Number(item.precio).toLocaleString("es-CL")}
                          onChange={(e) =>
                            cambiarPrecio(
                              index,
                              e.target.value
                            )
                          }
                          placeholder="0"
                          className="productoCrearPrecioInput"
                          aria-label={`Precio talla ${item.talla}`}
                        />
                      </div>

                      <button
                        type="button"
                        className="productoEliminarTalla"
                        onClick={() =>
                          eliminarTalla(index)
                        }
                        aria-label={`Eliminar talla ${item.talla}`}
                      >
                        <Trash2
                          size={16}
                          strokeWidth={1.8}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="productoCrearSinTallas">
                <p className="productoDetalleSinDatos">
                  No hay tallas agregadas.
                </p>
              </div>
            )}
          </div>

          <div className="productoDetalleSeccion">
            <h2 className="medidasAsignadasTitle">
              MEDIDAS{" "}
              {tipoPrendaSeleccionado?.tipo ||
                "Sin tipo de prenda asignado"}
            </h2>

            {medidasDisponibles.length > 0 ? (
              <div className="productoDetallePrecios">
                {medidasDisponibles.map((medida) => (
                  <div
                    className="productoDetallePrecio"
                    key={medida}
                  >
                    <span className="productoDetalleValor">
                      {medida}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="productoDetalleSinDatos">
                {tipoPrendaId
                  ? "Este tipo de producto no tiene medidas asignadas."
                  : ""}
              </p>
            )}
          </div>
          {error && (
            <p className="productoCrearError">
              {error}
            </p>
          )}
            <div className="productoCrearActions">
              <button
                type="button"
                className= "productoCrearButton productoCrearButtonCancel"
                disabled={guardandoProducto}
                onClick={() => navigate(-1)}
              >
                <CircleX size={17} strokeWidth={2} />
                <span>
                  Cancelar
                </span>
              </button>
              <button
                type="submit"
                className="productoCrearButton productoCrearButtonPrimary"
                disabled={guardandoProducto}
              >
                <CirclePlus size={17} strokeWidth={2} />
                <span>
                  {guardandoProducto ? "Guardando..." : "Agregar"}
                </span>
              </button>
            </div>
        </div>

      </form>
      <ModalFotoProducto
        producto={{
          nombreDeProducto,
          imagen,
        }}
        modalAbierto={estadoDelModal}
        onCerrarModal={() =>
          setEstadoDelModal(false)
        }
        onFotoGuardada={(url) => {
          setImagen(url);
          setEstadoDelModal(false);
        }}
      />
    </main>
  );
}