class ModeloCargas {
  constructor() {
    this.cargas = [];
    this.nextId = 0;
    this.factoresCarga = { 'C': 1, 'mC': 1e-3, 'μC': 1e-6, 'nC': 1e-9, 'pC': 1e-12 };
    this.factoresDistancia = { 'm': 1, 'cm': 1e-2, 'mm': 1e-3 };
  }

  convertirUnidad(valor, factores, origen, destino) {
    if (!factores[origen] || !factores[destino]) return 0;
    const valorEnBase = valor * factores[origen];
    return valorEnBase / factores[destino];
  }

  agregarCarga(valor, unidadCarga, x, y, unidadPos) {
    const nuevaCarga = {
      id: this.nextId++,
      valorOriginal: valor,
      unidadOriginal: unidadCarga,
      valorEnCoulombs: this.convertirUnidad(valor, this.factoresCarga, unidadCarga, 'C'),
      xOriginal: x,
      yOriginal: y,
      unidadPosOriginal: unidadPos,
      xEnMetros: this.convertirUnidad(x, this.factoresDistancia, unidadPos, 'm'),
      yEnMetros: this.convertirUnidad(y, this.factoresDistancia, unidadPos, 'm'),
      isSelected: false,
    };
    this.cargas.push(nuevaCarga);
  }

  eliminarCarga(id) {
    this.cargas = this.cargas.filter(c => c.id !== id);
  }

  toggleSeleccionCarga(id) {
    const carga = this.cargas.find(c => c.id === id);
    if (carga) {
      carga.isSelected = !carga.isSelected;
    }
  }

  obtenerCargas() {
    return [...this.cargas];
  }

  limpiarCargas() {
    this.cargas = [];
    this.nextId = 0;
  }
  
  _calcularEstadisticas(cargasArray) {
    if (cargasArray.length === 0) {
      return { totalCargas: 0, cargaNeta: 0 };
    }
    const cargaNeta = cargasArray.reduce((sum, c) => sum + c.valorEnCoulombs, 0);
    return {
      totalCargas: cargasArray.length,
      cargaNeta,
    };
  }

  obtenerEstadisticasGlobales() {
    return this._calcularEstadisticas(this.cargas);
  }

  obtenerEstadisticasSeleccionadas() {
    const cargasSeleccionadas = this.cargas.filter(c => c.isSelected);
    return this._calcularEstadisticas(cargasSeleccionadas);
  }
}