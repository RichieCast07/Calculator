class ModeloCoulomb {
  constructor() {
    this.k = 8.99e9; 
    this.cargas = [];
  }

  convertirCarga(valor, unidadOrigen, unidadDestino) {
    const factoresCarga = {
      'C': 1,
      'mC': 1e-3,
      'μC': 1e-6,
      'nC': 1e-9,
      'pC': 1e-12
    };
    
    const valorEnC = valor * factoresCarga[unidadOrigen];
    return valorEnC / factoresCarga[unidadDestino];
  }

  convertirDistancia(valor, unidadOrigen, unidadDestino) {
    const factoresDistancia = {
      'km': 1000,
      'm': 1,
      'cm': 0.01,
      'mm': 0.001
    };
    
    const valorEnM = valor * factoresDistancia[unidadOrigen];
    return valorEnM / factoresDistancia[unidadDestino];
  }

  convertirFuerza(valor, unidadDestino) {
    const factoresFuerza = {
      'N': 1,
      'mN': 1e3,
      'μN': 1e6,
      'nN': 1e9
    };
    
    return valor * factoresFuerza[unidadDestino];
  }

  agregarCarga(carga, unidad, x, y, unidadPos) {
    const cargaEnC = this.convertirCarga(carga, unidad, 'C');
    const xEnM = this.convertirDistancia(x, unidadPos, 'm');
    const yEnM = this.convertirDistancia(y, unidadPos, 'm');
    
    this.cargas.push({
      id: Date.now(),
      valor: cargaEnC,
      valorOriginal: carga,
      unidadOriginal: unidad,
      x: xEnM,
      y: yEnM,
      xOriginal: x,
      yOriginal: y,
      unidadPosOriginal: unidadPos
    });
  }

  eliminarCarga(id) {
    this.cargas = this.cargas.filter(carga => carga.id !== id);
  }

  obtenerCargas() {
    return this.cargas;
  }

  limpiarCargas() {
    this.cargas = [];
  }

  calcularDistancia(carga1, carga2) {
    const dx = carga1.x - carga2.x;
    const dy = carga1.y - carga2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  calcularFuerzaEntreDos(carga1, carga2) {
    const distancia = this.calcularDistancia(carga1, carga2);
    if (distancia === 0) return { magnitud: 0, fx: 0, fy: 0, distancia: 0 };

    const magnitud = Math.abs((this.k * carga1.valor * carga2.valor) / (distancia * distancia));
    
    const dx = carga2.x - carga1.x;
    const dy = carga2.y - carga1.y;
    const factor = magnitud / distancia;
    
    const signo = (carga1.valor * carga2.valor > 0) ? -1 : 1;
    
    return {
      magnitud: magnitud,
      fx: signo * factor * dx,
      fy: signo * factor * dy,
      distancia: distancia,
      esRepulsiva: carga1.valor * carga2.valor > 0
    };
  }

  calcularFuerzaResultante(indice) {
    if (indice >= this.cargas.length) return null;
    
    const cargaObjetivo = this.cargas[indice];
    let fx = 0, fy = 0;
    const fuerzasIndividuales = [];
    
    for (let i = 0; i < this.cargas.length; i++) {
      if (i !== indice) {
        const fuerza = this.calcularFuerzaEntreDos(cargaObjetivo, this.cargas[i]);
        fx += fuerza.fx;
        fy += fuerza.fy;
        fuerzasIndividuales.push({
          desdeCarga: i,
          fuerza: fuerza
        });
      }
    }
    
    const magnitud = Math.sqrt(fx * fx + fy * fy);
    const angulo = Math.atan2(fy, fx) * 180 / Math.PI;
    
    return { 
      magnitud, 
      fx, 
      fy, 
      angulo, 
      fuerzasIndividuales 
    };
  }

  calcularTodasLasFuerzasPares() {
    const resultados = [];
    
    for (let i = 0; i < this.cargas.length; i++) {
      for (let j = i + 1; j < this.cargas.length; j++) {
        const fuerza = this.calcularFuerzaEntreDos(this.cargas[i], this.cargas[j]);
        resultados.push({
          tipo: 'par',
          carga1: i,
          carga2: j,
          fuerza: fuerza
        });
      }
    }
    
    return resultados;
  }

  calcularTodasLasFuerzasResultantes() {
    const resultados = [];
    
    for (let i = 0; i < this.cargas.length; i++) {
      const fuerzaResultante = this.calcularFuerzaResultante(i);
      resultados.push({
        tipo: 'resultante',
        carga: i,
        fuerza: fuerzaResultante
      });
    }
    
    return resultados;
  }

  calcularTodasLasFuerzas() {
    const resultados = [];
    
    const pares = this.calcularTodasLasFuerzasPares();
    resultados.push(...pares);
    
    const resultantes = this.calcularTodasLasFuerzasResultantes();
    resultados.push(...resultantes);
    
    return resultados;
  }

  obtenerEstadisticas() {
    if (this.cargas.length === 0) return null;

    const cargasPositivas = this.cargas.filter(c => c.valor > 0).length;
    const cargasNegativas = this.cargas.filter(c => c.valor < 0).length;
    const cargaTotal = this.cargas.reduce((sum, c) => sum + c.valorOriginal, 0);
    
    const fuerzasPares = this.calcularTodasLasFuerzasPares();
    const fuerzaMaxima = fuerzasPares.length > 0 ? 
      Math.max(...fuerzasPares.map(f => f.fuerza.magnitud)) : 0;
    
    return {
      totalCargas: this.cargas.length,
      cargasPositivas,
      cargasNegativas,
      cargaTotal,
      fuerzaMaxima
    };
  }

  validarConfiguracion() {
    const errores = [];
    
    if (this.cargas.length < 2) {
      errores.push('Se necesitan al menos 2 cargas para realizar cálculos');
    }
    
    for (let i = 0; i < this.cargas.length; i++) {
      for (let j = i + 1; j < this.cargas.length; j++) {
        const distancia = this.calcularDistancia(this.cargas[i], this.cargas[j]);
        if (distancia < 1e-10) {
          errores.push(`Las cargas ${i + 1} y ${j + 1} están en la misma posición`);
        }
      }
    }
    
    return errores;
  }
}