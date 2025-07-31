class VistaCargas {
  constructor() {
    this.elementos = {
      nuevaCarga: document.getElementById('nuevaCarga'),
      unidadCarga: document.getElementById('unidadCarga'),
      posX: document.getElementById('posX'),
      posY: document.getElementById('posY'),
      posZ: document.getElementById('posZ'),
      unidadPosicion: document.getElementById('unidadPosicion'),
      agregarCarga: document.getElementById('agregarCarga'),
      listaCargas: document.getElementById('listaCargas'),
      limpiarTodo: document.getElementById('limpiarTodo'),
      panelCalculo: document.getElementById('panelCalculo'),
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
    z: parseFloat(this.elementos.posZ.value) || 0,
    unidadPos: this.elementos.unidadPosicion.value,
  });

  obtenerPuntoDeCalculo = () => ({
    x: parseFloat(document.getElementById('calcPosX').value) || 0,
    y: parseFloat(document.getElementById('calcPosY').value) || 0,
    z: parseFloat(document.getElementById('calcPosZ').value) || 0,
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
      this.elementos.listaCargas.innerHTML = `<p class="text-center text-gray-500 p-4">Aún no hay cargas.</p>`;
      return;
    }
    cargas.forEach((carga, index) => {
      const item = document.createElement('div');
      item.className = 'charge-item flex items-center p-2 bg-gray-50 rounded-lg border';
      const signoClase = carga.valorOriginal > 0 ? 'text-red-600' : 'text-blue-600';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer';
      checkbox.checked = carga.isSelected;
      checkbox.addEventListener('change', () => seleccionarCallback(carga.id));
      
      const infoDiv = document.createElement('div');
      infoDiv.className = 'flex-grow ml-3';
      infoDiv.innerHTML = `
        <div><span class="font-semibold ${signoClase}">Q${index + 1}: ${carga.valorOriginal} ${carga.unidadOriginal}</span></div>
        <div class="text-gray-500 text-xs">@ (${carga.xOriginal}, ${carga.yOriginal}, ${carga.zOriginal}) ${carga.unidadPosOriginal}</div>
      `;
      
      const botonEliminar = document.createElement('button');
      botonEliminar.className = "text-gray-400 hover:text-red-600 font-bold px-2 rounded-full transition-colors";
      botonEliminar.innerHTML = "×";
      botonEliminar.addEventListener('click', () => eliminarCallback(carga.id));
      
      item.append(checkbox, infoDiv, botonEliminar);
      this.elementos.listaCargas.appendChild(item);
    });
  }

  renderizarPanelCalculo(numCargasSeleccionadas, calcularCallback) {
    if (numCargasSeleccionadas === 0) {
      this.elementos.panelCalculo.innerHTML = `<p class="text-center text-gray-500">Seleccione al menos una carga fuente para activar el cálculo.</p>`;
      return;
    }
    this.elementos.panelCalculo.innerHTML = `
      <div class="panel-anim">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Punto de Cálculo <span class="math-symbol">P</span> (en metros)</h3>
        <div class="grid grid-cols-3 gap-2">
          <div><label for="calcPosX" class="text-xs">Px</label><input type="number" step="any" id="calcPosX" value="1" class="w-full p-1 border rounded"></div>
          <div><label for="calcPosY" class="text-xs">Py</label><input type="number" step="any" id="calcPosY" value="1" class="w-full p-1 border rounded"></div>
          <div><label for="calcPosZ" class="text-xs">Pz</label><input type="number" step="any" id="calcPosZ" value="1" class="w-full p-1 border rounded"></div>
        </div>
        <button id="btnCalcularCampo" class="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold">Calcular Campo en P</button>
        <div id="resultadosCampo" class="mt-4"></div>
      </div>
    `;
    document.getElementById('btnCalcularCampo').addEventListener('click', calcularCallback);
  }

  mostrarResultadosCampo(resultados) {
    const contenedor = document.getElementById('resultadosCampo');
    if (!resultados) { contenedor.innerHTML = ''; return; }
    
    const f = (v) => `${v.x.toExponential(3)} <span class="math-symbol">î</span> + ${v.y.toExponential(3)} <span class="math-symbol">ĵ</span> + ${v.z.toExponential(3)} <span class="math-symbol">k̂</span>`;
    
    let contribucionesHTML = resultados.contribuciones.map(c => `
        <div class="p-3 bg-white rounded border-l-4 border-gray-200">
            <p class="font-semibold text-sm">De Q${c.cargaIndex} a P:</p>
            <p class="text-xs text-gray-600 font-mono"><b>R</b> = ${f(c.vectorR)} m</p>
            <p class="text-xs text-gray-600 font-mono"><b>E</b>_${c.cargaIndex} = ${f(c.campoIndividual)} N/C</p>
        </div>
    `).join('');

    contenedor.innerHTML = `
      <div class="bg-indigo-50 p-4 rounded-lg space-y-3 panel-anim">
        <div>
          <h4 class="font-semibold text-indigo-800">Campo Eléctrico Resultante (<span class="math-symbol">E_total</span>)</h4>
          <p class="text-2xl font-mono">${resultados.magnitud.toExponential(4)} N/C</p>
          <p class="text-xs text-gray-600 font-mono"><b>E</b> = ${f(resultados.campoVector)}</p>
        </div>
        <div>
          <h4 class="font-semibold text-indigo-800">Vector Unitario (<span class="math-symbol">a_E</span>)</h4>
          <p class="text-xs text-gray-600 font-mono"><b>a</b>_E = ${resultados.unitario.x.toFixed(3)} <span class="math-symbol">î</span> + ${resultados.unitario.y.toFixed(3)} <span class="math-symbol">ĵ</span> + ${resultados.unitario.z.toFixed(3)} <span class="math-symbol">k̂</span></p>
        </div>
      </div>
      <div class="mt-4 space-y-2">
        <h4 class="font-semibold text-gray-700">Contribuciones Individuales</h4>
        ${contribucionesHTML}
      </div>
    `;
  }
  
  mostrarResultadoConversion(texto) {
    this.elementos.resultadoConversion.innerHTML = !texto ? `<span class="text-gray-500">Resultado...</span>` : `<span class="font-mono text-xl font-bold">${texto}</span>`;
  }

  mostrarNotificacion(mensaje, tipo = 'success') {
    const colorClasses = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
    const notif = document.createElement('div');
    notif.className = `notification text-white px-5 py-3 rounded-lg shadow-lg mb-2 ${colorClasses[tipo] || 'bg-gray-500'}`;
    notif.textContent = mensaje;
    this.elementos.notificationContainer.appendChild(notif);
    setTimeout(() => { notif.remove(); }, 4000);
  }

  bindAgregarCarga(handler) {
    this.elementos.agregarCarga.addEventListener('click', handler);
    [this.elementos.nuevaCarga, this.elementos.posX, this.elementos.posY, this.elementos.posZ].forEach(input => {
      input.addEventListener('keypress', e => { if (e.key === 'Enter') handler(); });
    });
  }
  bindLimpiarTodo(handler) { this.elementos.limpiarTodo.addEventListener('click', handler); }
  bindConversion(handler) {
    ['valorConvertir', 'unidadOrigen', 'unidadDestino'].forEach(id => {
      this.elementos[id].addEventListener('input', handler);
    });
  }
}