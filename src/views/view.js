class VistaCargas {
  constructor() {
    this.elementos = {
      nuevaCarga: document.getElementById('nuevaCarga'),
      unidadCarga: document.getElementById('unidadCarga'),
      posX: document.getElementById('posX'),
      posY: document.getElementById('posY'),
      unidadPosicion: document.getElementById('unidadPosicion'),
      agregarCarga: document.getElementById('agregarCarga'),
      listaCargas: document.getElementById('listaCargas'),
      limpiarTodo: document.getElementById('limpiarTodo'),
      panelEstadisticas: document.getElementById('panelEstadisticas'),
      panelCalculoSeleccion: document.getElementById('panelCalculoSeleccion'),
      valorConvertir: document.getElementById('valorConvertir'),
      unidadOrigen: document.getElementById('unidadOrigen'),
      unidadDestino: document.getElementById('unidadDestino'),
      resultadoConversion: document.getElementById('resultadoConversion'),
      notificationContainer: document.getElementById('notification-container')
    };
  }

  obtenerDatosCarga = () => ({
    valor: parseFloat(this.elementos.nuevaCarga.value) || 0,
    unidadCarga: this.elementos.unidadCarga.value,
    x: parseFloat(this.elementos.posX.value) || 0,
    y: parseFloat(this.elementos.posY.value) || 0,
    unidadPos: this.elementos.unidadPosicion.value,
  });

  obtenerDatosConversion = () => ({
    valor: parseFloat(this.elementos.valorConvertir.value),
    origen: this.elementos.unidadOrigen.value,
    destino: this.elementos.unidadDestino.value
  });

  limpiarFormularioCarga() {
    this.elementos.nuevaCarga.value = '';
    this.elementos.nuevaCarga.focus();
  }

  actualizarListaCargas(cargas, seleccionarCallback, eliminarCallback) {
    this.elementos.listaCargas.innerHTML = '';

    if (cargas.length === 0) {
      this.elementos.listaCargas.innerHTML = `<p class="text-center text-gray-500 p-4">No hay cargas agregadas.</p>`;
      return;
    }

    cargas.forEach((carga) => {
      const item = document.createElement('div');
      item.className = 'charge-item flex justify-between items-center p-2 bg-gray-50 rounded-lg border';
      const signoClase = carga.valorOriginal > 0 ? 'text-red-600' : 'text-blue-600';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer';
      checkbox.checked = carga.isSelected;
      checkbox.addEventListener('change', () => seleccionarCallback(carga.id));
      
      const infoDiv = document.createElement('div');
      infoDiv.className = 'flex-grow ml-3';
      infoDiv.innerHTML = `
        <div><span class="font-semibold ${signoClase}">${carga.valorOriginal} ${carga.unidadOriginal}</span></div>
        <div class="text-gray-500 text-xs">@ (${carga.xOriginal}, ${carga.yOriginal}) ${carga.unidadPosOriginal}</div>
      `;
      
      const botonEliminar = document.createElement('button');
      botonEliminar.className = "text-gray-400 hover:text-red-600 font-bold px-2 rounded-full transition-colors";
      botonEliminar.innerHTML = "×";
      botonEliminar.addEventListener('click', () => eliminarCallback(carga.id));
      
      item.appendChild(checkbox);
      item.appendChild(infoDiv);
      item.appendChild(botonEliminar);
      this.elementos.listaCargas.appendChild(item);
    });
  }

  mostrarEstadisticasGlobales(stats) {
    if (!stats || stats.totalCargas === 0) {
      this.elementos.panelEstadisticas.innerHTML = '';
      return;
    }
    this.elementos.panelEstadisticas.innerHTML = `
      <h3 class="text-lg font-semibold text-gray-700 mb-2">Estadísticas Globales</h3>
      <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div><strong>Total:</strong> <span class="font-mono">${stats.totalCargas}</span></div>
          <div><strong>Carga Neta:</strong> <span class="font-mono">${stats.cargaNeta.toExponential(3)} C</span></div>
      </div>
    `;
  }

  mostrarCalculoSeleccion(stats) {
    if (!stats || stats.totalCargas === 0) {
      this.elementos.panelCalculoSeleccion.innerHTML = '';
      this.elementos.panelCalculoSeleccion.classList.add('hidden');
      return;
    }
    this.elementos.panelCalculoSeleccion.classList.remove('hidden');
    this.elementos.panelCalculoSeleccion.innerHTML = `
      <h3 class="text-lg font-semibold text-indigo-700 mb-2">Cálculo de Selección</h3>
      <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm panel-anim">
          <div class="font-medium">Cargas Seleccionadas:</div>
          <div class="font-mono text-right">${stats.totalCargas}</div>
          <div class="font-medium">Suma de Cargas (Q_neta):</div>
          <div class="font-mono text-right font-bold text-indigo-700">${stats.cargaNeta.toExponential(4)} C</div>
      </div>
    `;
  }

  mostrarResultadoConversion(texto) {
    if (!texto) {
        this.elementos.resultadoConversion.innerHTML = `<span class="text-gray-500">El resultado aparecerá aquí</span>`;
    } else {
        this.elementos.resultadoConversion.innerHTML = `<span class="font-mono text-2xl text-indigo-700 font-bold">${texto}</span>`;
    }
  }

  mostrarNotificacion(mensaje, tipo = 'success') {
    const colorClasses = {
      success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500'
    };
    const notif = document.createElement('div');
    notif.className = `notification text-white px-5 py-3 rounded-lg shadow-lg mb-2 ${colorClasses[tipo] || 'bg-gray-500'}`;
    notif.textContent = mensaje;
    this.elementos.notificationContainer.appendChild(notif);
    setTimeout(() => { notif.remove(); }, 4000);
  }

  bindAgregarCarga(handler) {
    this.elementos.agregarCarga.addEventListener('click', handler);
    const inputs = [this.elementos.nuevaCarga, this.elementos.posX, this.elementos.posY];
    inputs.forEach(input => {
      input.addEventListener('keypress', e => {
        if (e.key === 'Enter') handler();
      });
    });
  }

  bindLimpiarTodo(handler) {
    this.elementos.limpiarTodo.addEventListener('click', handler);
  }

  bindConversion(handler) {
    ['valorConvertir', 'unidadOrigen', 'unidadDestino'].forEach(id => {
      this.elementos[id].addEventListener('input', handler);
    });
  }
}