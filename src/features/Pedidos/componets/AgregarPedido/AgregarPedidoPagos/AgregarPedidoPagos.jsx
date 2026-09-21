export default function AgregarPedidoPagos({pagosAgregados, onPagosChange}){
    
  return (
    <section className="agregarPedidoDatosCliente">
      <div className="agregarPedidoDatosClienteHeader">
          <h2 className="agregarPedidoDatosClienteTitulo">
            Pagos y Abonos
          </h2>
      </div>

      <div className="agregarPedidoDatosClienteCampos">


        <div className="agregarPedidoCampo agregarPedidoCampoColegio">
          <label>Selecciona la Cuenta Bancaria a la que hizo el pago</label>
          <button
            type="button"
            className="agregarPedidoColegioSelector agregarPedidoColegioSelectorSeleccionado"
          >
            <span className="agregarPedidoColegioNombre">
              Seleccionar Cuenta
            </span>
          </button>
        </div>
 
        <div className="agregarPedidoCampo agregarPedidoFechaEntrega">
          <label htmlFor="nombreCliente">
            Fecha del pago
          </label>
          <input
            id="nombreCliente"
            type="date"
            autoComplete="off"
          />
        </div>
      </div>
      
    </section>
  );
}