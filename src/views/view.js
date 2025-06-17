class VistaCoulomb {
  constructor() {
    this.elementos = {
      nuevaCarga: document.getElementById('nuevaCarga'),
      unidadCarga: document.getElementById('unidadCarga'),
      posX: document.getElementById('posX'),
      posY: document.getElementById('posY'),
      unidadPosicion: document.getElementById('unidadPosicion'),
      agregarCarga: document.getElementById('agregarCarga'),
      listaCargas: document.getElementById('listaCargas'),
      
      tipoCalculo: document.getElementById('tipoCalculo'),
      opcionEspecifica: document.getElementById('opcionEspecifica'),
      cargaEspecifica: document.getElementById('cargaEspecifica'),
      unidadResultado: document.getElementById('unidadResultado'),
      calcular: document.getElementById('calcular'),
      resultados: document.getElementById('resultados'),
      
      valorConvertirCarga: document.getElementById('valorConvertirCarga'),
      unidadOrigenCarga: document.getElementById('unidadOrigenCarga'),
      unidadDestinoCarga: document.getElementById('unidadDestinoCarga'),
      resultadoCarga: document.getElementById('resultadoCarga'),
      valorConvertirDistancia: document.getElementById('valorConvertirDistancia'),
      unidadOrigenDistancia: document.getElementById('unidadOrigenDistancia'),
      unidadDestinoDistancia: document.getElementById('unidadDestinoDistancia'),
      resultadoDistancia: document.getElementById('resultadoDistancia')
    };
    
    this.configurarEventos();
  }

  configurarEventos() {
    ['valorConvertirCarga', 'unidadOrigenCarga', 'unidadDestinoCarga'].forEach(id => {
      this.elementos[id].addEventListener('input', () => this.actualizarConversionCarga());
      this.elementos[id].addEventListener('change', () => this.actualizarConversionCarga());
    });
    
    ['valorConvertirDistancia', 'unidadOrigenDistancia', 'unidadDestinoDistancia'].forEach(id => {
      this.elementos[id].addEventListener('input', () => this.actualizarConversionDistancia());
      this.elementos[id].addEventListener('change', () => this.actualizarConversionDistancia());
    });
    
    this.elementos.tipoCalculo.addEventListener('change', () => {
      this.elementos.opcionEspecifica.classList.toggle('hidden', 
        this.elementos.tipoCalculo.value !== 'especifica');
    });

    this.elementos.nuevaCarga.addEventListener('input', this.validarCarga);
    this.elementos.posX.addEventListener('input', this.validarPosicion);
    this.elementos.posY.addEventListener('input', this.validarPosicion);
  }

  obtenerDatosCarga() {
    return {
      valor: parseFloat(this.elementos.nuevaCarga.value) || 0,
      unidad: this.elementos.unidadCarga.value,
      x: parseFloat(this.elementos.posX.value) || 0,
      y: parseFloat(this.elementos.posY.value) || 0,
      unidadPos: this.elementos.unidadPosicion.value
    };
  }

  obtenerTipoCalculo() {
    return this.elementos.tipoCalculo.value;
  }

  obtenerCargaEspecifica() {
    return parseInt(this.elementos.cargaEspecifica.value);
  }

  obtenerUnidadResultado() {
    return this.elementos.unidadResultado.value;
  }

  limpiarFormularioCarga() {
    this.elementos.nuevaCarga.value = '';
    this.elementos.posX.value = '0';
    this.elementos.posY.value = '0';
    this.elementos.nuevaCarga.focus();
  }

  limpiarResultados() {
    this.elementos.resultados.innerHTML = '';
  }

  validarCarga() {
    const input = document.getElementById('nuevaCarga');
    const valor = parseFloat(input.value);
    
    if (isNaN(valor) || valor === 0) {
      input.classList.add('border-red-500');
      input.classList.remove('border-gray-300');
    } else {
      input.classList.remove('border-red-500');
      input.classList.add('border-gray-300');
    }
  }

  validarPosicion() {
    const inputs = [document.getElementById('posX'), document.getElementById('posY')];
    inputs.forEach(input => {
      const valor = parseFloat(input.value);
      if (isNaN(valor)) {
        input.classList.add('border-yellow-500');
        input.classList.remove('border-gray-300');
      } else {
        input.classList.remove('border-yellow-500');
        input.classList.add('border-gray-300');
      }
    });
  }

  actualizarListaCargas(cargas) {
    this.elementos.listaCargas.innerHTML = '';
    this.elementos.cargaEspecifica.innerHTML = '';
    
    if (cargas.length === 0) {
      this.elementos.listaCargas.innerHTML = `
        <div class="text-center text-gray-500 py-8">
          <p>No hay cargas agregadas</p>
          <p class="text-sm">Agrega al menos 2 cargas para realizar cálculos</p>
        </div>
      `;
      return;
    }
    
    cargas.forEach((carga, index) => {
      const item = document.createElement('div');
      item.className = 'charge-item flex justify-between items-center p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors';
      item.innerHTML = `
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full ${carga.valor > 0 ? 'bg-red-500' : 'bg-blue-500'}"></span>
            <span class="font-semibold ${carga.valor > 0 ? 'text-red-600' : 'text-blue-600'}">
              Q${index + 1}: ${carga.valorOriginal} ${carga.unidadOriginal}
            </span>
          </div>
          <div class="text-gray-600 text-sm mt-1">
            Posición: (${carga.xOriginal}, ${carga.yOriginal}) ${carga.unidadPosOriginal}
          </div>
          <div class="text-gray-500 text-xs">
            ${carga.valor.toExponential(2)} C en (${carga.x.toExponential(2)}, ${carga.y.toExponential(2)}) m
          </div>
        </div>
        <button onclick="controlador.eliminarCarga(${carga.id})" 
                class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors font-bold text-lg"
                title="Eliminar carga">×</button>
      `;
      this.elementos.listaCargas.appendChild(item);
      
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `Q${index + 1}: ${carga.valorOriginal} ${carga.unidadOriginal}`;
      this.elementos.cargaEspecifica.appendChild(option);
    });
  }

  mostrarResultados(resultados, unidadResultado, tipoCalculo) {
    this.elementos.resultados.innerHTML = '';
    
    if (resultados.length === 0) {
      this.elementos.resultados.innerHTML = `
        <div class="text-center text-gray-500 py-8">
          <p>No hay suficientes cargas para calcular</p>
          <p class="text-sm">Se necesitan al menos 2 cargas</p>
        </div>
      `;
      return;
    }

    switch (tipoCalculo) {
      case 'pares':
        this.mostrarResultadosPares(resultados, unidadResultado);
        break;
      case 'resultante':
        this.mostrarResultadosResultantes(resultados, unidadResultado);
        break;
      case 'especifica':
        this.mostrarResultadoEspecifico(resultados, unidadResultado);
        break;
    }
  }

  mostrarResultadosPares(resultados, unidadResultado) {
    const pares = resultados.filter(r => r.tipo === 'par');
    
    const container = document.createElement('div');
    container.innerHTML = `
      <h3 class="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
        Fuerzas entre Pares de Cargas
      </h3>
    `;
    
    if (pares.length === 0) {
      container.innerHTML += '<p class="text-gray-500">No hay pares de cargas para calcular</p>';
    } else {
      pares.forEach(resultado => {
        const tipoFuerza = resultado.fuerza.esRepulsiva ? 'Repulsiva' : 'Atractiva';
        const colorFuerza = resultado.fuerza.esRepulsiva ? 'text-red-600' : 'text-blue-600';
        const bgColor = resultado.fuerza.esRepulsiva ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200';
        
        const div = document.createElement('div');
        div.className = `p-4 ${bgColor} rounded-lg border mb-3`;
        div.innerHTML = `
          <div class="flex justify-between items-center mb-2">
            <span class="font-semibold text-gray-800">Q${resultado.carga1 + 1} ↔ Q${resultado.carga2 + 1}</span>
            <span class="text-sm font-medium ${colorFuerza}">${tipoFuerza}</span>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-600">Magnitud:</span>
              <div class="font-mono font-semibold">${resultado.fuerza.magnitud.toExponential(3)} ${unidadResultado}</div>
            </div>
            <div>
              <span class="text-gray-600">Distancia:</span>
              <div class="font-mono font-semibold">${resultado.fuerza.distancia.toExponential(3)} m</div>
            </div>
            <div>
              <span class="text-gray-600">Componente X:</span>
              <div class="font-mono font-semibold">${resultado.fuerza.fx.toExponential(3)} ${unidadResultado}</div>
            </div>
            <div>
              <span class="text-gray-600">Componente Y:</span>
              <div class="font-mono font-semibold">${resultado.fuerza.fy.toExponential(3)} ${unidadResultado}</div>
            </div>
          </div>
        `;
        container.appendChild(div);
      });
    }
    
    this.elementos.resultados.appendChild(container);
  }

  mostrarResultadosResultantes(resultados, unidadResultado) {
    const resultantes = resultados.filter(r => r.tipo === 'resultante');
    
    const container = document.createElement('div');
    container.innerHTML = `
      <h3 class="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
        Fuerzas Resultantes sobre cada Carga
      </h3>
    `;
    
    resultantes.forEach(resultado => {
      const div = document.createElement('div');
      div.className = 'p-4 bg-green-50 rounded-lg border border-green-200 mb-3';
      div.innerHTML = `
        <div class="font-semibold text-green-800 mb-3">Fuerza Resultante sobre Q${resultado.carga + 1}</div>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span class="text-gray-600">Magnitud:</span>
            <div class="font-mono font-semibold text-lg">${resultado.fuerza.magnitud.toExponential(4)} ${unidadResultado}</div>
          </div>
          <div>
            <span class="text-gray-600">Ángulo:</span>
            <div class="font-mono font-semibold text-lg">${resultado.fuerza.angulo.toFixed(2)}°</div>
          </div>
          <div>
            <span class="text-gray-600">Componente X:</span>
            <div class="font-mono font-semibold">${resultado.fuerza.fx.toExponential(4)} ${unidadResultado}</div>
          </div>
          <div>
            <span class="text-gray-600">Componente Y:</span>
            <div class="font-mono font-semibold">${resultado.fuerza.fy.toExponential(4)} ${unidadResultado}</div>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
    
    this.elementos.resultados.appendChild(container);
  }

  mostrarResultadoEspecifico(resultados, unidadResultado) {
    const indice = this.obtenerCargaEspecifica();
    const resultado = resultados.find(r => r.tipo === 'resultante' && r.carga === indice);
    
    if (!resultado) {
      this.elementos.resultados.innerHTML = '<p class="text-red-500">No se pudo calcular la fuerza para la carga seleccionada</p>';
      return;
    }
    
    const container = document.createElement('div');
    container.innerHTML = `
      <h3 class="text-xl font-semibold mb-4 text-gray-800">Análisis Detallado - Fuerza sobre Q${indice + 1}</h3>
      
      <div class="p-6 bg-purple-50 rounded-lg border border-purple-200 mb-4">
        <h4 class="font-semibold text-purple-800 mb-3">Fuerza Resultante</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          <div class="text-center p-3 bg-white rounded-lg">
            <div class="text-gray-600 text-sm">Magnitud</div>
            <div class="font-mono font-bold text-purple-800 text-xl">${resultado.fuerza.magnitud.toExponential(4)} ${unidadResultado}</div>
          </div>
          <div class="text-center p-3 bg-white rounded-lg">
            <div class="text-gray-600 text-sm">Ángulo</div>
            <div class="font-mono font-bold text-purple-800 text-xl">${resultado.fuerza.angulo.toFixed(2)}°</div>
          </div>
          <div class="text-center p-3 bg-white rounded-lg">
            <div class="text-gray-600 text-sm">Componente X</div>
            <div class="font-mono font-bold text-purple-800">${resultado.fuerza.fx.toExponential(4)} ${unidadResultado}</div>
          </div>
          <div class="text-center p-3 bg-white rounded-lg">
            <div class="text-gray-600 text-sm">Componente Y</div>
            <div class="font-mono font-bold text-purple-800">${resultado.fuerza.fy.toExponential(4)} ${unidadResultado}</div>
          </div>
        </div>
      </div>
    `;
    
    if (resultado.fuerza.fuerzasIndividuales && resultado.fuerza.fuerzasIndividuales.length > 0) {
      const contribuciones = document.createElement('div');
      contribuciones.className = 'bg-gray-50 rounded-lg border p-4';
      contribuciones.innerHTML = '<h4 class="font-semibold text-gray-800 mb-3">Contribuciones Individuales</h4>';
      
      resultado.fuerza.fuerzasIndividuales.forEach((fuerza, index) => {
        const tipoFuerza = fuerza.esRepulsiva ? 'Repulsiva' : 'Atractiva';
        const colorFuerza = fuerza.esRepulsiva ? 'text-red-600' : 'text-blue-600';
        const bgColor = fuerza.esRepulsiva ? 'bg-red-25' : 'bg-blue-25';
        
        const fuerzaDiv = document.createElement('div');
        fuerzaDiv.className = `p-3 bg-white rounded border-l-4 ${fuerza.esRepulsiva ? 'border-red-400' : 'border-blue-400'} mb-2`;
        fuerzaDiv.innerHTML = `
          <div class="flex justify-between items-center mb-1">
            <span class="font-medium text-gray-700">Fuerza de Q${fuerza.desdeCarga + 1}</span>
            <span class="text-xs font-medium ${colorFuerza}">${tipoFuerza}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>Magnitud: <span class="font-mono">${fuerza.magnitud.toExponential(3)} ${unidadResultado}</span></div>
            <div>Distancia: <span class="font-mono">${fuerza.distancia.toExponential(3)} m</span></div>
            <div>Fx: <span class="font-mono">${fuerza.fx.toExponential(3)} ${unidadResultado}</span></div>
            <div>Fy: <span class="font-mono">${fuerza.fy.toExponential(3)} ${unidadResultado}</span></div>
          </div>
        `;
        contribuciones.appendChild(fuerzaDiv);
      });
      
      container.appendChild(contribuciones);
    }
    
    this.elementos.resultados.appendChild(container);
  }

  actualizarConversionCarga() {
    const valor = parseFloat(this.elementos.valorConvertirCarga.value);
    const unidadOrigen = this.elementos.unidadOrigenCarga.value;
    const unidadDestino = this.elementos.unidadDestinoCarga.value;
    
    if (isNaN(valor)) {
      this.elementos.resultadoCarga.textContent = '';
      return;
    }
    
    const resultado = this.convertirUnidadesCarga(valor, unidadOrigen, unidadDestino);
    this.elementos.resultadoCarga.textContent = resultado.toExponential(6);
  }

  actualizarConversionDistancia() {
    const valor = parseFloat(this.elementos.valorConvertirDistancia.value);
    const unidadOrigen = this.elementos.unidadOrigenDistancia.value;
    const unidadDestino = this.elementos.unidadDestinoDistancia.value;
    
    if (isNaN(valor)) {
      this.elementos.resultadoDistancia.textContent = '';
      return;
    }
    
    const resultado = this.convertirUnidadesDistancia(valor, unidadOrigen, unidadDestino);
    this.elementos.resultadoDistancia.textContent = resultado.toExponential(6);
  }

  convertirUnidadesCarga(valor, unidadOrigen, unidadDestino) {
    const factoresCarga = {
      'C': 1,
      'mC': 1e-3,
      'μC': 1e-6,
      'nC': 1e-9,
      'pC': 1e-12,
      'fC': 1e-15,
      'aC': 1e-18,
      'zC': 1e-21,
      'yC': 1e-24,
      'e': 1.602176634e-19
    };
    
    const valorEnCoulombs = valor * factoresCarga[unidadOrigen];
    return valorEnCoulombs / factoresCarga[unidadDestino];
  }

  convertirUnidadesDistancia(valor, unidadOrigen, unidadDestino) {
    const factoresDistancia = {
      'm': 1,
      'km': 1000,
      'cm': 0.01,
      'mm': 0.001,
      'μm': 1e-6,
      'nm': 1e-9,
      'pm': 1e-12,
      'fm': 1e-15,
      'am': 1e-18
    };
    
    const valorEnMetros = valor * factoresDistancia[unidadOrigen];
    return valorEnMetros / factoresDistancia[unidadDestino];
  }

  mostrarError(mensaje) {
    this.elementos.resultados.innerHTML = `
      <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center gap-2">
          <span class="text-red-500 text-xl">⚠</span>
          <span class="text-red-700 font-medium">Error</span>
        </div>
        <p class="text-red-600 mt-2">${mensaje}</p>
      </div>
    `;
  }

  mostrarMensaje(mensaje, tipo = 'info') {
    const colores = {
      info: 'bg-blue-50 border-blue-200 text-blue-600',
      success: 'bg-green-50 border-green-200 text-green-600',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-600'
    };
    
    const iconos = {
      info: 'ℹ',
      success: '✓',
      warning: '⚠'
    };
    
    this.elementos.resultados.innerHTML = `
      <div class="p-4 ${colores[tipo]} border rounded-lg">
        <div class="flex items-center gap-2">
          <span class="text-xl">${iconos[tipo]}</span>
          <span class="font-medium">${mensaje}</span>
        </div>
      </div>
    `;
  }

  resetearTodo() {
    this.limpiarFormularioCarga();
    this.limpiarResultados();
    this.elementos.valorConvertirCarga.value = '';
    this.elementos.valorConvertirDistancia.value = '';
    this.elementos.resultadoCarga.textContent = '';
    this.elementos.resultadoDistancia.textContent = '';
    this.elementos.tipoCalculo.value = 'pares';
    this.elementos.opcionEspecifica.classList.add('hidden');
  }

  enfocarInput() {
    this.elementos.nuevaCarga.focus();
  }
}