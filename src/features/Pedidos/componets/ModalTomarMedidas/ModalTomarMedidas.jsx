import "./ModalTomarMedidas.css";
import { useEffect, useRef, useState } from "react";
import { CircleX, CircleCheck, X } from "lucide-react";

const body = document.body;

export default function ModalTomarMedidas({ producto, modalAbierto, onEditarMedidas, onCerrarModal }) {
    const RefAreaDelModal = useRef(null);

    const [medidas, setMedidas] = useState({});

    useEffect(() => {
        if (!modalAbierto) {
            body.style.overflow = "";
            return;
        }
        body.style.overflow = "hidden";
        if (producto?.medidas_asig instanceof Map) {
            setMedidas(Object.fromEntries(producto.medidas_asig));
        } else {
            setMedidas(producto?.medidas_asig || {});
        }
        return () => {
            body.style.overflow = "";
        };
    }, [modalAbierto, producto]);

    useEffect(() => {
        if (!modalAbierto) {
            return;
        }
        const clickFueraDelModal = (event) => {
            if (
                RefAreaDelModal.current &&
                !RefAreaDelModal.current.contains(event.target)
            ) {
                onCerrarModal();
            }
        };
        document.addEventListener("mousedown", clickFueraDelModal);
        return () => {
            document.removeEventListener(
                "mousedown",
                clickFueraDelModal
            );
        };
    }, [modalAbierto, onCerrarModal]);

    const cambiarMedida = (nombreMedida, valor) => {
        setMedidas((prev) => ({
            ...prev,
            [nombreMedida]: valor,
        }));
    };

    const guardarMedidas = () => {
        if (!producto) {
            return;
        }
        onEditarMedidas(medidas);
        onCerrarModal();
    };

    if (!modalAbierto || !producto) {
        return null;
    }
    const listaMedidas =
        producto.medidas_asig instanceof Map
            ? Array.from(producto.medidas_asig.keys())
            : Object.keys(producto.medidas_asig || {});
    return (
        <div className="modalMedidasOverlay">
            <div
                className="modalMedidas"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modalMedidasTitle"
                ref={RefAreaDelModal}
            >
                <header className="modalMedidasHeader">
                    <div>
                        <h2
                            id="modalMedidasTitle"
                            className="modalMedidasTitle"
                        >
                            {producto.nombre}
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="modalMedidasClose"
                        onClick={onCerrarModal}
                        aria-label="Cerrar"
                    >
                        <X size={17} strokeWidth={2} />
                    </button>
                </header>

                <div className="modalMedidasContent">
                    {listaMedidas.length === 0 ? (
                        <p className="modalMedidasSinDatos">
                            Este producto no tiene medidas configuradas.
                        </p>
                    ) : (
                        <div className="modalMedidasLista">
                            {listaMedidas.map((nombreMedida) => (
                                <div
                                    className="modalMedidasField"
                                    key={nombreMedida}
                                >
                                    <label
                                        htmlFor={`medida-${nombreMedida}`}
                                    >
                                        {nombreMedida}
                                    </label>

                                    <input
                                        id={`medida-${nombreMedida}`}
                                        type="text"
                                        value={medidas[nombreMedida] ?? ""}
                                        placeholder="Sin medidas asignadas"
                                        autoComplete="off"
                                        maxLength={56}
                                        onChange={(event) =>
                                            cambiarMedida(
                                                nombreMedida,
                                                event.target.value
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <footer className="modalMedidasActions">
                    <button
                        type="button"
                        className="modalMedidasButton modalMedidasButtonCancel"
                        onClick={onCerrarModal}

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
                        className="modalMedidasButton modalMedidasButtonPrimary"
                        onClick={guardarMedidas}
                    >
                        <CircleCheck
                            size={17}
                            strokeWidth={2}
                        />

                        <span>
                            Guardar medidas
                        </span>
                    </button>
                </footer>
            </div>
        </div>
    );
}