class ModeloCargas {
  constructor() {
    this.cargas = [];
    this.nextId = 0;
    this.k = 8.9875517923e9; // Constante de Coulomb N·m²/C²
    this.factoresCarga = { 'C': 1, 'mC': 1e-3, 'μC': 1e-6, 'nC': 1e-9, 'pC': 1e-12 };
    this.factoresDistancia = { 'm': 1, 'cm': 1e-2, 'mm': 1e-3 };
  }

  convertirUnidad(valor, factores, origen, destino) {
    if (!factores[origen] || !factores[destino]) return 0;
    const valorEnBase = valor * factores[origen];
    return valorEnBase / factores[destino];
  }

  agregarCarga(valor, unidadCarga, x, y, z, unidadPos) {
    const nuevaCarga = {
      id: this.nextId++,
      valorOriginal: valor,
      unidadOriginal: unidadCarga,
      valorEnCoulombs: this.convertirUnidad(valor, this.factoresCarga, unidadCarga, 'C'),
      xOriginal: x, yOriginal: y, zOriginal: z,
      unidadPosOriginal: unidadPos,
      posEnMetros: {
        x: this.convertirUnidad(x, this.factoresDistancia, unidadPos, 'm'),
        y: this.convertirUnidad(y, this.factoresDistancia, unidadPos, 'm'),
        z: this.convertirUnidad(z, this.factoresDistancia, unidadPos, 'm'),
      },
      isSelected: true, // Por defecto, la nueva carga se selecciona para el cálculo
    };
    this.cargas.push(nuevaCarga);
  }

  eliminarCarga(id) {
    this.cargas = this.cargas.filter(c => c.id !== id);
  }

  toggleSeleccionCarga(id) {
    const carga = this.cargas.find(c => c.id === id);
    if (carga) carga.isSelected = !carga.isSelected;
  }
  
  obtenerCargasSeleccionadas() {
      return this.cargas.filter(c => c.isSelected);
  }
  
  calcularCampoElectricoResultante(puntoDeCalculo) {
    const cargasSeleccionadas = this.obtenerCargasSeleccionadas();
    let campoTotal = { x: 0, y: 0, z: 0 };

    for (const carga of cargasSeleccionadas) {
      const vectorR = {
        x: puntoDeCalculo.x - carga.posEnMetros.x,
        y: puntoDeCalculo.y - carga.posEnMetros.y,
        z: puntoDeCalculo.z - carga.posEnMetros.z,
      };

      const distanciaR = Math.sqrt(vectorR.x**2 + vectorR.y**2 + vectorR.z**2);
      if (distanciaR < 1e-9) continue; // Si el punto es la misma carga, su campo es infinito. Lo omitimos.
      
      const magnitudR_cubed = distanciaR**3;
      const factor = (this.k * carga.valorEnCoulombs) / magnitudR_cubed;

      campoTotal.x += factor * vectorR.x;
      campoTotal.y += factor * vectorR.y;
      campoTotal.z += factor * vectorR.z;
    }

    const magnitudCampo = Math.sqrt(campoTotal.x**2 + campoTotal.y**2 + campoTotal.z**2);
    let vectorUnitario = { x: 0, y: 0, z: 0 };

    if (magnitudCampo > 1e-9) {
      vectorUnitario = {
        x: campoTotal.x / magnitudCampo,
        y: campoTotal.y / magnitudCampo,
        z: campoTotal.z / magnitudCampo,
      };
    }

    return {
      campoVector: campoTotal,
      magnitud: magnitudCampo,
      unitario: vectorUnitario,
      netCharge: cargasSeleccionadas.reduce((sum, c) => sum + c.valorEnCoulombs, 0),
      count: cargasSeleccionadas.length
    };
  }

  obtenerCargas() { return [...this.cargas]; }
  limpiarCargas() { this.cargas = []; this.nextId = 0; }
}