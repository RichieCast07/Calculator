class ModeloCargas {
  constructor() {
    this.cargas = [];
    this.nextId = 0;
    this.k = 8.9875517923e9; 
    this.factoresCarga = { 'C': 1, 'mC': 1e-3, 'μC': 1e-6, 'nC': 1e-9, 'pC': 1e-12 };
    this.factoresDistancia = { 'm': 1, 'cm': 1e-2, 'mm': 1e-3 };
  }

  convertirUnidad(valor, factores, origen, destino) {
    if (!factores[origen] || !factores[destino]) return 0;
    const valorEnBase = valor * factores[origen];
    return valorEnBase / factores[destino];
  }

  agregarCarga(valor, unidadCarga, x, y, z, unidadPos) {
    this.cargas.push({
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
      isSelected: true,
    });
  }

  toggleSeleccionCarga(id) {
    const carga = this.cargas.find(c => c.id === id);
    if (carga) carga.isSelected = !carga.isSelected;
  }
  
  obtenerCargasSeleccionadas = () => this.cargas.filter(c => c.isSelected);
  
  calcularCampoElectricoResultante(puntoDeCalculo) {
    const cargasSeleccionadas = this.obtenerCargasSeleccionadas();
    let campoTotal = { x: 0, y: 0, z: 0 };
    const contribuciones = [];

    for (const [index, carga] of cargasSeleccionadas.entries()) {
      const vectorR = {
        x: puntoDeCalculo.x - carga.posEnMetros.x,
        y: puntoDeCalculo.y - carga.posEnMetros.y,
        z: puntoDeCalculo.z - carga.posEnMetros.z,
      };

      const magnitudR = Math.sqrt(vectorR.x**2 + vectorR.y**2 + vectorR.z**2);
      if (magnitudR < 1e-12) continue;
      
      const unitarioR = {
        x: vectorR.x / magnitudR,
        y: vectorR.y / magnitudR,
        z: vectorR.z / magnitudR
      };
      
      const magnitudE = (this.k * carga.valorEnCoulombs) / (magnitudR**2);

      const campoIndividual = {
        x: magnitudE * unitarioR.x,
        y: magnitudE * unitarioR.y,
        z: magnitudE * unitarioR.z
      };
      
      campoTotal.x += campoIndividual.x;
      campoTotal.y += campoIndividual.y;
      campoTotal.z += campoIndividual.z;

      contribuciones.push({
          cargaIndex: this.cargas.indexOf(carga) + 1,
          vectorR,
          magnitudR,
          campoIndividual
      });
    }

    const magnitudTotal = Math.sqrt(campoTotal.x**2 + campoTotal.y**2 + campoTotal.z**2);
    let unitarioTotal = { x: 0, y: 0, z: 0 };
    if (magnitudTotal > 1e-12) {
      unitarioTotal = {
        x: campoTotal.x / magnitudTotal,
        y: campoTotal.y / magnitudTotal,
        z: campoTotal.z / magnitudTotal,
      };
    }

    return {
      campoVector: campoTotal,
      magnitud: magnitudTotal,
      unitario: unitarioTotal,
      contribuciones
    };
  }
  
  obtenerCargas = () => [...this.cargas];
  limpiarCargas() { this.cargas = []; this.nextId = 0; }
}