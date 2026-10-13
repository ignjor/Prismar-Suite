import { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './GenerarEtiqueta.css';

export default function GenerarEtiqueta({ pedido, onClose }) {
  const appUrl = import.meta.env.VITE_PUBLIC_APP_URL;
  const urlPedido = `${appUrl}/pedido/${pedido.id}`;

  const formatearPrecio = (valor) => {
    return `$${Number(valor || 0).toLocaleString("es-CL")}`;
  };
  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";
    if (typeof fecha === "string" && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      const [anio, mes, dia] = fecha.split("-");
      return `${dia}-${mes}-${anio}`;
    }
    return fecha;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
      setTimeout(() => {
        onClose();
      }, 1000);
    }, 500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="etiqueta-print-container">
      <div className="etiqueta-top-bar"></div>
      <div className="etiqueta-header">
        <div className="etiqueta-titulo-seccion">
          <h2>PRISMAR SUITE</h2> 
          <p>PRISMAR CONFECCIONES</p>
        </div>
        <div className="etiqueta-qr-box">
          <QRCodeSVG value={urlPedido} size={130} level="H" />
        </div>
      </div>
        <div className="etiqueta-titulo-seccion">
          <p>ORDEN DE PEDIDO</p>
        </div>
      <div className="etiqueta-datos-grid">
        <div className="dato-item">
          <span className="dato-label">CLIENTE</span>
          <span className="dato-valor">{pedido.cliente || "Sin cliente"}</span>
        </div>
        <div className="dato-item">
          <span className="dato-label">PEDIDO N°</span>
          <span className="dato-valor">{pedido.numero_pedido || pedido.id}</span>
        </div>
        <div className="dato-item">
          <span className="dato-label">TELÉFONO</span>
          <span className="dato-valor">{pedido.telefono || "Sin número"}</span>
        </div>
        <div className="dato-item">
          <span className="dato-label">FECHA ENTREGA</span>
          <span className="dato-valor">{formatearFecha(pedido.fecha_entrega)}</span>
        </div>
        <div className="dato-item">
          <span className="dato-label">COLEGIO / EMPRESA</span>
          <span className="dato-valor">{pedido.colegio || "Sin afiliado"}</span>
        </div>
      </div>

      <div className="etiqueta-seccion-productos">
        <h3>RESUMEN DE PEDIDO</h3>
        <table className="etiqueta-tabla">
          <thead>
            <tr>
              <th>PRODUCTO</th>
              <th>COL. / EMPR.</th>
              <th>TALLA / MEDIDA</th>
              <th>CANT.</th>
              <th>PRECIO UNI.</th>
            </tr>
          </thead>
          <tbody>
            {(pedido.productos || []).map((prod, idx) => (
              <tr key={prod.id || idx}>
                <td>{prod.nombre || "Producto"}</td>
                <td style={{ textTransform: "uppercase" }}>{prod.colegio}</td>
                <td>{prod.talla || "-"}</td>
                <td>{prod.cantidad || 0}</td>
                <td>{formatearPrecio(prod.precio_talla)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="etiqueta-footer">
        <div className="total-box">
          <span className="total-label">TOTAL DEL PEDIDO</span>
          <span className="total-valor">{formatearPrecio(pedido.total_pedido)}</span>
        </div>
      </div>
    </div>
  );
}