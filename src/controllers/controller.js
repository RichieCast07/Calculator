class ControladorCoulomb {
  constructor(modelo, vista) {
    this.modelo = modelo;
    this.vista = vista;
    this.configurarEventos();
    this.inicializar();
  }

  configurarEventos() {
    this.vista.elementos.agregarCarga.addEventListener('click', () => {
      this.agregarCarga();
    });

    this.vista.elementos.calcular.addEventListener('click', () => {
      this.calcularFuerzas();
    });

    this.vista.elementos.nuevaCarga.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.agregarCarga();
    });

    this.vista.elementos.posX.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.agregarCarga();
    });

    this.vista.elementos.posY.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.agregarCarga();
    });
  }

  inicializar() {
    this.actualizarVista();
    
    this.vista.elementos.nuevaCarga.focus();
    
    this.vista.elementos.resultados.innerHTML = `
      <div class="text-center text-gray-500 py-8">
        <div class="text-6xl mb-4">⚡</div>
        <h3 class="text-lg font-semibold mb-2">Calculadora Ley de Coulomb</h3>
        <p>Agrega cargas eléctricas para comenzar los cálculos</p>
        <p class="text-sm mt-2 text-gray-400">F = k × (q₁ × q₂) / r²</p>
      </div>
    `;
  }

  agregarCarga() {
    try {
      const datos = this.vista.obtenerDatosCarga();
      
      if (datos.valor === 0) {
        this.vista.mostrarError('El valor de la carga no puede ser cero');
        return;
      }

      if (isNaN(datos.valor) || isNaN(datos.x) || isNaN(datos.y)) {
        this.vista.mostrarError('Por favor ingresa valores numéricos válidos');
        return;
      }

      const cargas = this.modelo.obtenerCargas();
      const posicionOcupada = cargas.some(carga => {
        const xEnM = this.modelo.convertirDistancia(datos.x, datos.unidadPos, 'm');
        const yEnM = this.modelo.convertirDistancia(datos.y, datos.unidadPos, 'm');
        return Math.abs(carga.x - xEnM) < 1e-10 && Math.abs(carga.y - yEnM) < 1e-10;
      });

      if (posicionOcupada) {
        this.vista.mostrarError('Ya existe una carga en esa posición');
        return;
      }

      this.modelo.agregarCarga(datos.valor, datos.unidad, datos.x, datos.y, datos.unidadPos);
      
      this.actualizarVista();
      this.vista.limpiarFormularioCarga();
      
      this.mostrarMensajeExito(`Carga agregada: ${datos.valor} ${datos.unidad} en (${datos.x}, ${datos.y}) ${datos.unidadPos}`);
      
    } catch (error) {
      this.vista.mostrarError('Error al agregar la carga: ' + error.message);
    }
  }

  eliminarCarga(id) {
    try {
      this.modelo.eliminarCarga(id);
      this.actualizarVista();
      this.mostrarMensajeExito('Carga eliminada correctamente');
    } catch (error) {
      this.vista.mostrarError('Error al eliminar la carga: ' + error.message);
    }
  }

  calcularFuerzas() {
    try {
      const errores = this.modelo.validarConfiguracion();
      if (errores.length > 0) {
        this.vista.mostrarError(errores[0]);
        return;
      }

      const tipoCalculo = this.vista.obtenerTipoCalculo();
      const unidadResultado = this.vista.obtenerUnidadResultado();
      let resultados = [];

      switch (tipoCalculo) {
        case 'pares':
          resultados = this.modelo.calcularTodasLasFuerzasPares();
          break;
        
        case 'resultante':
          resultados = this.modelo.calcularTodasLasFuerzasResultantes();
          break;
        
        case 'especifica':
          const indice = this.vista.obtenerCargaEspecifica();
          const fuerzaEspecifica = this.modelo.calcularFuerzaResultante(indice);
          if (fuerzaEspecifica) {
            resultados = [{
              tipo: 'resultante',
              carga: indice,
              fuerza: fuerzaEspecifica
            }];
          }
          break;
      }

      resultados = this.convertirResultados(resultados, unidadResultado);

      this.vista.mostrarResultados(resultados, unidadResultado, tipoCalculo);
      
      const stats = this.modelo.obtenerEstadisticas();
      if (stats && stats.totalCargas >= 2) {
        this.vista.mostrarEstadisticas(stats);
      }

      this.verificarAdvertencias(resultados);

    } catch (error) {
      this.vista.mostrarError('Error en los cálculos: ' + error.message);
    }
  }

  convertirResultados(resultados, unidadDestino) {
    return resultados.map(resultado => {
      if (resultado.fuerza) {
        const fuerza = { ...resultado.fuerza };
        
        fuerza.magnitud = this.modelo.convertirFuerza(fuerza.magnitud, unidadDestino);
        fuerza.fx = this.modelo.convertirFuerza(fuerza.fx, unidadDestino);
        fuerza.fy = this.modelo.convertirFuerza(fuerza.fy, unidadDestino);
        
        if (fuerza.fuerzasIndividuales) {
          fuerza.fuerzasIndividuales = fuerza.fuerzasIndividuales.map(fi => ({
            ...fi,
            fuerza: {
              ...fi.fuerza,
              magnitud: this.modelo.convertirFuerza(fi.fuerza.magnitud, unidadDestino),
              fx: this.modelo.convertirFuerza(fi.fuerza.fx, unidadDestino),
              fy: this.modelo.convertirFuerza(fi.fuerza.fy, unidadDestino)
            }
          }));
        }
        
        return { ...resultado, fuerza };
      }
      return resultado;
    });
  }

  verificarAdvertencias(resultados) {
    const fuerzasGrandes = resultados.filter(r => 
      r.fuerza && r.fuerza.magnitud > 1e6
    );
    
    if (fuerzasGrandes.length > 0) {
      this.vista.mostrarAdvertencia('Se detectaron fuerzas muy grandes. Verifica las distancias y valores de carga.');
    }

    const cargas = this.modelo.obtenerCargas();
    let distanciaMinima = Infinity;
    
    for (let i = 0; i < cargas.length; i++) {
      for (let j = i + 1; j < cargas.length; j++) {
        const dist = this.modelo.calcularDistancia(cargas[i], cargas[j]);
        if (dist < distanciaMinima) {
          distanciaMinima = dist;
        }
      }
    }
    
    if (distanciaMinima < 0.001) {
      this.vista.mostrarAdvertencia('Algunas cargas están muy cerca entre sí. Esto puede resultar en fuerzas extremadamente grandes.');
    }
  }

  actualizarVista() {
    const cargas = this.modelo.obtenerCargas();
    this.vista.actualizarListaCargas(cargas);
    
    const puedeCalcular = cargas.length >= 2;
    this.vista.elementos.calcular.disabled = !puedeCalcular;
    this.vista.elementos.calcular.className = puedeCalcular 
      ? "w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
      : "w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed";
  }

  mostrarMensajeExito(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full';
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
      notificacion.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
      notificacion.classList.add('translate-x-full');
      setTimeout(() => {
        if (notificacion.parentNode) {
          notificacion.parentNode.removeChild(notificacion);
        }
      }, 300);
    }, 3000);
  }

  convertirCarga(valor, unidadOrigen, unidadDestino) {
    return this.modelo.convertirCarga(valor, unidadOrigen, unidadDestino);
  }

  convertirDistancia(valor, unidadOrigen, unidadDestino) {
    return this.modelo.convertirDistancia(valor, unidadOrigen, unidadDestino);
  }

  limpiarTodo() {
    this.modelo.limpiarCargas();
    this.actualizarVista();
    this.vista.limpiarResultados();
    this.inicializar();
  }

  obtenerDatosSistema() {
    const cargas = this.modelo.obtenerCargas();
    const stats = this.modelo.obtenerEstadisticas();
    
    return {
      cargas: cargas.map(c => ({
        valor: c.valorOriginal,
        unidad: c.unidadOriginal,
        x: c.xOriginal,
        y: c.yOriginal,
        unidadPos: c.unidadPosOriginal
      })),
      estadisticas: stats,
      timestamp: new Date().toISOString()
    };
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const modelo = new ModeloCoulomb();
  const vista = new VistaCoulomb();
  
  window.controlador = new ControladorCoulomb(modelo, vista);
  
  console.log('Calculadora Ley de Coulomb inicializada correctamente');
});