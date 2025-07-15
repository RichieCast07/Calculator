class ModeloCargas {
  constructor() {
    this.cargas = [];
    this.nextId = 0;
    this.factoresCarga = { 'C': 1, 'mC': 1e-3, 'μC': 1e-6, 'nC': 1e-9, 'pC': 1e-12 };
  }

  convertirCarga(valor, origen, destino) {
    if (!this.factoresCarga[origen] || !this.factoresCarga[destino]) return 0;
    const valorEnCoulombs = valor * this.factoresCarga[origen];
    return valorEnCoulombs / this.factoresCarga[destino];
  }

  agregarCarga(valor, unidad) {
    const nuevaCarga = {
      id: this.nextId++,
      valorOriginal: valor,
      unidadOriginal: unidad,
      valorEnCoulombs: this.convertirCarga(valor, unidad, 'C'),
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
      return { totalCargas: 0, cargaNeta: 0, positivas: 0, negativas: 0 };
    }
    const cargaNeta = cargasArray.reduce((sum, c) => sum + c.valorEnCoulombs, 0);
    const positivas = cargasArray.filter(c => c.valorEnCoulombs > 0).length;
    return {
      totalCargas: cargasArray.length,
      cargaNeta,
      positivas,
      negativas: cargasArray.length - positivas,
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