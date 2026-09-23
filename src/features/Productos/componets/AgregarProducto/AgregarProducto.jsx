import "./AgregarProducto.css";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../../../firebase";
import { addDoc, collection, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useColegios } from "../../../Colegios/querys/useColegios";
import { useTipoPrenda } from "../../../TiposProducto/querys/useTipoPrenda";
import { useTallas } from "../../../Tallas/querys/useTallas";
import ModalFotoProducto from "../ModalFotoProducto/ModalFotoProducto";
import ModalSelector from "../../../../components/modals/ModalSelector/ModalSelector";

import { ArrowLeft, Shirt, CirclePlus, CircleX, Trash2, CircleDollarSign, Package } from "lucide-react";

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
    if (textoValidado.length > 8) {return "El precio debe tener menos de 8 números.";}
    if (!/^\d+$/.test(textoValidado)) {return "El precio solo puede tener números.";}
    return null
}

export default function AgregarProducto() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [imagen, setImagen] = useState("");
    const [imagenPendiente, setImagenPendiente] = useState(null);
    const [previewImagenPendiente, setPreviewImagenPendiente] = useState("");
    
    const [selectorAbierto, setSelectorAbierto] = useState(false);
    const [estadoDelModalFoto, setEstadoDelModalFoto] = useState(false);

    const [guardandoProducto, setGuardandoProducto] = useState(false);
    const [nombreDeProducto, setNombreDeProducto] = useState("");
    const [tipoPrendaId, setTipoPrendaId] = useState("");
    const [colegioId, setColegioId] = useState("");
    const [preciosPorTallas, setPreciosPorTallas] = useState([]);

    const { data: datosDecolegios = []} = useColegios();
    const { data: datosDeTipoPrenda = []} = useTipoPrenda();
    const { data: datosDeTallas = []} = useTallas();

    const colegioSeleccionado = useMemo(() => { return datosDecolegios.find(
      (colegio) => colegio.id === colegioId
      );
    }, [datosDecolegios, colegioId]);

    const tipoPrendaSeleccionado = useMemo(() => {return datosDeTipoPrenda.find(
      (tipoPrenda) => tipoPrenda.id === tipoPrendaId);
    }, [datosDeTipoPrenda, tipoPrendaId])

    const medidasDisponibles = useMemo(() => {if (!tipoPrendaSeleccionado?.medidas_asig) {
        return [];
      }
      return Object.entries(tipoPrendaSeleccionado.medidas_asig
      ).map(([medida]) => medida);
    }, [tipoPrendaSeleccionado]);

    const tallasDisponibles = useMemo(() => {const tallasYaSeleccionadas = new Set(
      preciosPorTallas.map((item) => item.tallaId)
    );
    return datosDeTallas.filter((talla) => !tallasYaSeleccionadas.has(talla.id));
    }, [datosDeTallas, preciosPorTallas]);

    const agregarTalla = () => {
      if (tallasDisponibles.length === 0) {
        return;
      }
      setError("");
      setSelectorAbierto("talla");
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

    const abrirSelectorColegio = () => {
      setError("");
      setSelectorAbierto("colegio");
    };
    const abrirSelectorTipoPrenda = () => {
      setError("");
      setSelectorAbierto("tipoPrenda");
    };
    const cerrarSelector = () => {
      setSelectorAbierto(null);
    };


    const seleccionarColegio = (colegio) => {
      setColegioId(colegio.id);
      cerrarSelector();
    };
    const seleccionarTipoPrenda = (tipoPrenda) => {
      setTipoPrendaId(tipoPrenda.id);
      setError("");
      cerrarSelector();
    };
    const seleccionarTalla = (talla) => {
      if (!talla) {
        return;
      }
      setPreciosPorTallas((actuales) => { const tallaYaExiste = actuales.some(
          (item) => item.tallaId === talla.id
        );
        if (tallaYaExiste) { setError(`Ya agregaste la talla ${talla.talla}.`);
          return actuales;
        }
        return [ ...actuales,
          {
            tallaId: talla.id,
            talla: talla.talla,
            precio: "",
          },
        ];
      });
      cerrarSelector();
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
          if (!item.tallaId) {
            setError("Debes seleccionar una talla para cada precio.");
            return;
          }
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

        try {
          setGuardandoProducto(true);

          const productoRef = await addDoc(
            collection(db, "productos"),
            {
              nombre: nombreDeProducto.trim(),
              colegio_id: colegioId || null,
              tipo_prenda_id: tipoPrendaId,
              precios_tallas: preciosMap,
              imagen: "",
              fecha_actualizacion:
                serverTimestamp(),
            }
          );
          const productoId = productoRef.id;
          if (imagenPendiente) {
            const rutaStorage = `productos/${productoId}/imagen.webp`;
            const imagenRef = ref( storage, rutaStorage );

            await uploadBytes( imagenRef,imagenPendiente, { contentType: "image/webp" });
            const nuevaUrl = await getDownloadURL( imagenRef );

            await updateDoc(
              doc( db, "productos", productoId ),
              {
                imagen: nuevaUrl,
                fecha_actualizacion: serverTimestamp(),
              }
            );
          }
          navigate("/productos");
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
      <div className="header"> 
        <button
          type="button"
          className="productoVolver"
          onClick={() => navigate("/productos")}
        >
          <ArrowLeft
            size={17}
            strokeWidth={2}
          />
          Volver
        </button>
        <span className="agregarProductoTitulo">AGREGAR PRODUCTO <Package/></span>
      </div>
      <form
        className="productoDetalle"
        onSubmit={guardarProducto}
      >
        <div className="productoDetalleImagenWrapper">
          {previewImagenPendiente || imagen ? (
            <img
              src={previewImagenPendiente || imagen}
              alt={`Imagen de ${
                nombreDeProducto || "producto"
              }`}
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
            onClick={() => setEstadoDelModalFoto(true)}
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
              onChange={(e) =>
                setNombreDeProducto(e.target.value)
              }
              placeholder="Nombre del producto"
              maxLength={32}
              className="productoCrearInput productoCrearInputNombre"
              autoComplete="off"
            />
          </div>
          <div className="productoDetalleEtiquetas productoCrearSelectorWrapper">
            <button
              type="button"
              className={`productoCrearSelect productoCrearSelectModal ${
                colegioSeleccionado
                  ? "productoCrearSelectSeleccionado"
                  : ""
              }`}
              onClick={abrirSelectorColegio}
              disabled={guardandoProducto}
            >
              <span>
                {colegioSeleccionado?.nombre ||
                  "Seleccionar Empresa o Colegio"}
              </span>
            </button>
            <button
              type="button"
              className={`productoCrearSelect productoCrearSelectModal ${
                tipoPrendaSeleccionado
                  ? "productoCrearSelectSeleccionado"
                  : ""
              }`}
              onClick={abrirSelectorTipoPrenda}
              disabled={guardandoProducto}
            >
              <span>
                {tipoPrendaSeleccionado?.tipo ||
                  "Seleccionar tipo de prenda"}
              </span>
            </button>
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
                  disabled={guardandoProducto}
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
                  return (
                    <div
                      className="productoDetallePrecio productoCrearPrecio"
                      key={`${item.tallaId || "sin-talla"}-${index}`}
                    >
                        <span className="productoDetalleTalla">
                          {item.talla || "Seleccionar talla"}
                        </span>
                      <div className="productoCrearPrecioInputWrapper">
                        <span className="productoCrearPrecioSimbolo">
                          $
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={7}
                          value={
                            item.precio === "" ||
                            item.precio == null
                              ? ""
                              : Number(
                                  item.precio
                                ).toLocaleString(
                                  "es-CL"
                                )
                          }
                          onChange={(e) =>
                            cambiarPrecio(
                              index,
                              e.target.value
                            )
                          }
                          placeholder="0"
                          className="productoCrearPrecioInput"
                          aria-label={`Precio talla ${
                            item.talla || index + 1
                          }`}
                          disabled={guardandoProducto}
                        />
                      </div>
                      <button
                        type="button"
                        className="productoEliminarTalla"
                        onClick={() =>
                          eliminarTalla(index)
                        }
                        aria-label={`Eliminar talla ${
                          item.talla || index + 1
                        }`}
                        disabled={guardandoProducto}
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
              MEDIDAS ASIG. AL TIPO DE PRODUCTO: {" "}
              <strong>{tipoPrendaSeleccionado?.tipo ||
                "Sin tipo de prenda asignado"}</strong>
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
              className="productoCrearButton productoCrearButtonCancel"
              disabled={guardandoProducto}
              onClick={() => navigate("/productos")}
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
              type="submit"
              className="productoCrearButton productoCrearButtonPrimary"
              disabled={guardandoProducto}
            >
              <CirclePlus
                size={17}
                strokeWidth={2}
              />
              <span>
                {guardandoProducto
                  ? "Guardando..."
                  : "Agregar"}
              </span>
            </button>
          </div>
        </div>
      </form>

      <ModalFotoProducto
        producto={{ nombreDeProducto, imagen }}
        modalAbierto={estadoDelModalFoto}
        onCerrarModal={() =>
          setEstadoDelModalFoto(false)
        }
        onFotoGuardada={(blob) => {
          setImagenPendiente(blob);
          const url = URL.createObjectURL(blob);
          setPreviewImagenPendiente(url);
          setEstadoDelModalFoto(false);
        }}
      />
      <ModalSelector
        tipo={selectorAbierto}
        modalAbierto={Boolean(selectorAbierto)}
        onCerrarModal={cerrarSelector}
        onSeleccionarColegio={seleccionarColegio}
        onSeleccionarTipoPrenda={seleccionarTipoPrenda}
        onSeleccionarTalla={seleccionarTalla}
      />
    </main>
  );
}