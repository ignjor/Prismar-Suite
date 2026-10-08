import "./AgregarPedidoPagos.css";

import { useMemo, useState } from "react";
import { useCuentas } from "../../../../Cuentas/querys/useCuentas";

import { Trash2, Ghost, Pencil, FileText, CreditCard } from "lucide-react";
import ModalAgregarEditarPago from "../../ModalAgregarEditarPago/ModalAgregarEditarPago";

export default function AgregarPedidoPagos({ pagosAgregados = [], onPagosChange, totalPedido = 0 }) {
    const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
    const [pagoEditar, setPagoEditar] = useState(null);
    const [indicePagoEditar, setIndicePagoEditar] = useState(null);

    const { data: cuentasBancarias = [] } = useCuentas();

    const cuentasBancariasPorId = useMemo(
        () => new Map(cuentasBancarias.map(cuenta => [cuenta.id, cuenta])),
        [cuentasBancarias]
    );

    const totalNumerico = Number(totalPedido || 0);

    const totalPagado = pagosAgregados.reduce(
        (total, pago) => total + Number(pago.total_pago || 0),
        0
    );

    const saldoPendiente = Math.max(totalNumerico - totalPagado, 0);

    const porcentajePagado = totalNumerico > 0
        ? (totalPagado / totalNumerico) * 100
        : 0;

    const porcentajePendiente = totalNumerico > 0
        ? (saldoPendiente / totalNumerico) * 100
        : 0;

    const pagoCompletado = saldoPendiente <= 0;

    const abrirAgregarPago = () => {
        if (pagoCompletado) return;

        setPagoEditar(null);
        setIndicePagoEditar(null);
        setModalPagoAbierto(true);
    };

    const abrirEditarPago = (pago, index) => {
        setPagoEditar(pago);
        setIndicePagoEditar(index);
        setModalPagoAbierto(true);
    };

    const cerrarModalPago = () => {
        setModalPagoAbierto(false);
        setPagoEditar(null);
        setIndicePagoEditar(null);
    };

    const guardarPago = pago => {
        if (!pago) return;

        const nuevosPagos = indicePagoEditar === null
            ? [...pagosAgregados, pago]
            : pagosAgregados.map((pagoActual, index) =>
                index === indicePagoEditar ? pago : pagoActual
            );

        onPagosChange(nuevosPagos);
        cerrarModalPago();
    };

    const eliminarPago = index => {
        const nuevosPagos = pagosAgregados.filter((_, i) => i !== index);
        onPagosChange(nuevosPagos);
    };

    const formatearFecha = fecha => {
        if (!fecha) return "Sin fecha";

        const partes = fecha.split("-");

        if (partes.length !== 3) return fecha;

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
                            Total:{" "}
                            <strong>
                                ${totalNumerico.toLocaleString("es-CL")}
                            </strong>
                        </span>

                        <span>
                            Pagado:{" "}
                            <strong>
                                %{porcentajePagado.toFixed(2)} - $
                                {totalPagado.toLocaleString("es-CL")}
                            </strong>
                        </span>

                        <span>
                            Pendiente:{" "}
                            <strong>
                                %{porcentajePendiente.toFixed(2)} - $
                                {saldoPendiente.toLocaleString("es-CL")}
                            </strong>
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    className="agregarPedidoPagosButton"
                    onClick={abrirAgregarPago}
                    disabled={pagoCompletado}
                >
                    <span>
                        {pagoCompletado ? "SIN PAGOS PENDIENTES" : "AGREGAR PAGO"}
                    </span>
                </button>
            </div>
            <div className="agregarPedidoPagosLista">
                {pagosAgregados.length === 0 ? (
                    <div className="agregarPedidoPagosEmpty">
                        <div>
                            <h3>
                                <Ghost size={17} strokeWidth={1.5} />
                                No hay pagos por aquí
                            </h3>
                        </div>
                    </div>
                ) : (
                    pagosAgregados.map((pago, index) => {
                        const monto = Number(pago.total_pago || 0);
                        const cuentaBancaria = cuentasBancariasPorId.get(pago.cuenta_bancaria_id);

                        return (
                            <article
                                className="agregarPedidoPagoItem"
                                key={pago.id || `pago-${index}`}
                            >
                                <div className="agregarPedidoPagoIcono">
                                    <CreditCard size={19} strokeWidth={1.7} />
                                </div>

                                <div className="agregarPedidoPagoContenido">
                                    <div className="agregarPedidoPagoPrincipal">
                                        <h3>${monto.toLocaleString("es-CL")}</h3>
                                    </div>

                                    <div className="agregarPedidoPagoMeta">
                                        <span>
                                            Cuenta: {cuentaBancaria?.nombre || "Sin cuenta bancaria"}
                                        </span>
                                        <span>
                                            Fecha: {formatearFecha(pago.fecha_pago)}
                                        </span>
                                    </div>

                                    {(pago.comprobante_archivo || pago.comprobante_url || pago.comprobante_path) && (
                                        <div className="agregarPedidoPagoComprobante">
                                            <FileText size={14} strokeWidth={1.8} />

                                            <span>
                                                {pago.comprobante_archivo?.name ||
                                                    pago.comprobante_nombre ||
                                                    "Comprobante"}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="agregarPedidoPagoAcciones">
                                    <button
                                        type="button"
                                        className="agregarPedidoPagoEditar"
                                        onClick={() => abrirEditarPago(pago, index)}
                                        aria-label="Editar pago"
                                    >
                                        <Pencil size={15} strokeWidth={1.8} />
                                    </button>
                                    <button
                                        type="button"
                                        className="agregarPedidoPagoEliminar"
                                        onClick={() => eliminarPago(index)}
                                        aria-label="Eliminar pago"
                                    >
                                        <Trash2 size={16} strokeWidth={1.8} />
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
                totalPedido={
                    pagoEditar
                        ? saldoPendiente + Number(pagoEditar.total_pago || 0)
                        : saldoPendiente
                }
            />
        </section>
    );
}