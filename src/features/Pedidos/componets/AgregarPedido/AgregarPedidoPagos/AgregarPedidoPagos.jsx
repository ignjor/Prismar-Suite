import "./AgregarPedidoPagos.css";
import { useMemo, useState } from "react";
import { useCuentas } from "../../../../Cuentas/querys/useCuentas";

import { Trash2, Ghost, Pencil, FileText, CreditCard, CalendarDays } from "lucide-react";
import ModalAgregarEditarPago from "../../ModalAgregarEditarPago/ModalAgregarEditarPago";

export default function AgregarPedidoPagos({ pagosAgregados = [], onPagosChange, totalPedido = 0 }) {
    const [error, setError] = useState("");
    const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
    const [pagoEditar, setPagoEditar] = useState(null);

    const { data: cuentasBancarias = [] } = useCuentas();

    const cuentasBancariasPorId = useMemo(() => {
        return new Map(
            cuentasBancarias.map((cuenta) => [
                cuenta.id,
                cuenta
            ])
        );
    }, [cuentasBancarias]);

    const totalNumerico = Number(totalPedido || 0);

    const totalPagado = pagosAgregados.reduce(
        (total, pago) =>
            total + Number(pago.total_pago || 0),
        0
    );

    const saldoPendiente = Math.max(
        totalNumerico - totalPagado,
        0
    );

    const porcentajePagado = totalNumerico > 0
        ? (totalPagado / totalNumerico) * 100
        : 0;

    const porcentajePendiente = totalNumerico > 0
        ? (saldoPendiente / totalNumerico) * 100
        : 0;

    const abrirAgregarPago = () => {
        setError("");
        setPagoEditar(null);
        setModalPagoAbierto(true);
    };

    const abrirEditarPago = (pago, index) => {
        setError("");
        setPagoEditar({
            ...pago,
            _index: index
        });
        setModalPagoAbierto(true);
    };

    const cerrarModalPago = () => {
        setModalPagoAbierto(false);
        setPagoEditar(null);
    };

    const agregarPago = (pago) => {
        if (!pago) {
            return;
        }

        const nuevosPagos = [
            ...pagosAgregados,
            pago
        ];

        onPagosChange(nuevosPagos);
        cerrarModalPago();
        setError("");
    };

    const editarPago = (pago) => {
        if (!pago || pago._index === undefined) {
            return;
        }

        const nuevosPagos = pagosAgregados.map(
            (pagoActual, index) =>
                index === pago._index
                    ? {
                        ...pago,
                        _index: undefined
                    }
                    : pagoActual
        ).map((pagoActual) => {
            const nuevoPago = {
                ...pagoActual
            };

            delete nuevoPago._index;

            return nuevoPago;
        });

        onPagosChange(nuevosPagos);
        cerrarModalPago();
        setError("");
    };

    const guardarPago = (pago) => {
        if (!pago) {
            return;
        }

        if (
            pago._index !== undefined &&
            pago._index !== null
        ) {
            editarPago(pago);
            return;
        }

        agregarPago(pago);
    };

    const eliminarPago = (index) => {
        const nuevosPagos = pagosAgregados.filter(
            (_, i) => i !== index
        );

        onPagosChange(nuevosPagos);
        setError("");
    };

    const formatearFecha = (fecha) => {
        if (!fecha) {
            return "Sin fecha";
        }

        const partes = fecha.split("-");

        if (partes.length !== 3) {
            return fecha;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    };
    return (
        <section className="agregarPedidoPagos">
            <div className="agregarPedidoPagosHeader">
                <div>
                    <span className="agregarPedidoPagosEyebrow">
                        PAGOS Y ABONOS DEL PEDIDO
                    </span>
                    <div className="agregarPedidoPagosResumenSuperior">
                        <span>
                            Total: <strong> ${totalNumerico.toLocaleString("es-CL")} </strong>
                        </span>
                        <span>
                            Pagado: <strong> %{porcentajePagado.toFixed(2)} - ${totalPagado.toLocaleString("es-CL")} </strong>
                        </span>
                        <span>
                            Pendiente: <strong> %{porcentajePendiente.toFixed(2)} - ${saldoPendiente.toLocaleString("es-CL")} </strong>
                        </span>
                    </div>
                </div>
                <button
                    type="button"
                    className="agregarPedidoPagosButton"
                    onClick={abrirAgregarPago}
                >
                    <span>
                        Agregar pago
                    </span>
                </button>
            </div>
            {error && (
                <p className="agregarPedidoPagosError">
                    {error}
                </p>
            )}
            <div className="agregarPedidoPagosLista">
                {pagosAgregados.length === 0 ? (
                    <div className="agregarPedidoPagosEmpty">
                        <div>
                            <h3>
                                <Ghost
                                    size={17}
                                    strokeWidth={1.5}
                                />
                                No hay pagos por aquí
                            </h3>
                        </div>
                    </div>
                ) : (
                    pagosAgregados.map((pago, index) => {
                        const monto = Number(
                            pago.total_pago || 0
                        );
                        const porcentaje = totalNumerico > 0
                            ? (monto / totalNumerico) * 100
                            : Number(pago.porcentaje_pago || 0);
                        const cuentaBancaria =
                            cuentasBancariasPorId.get(
                                pago.cuenta_bancaria_id
                            );
                        return (
                            <article
                                className="agregarPedidoPagoItem"
                                key={pago.id || `pago-${index}`}
                            >
                                <div className="agregarPedidoPagoIcono">
                                    <CreditCard
                                        size={19}
                                        strokeWidth={1.7}
                                    />
                                </div>
                                <div className="agregarPedidoPagoContenido">
                                    <div className="agregarPedidoPagoPrincipal">
                                        <h3>
                                            ${monto.toLocaleString("es-CL")}
                                        </h3>
                                    </div>
                                    <div className="agregarPedidoPagoMeta">
                                        <span>
                                            <CalendarDays
                                                size={13}
                                                strokeWidth={1.8}
                                            />
                                            {formatearFecha(
                                                pago.fecha_pago
                                            )}
                                        </span>
                                        <span>
                                            <CreditCard
                                                size={13}
                                                strokeWidth={1.8}
                                            />
                                            {cuentaBancaria?.nombre ||
                                                "Sin cuenta bancaria"}
                                        </span>
                                    </div>
                                    {(
                                        pago.comprobante_archivo ||
                                        pago.comprobante_blob ||
                                        pago.comprobante_url ||
                                        pago.comprobante_path
                                    ) && (
                                        <div className="agregarPedidoPagoComprobante">
                                            <FileText
                                                size={14}
                                                strokeWidth={1.8}
                                            />
                                            <span>
                                                Comprobante adjunto
                                            </span>
                                            <small>
                                                {pago.comprobante_tipo === "pdf"
                                                    ? "PDF"
                                                    : pago.comprobante_tipo === "webp"
                                                        ? "WEBP"
                                                        : "Archivo"}
                                            </small>
                                        </div>
                                    )}
                                </div>
                                <div className="agregarPedidoPagoAcciones">
                                    <button
                                        type="button"
                                        className="agregarPedidoPagoEditar"
                                        onClick={() =>
                                            abrirEditarPago(
                                                pago,
                                                index
                                            )
                                        }
                                        aria-label="Editar pago"
                                    >
                                        <Pencil
                                            size={15}
                                            strokeWidth={1.8}
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        className="agregarPedidoPagoEliminar"
                                        onClick={() =>
                                            eliminarPago(index)
                                        }
                                        aria-label="Eliminar pago"
                                    >
                                        <Trash2
                                            size={16}
                                            strokeWidth={1.8}
                                        />
                                    </button>
                                </div>
                            </article>
                        );
                    })
                )}
            </div>
            
            <ModalAgregarEditarPago
                modalAbierto={modalPagoAbierto}
                onCerrarModal={cerrarModalPago}
                onPagoGuardado={guardarPago}
                pagoEditar={pagoEditar}
                totalPedido={totalNumerico}
            />
        </section>
    );
}