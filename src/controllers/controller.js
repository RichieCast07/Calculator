class ControladorCargas {
  constructor(modelo, vista) {
    this.modelo = modelo;
    this.vista = vista;
    
    this.vista.bindAgregarCarga(this.handleAgregarCarga);
    this.vista.bindLimpiarTodo(this.handleLimpiarTodo);
    this.vista.bindConversion(this.handleConversion);

    this.actualizarVistaCompleta();
  }

  handleAgregarCarga = () => {
    const datos = this.vista.obtenerDatosCarga();
    if (datos.valor === 0) {
      this.vista.mostrarNotificacion('El valor de la carga no puede ser cero.', 'error');
      return;
    }
    
    this.modelo.agregarCarga(datos.valor, datos.unidad);
    this.actualizarVistaCompleta();
    this.vista.limpiarFormularioCarga();
  }

  handleEliminarCarga = (id) => {
    this.modelo.eliminarCarga(id);
    this.actualizarVistaCompleta();
  }

  handleSeleccionarCarga = (id) => {
    this.modelo.toggleSeleccionCarga(id);
    this.actualizarVistaCompleta();
  }

  handleLimpiarTodo = () => {
    this.modelo.limpiarCargas();
    this.actualizarVistaCompleta();
    this.vista.mostrarNotificacion('Se han eliminado todas las cargas.', 'info');
  }

  handleConversion = () => {
    const datos = this.vista.obtenerDatosConversion();
    if (isNaN(datos.valor)) {
      this.vista.mostrarResultadoConversion('');
      return;
    }
    
    const resultado = this.modelo.convertirCarga(datos.valor, datos.origen, datos.destino);
    const textoResultado = `${resultado.toExponential(5)} ${datos.destino}`;
    this.vista.mostrarResultadoConversion(textoResultado);
  }

  actualizarVistaCompleta = () => {
    const cargas = this.modelo.obtenerCargas();
    const statsGlobales = this.modelo.obtenerEstadisticasGlobales();
    const statsSeleccion = this.modelo.obtenerEstadisticasSeleccionadas();
    
    this.vista.actualizarListaCargas(
        cargas, 
        this.handleSeleccionarCarga, 
        this.handleEliminarCarga
    );
    this.vista.mostrarEstadisticasGlobales(statsGlobales);
    this.vista.mostrarCalculoSeleccion(statsSeleccion);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ControladorCargas(new ModeloCargas(), new VistaCargas());
});