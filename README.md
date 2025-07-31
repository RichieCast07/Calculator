# ⚡ Calculadora Vectorial de Campo Eléctrico

Una aplicación web interactiva para calcular y visualizar el campo eléctrico resultante de múltiples cargas. Construida con Vanilla JS puro, estilizada con Tailwind CSS y estructurada bajo el patrón de diseño Modelo-Vista-Controlador (MVC).

Este proyecto está diseñado para ser una herramienta de aprendizaje y verificación para estudiantes.

---

## ✨ Características Principales

*   **Gestión de Cargas:** Agrega, elimina y gestiona múltiples cargas fuente con posiciones en X, Y y Z.
*   **Unidades Flexibles:** Trabaja con diferentes unidades de carga (C, mC, μC, nC, pC) y de posición (m, cm, mm). Las conversiones internas se manejan automáticamente.
*   **Cálculo Selectivo:** Activa o desactiva cargas individuales para ver cómo afectan el campo eléctrico total.
*   **Punto de Cálculo Definible:** Especifica cualquier punto (Px, Py, Pz) en el espacio para calcular el campo eléctrico en esa ubicación exacta.
*   **Resultados Detallados:**
    *   **Campo Resultante:** Muestra el vector del campo eléctrico total (**E_total**) y su magnitud.
    *   **Vector Unitario:** Calcula y muestra el vector unitario (**a_E**) que indica la dirección pura del campo.
    *   **Contribuciones Individuales:** Desglosa el cálculo mostrando el vector de distancia (**R**) y el campo eléctrico (**E**) aportado por cada carga fuente, ideal para verificar soluciones paso a paso.
*   **Conversor de Unidades Integrado:** Una herramienta rápida para convertir valores de carga entre diferentes prefijos.
*   **Interfaz Moderna y Responsiva:** Diseño limpio y adaptable a diferentes tamaños de pantalla gracias a Tailwind CSS.

---

## 🛠️ Stack Tecnológico

*   **Frontend:** HTML5, Tailwind CSS
*   **Lógica:** JavaScript (Vanilla JS)
*   **Arquitectura:** Modelo-Vista-Controlador (MVC) para una clara separación de responsabilidades y una alta mantenibilidad.

---

## 📂 Estructura del Proyecto

El código está organizado siguiendo las mejores prácticas del patrón MVC:

/
├── index.html # La estructura principal de la UI
└── src/
├── controllers/
│ └── controller.js # Maneja los eventos y actúa como intermediario
├── models/
│ └── model.js # Contiene toda la lógica de negocio y los cálculos físicos
└── views/
│ └── view.js # Gestiona toda la manipulación del DOM y la presentación


*   **Modelo (`model.js`):** No sabe nada sobre la interfaz. Se encarga de almacenar los datos de las cargas y realizar todos los cálculos vectoriales.
*   **Vista (`view.js`):** No contiene lógica de cálculo. Su única responsabilidad es mostrar la información en la pantalla y capturar las entradas del usuario.
*   **Controlador (`controller.js`):** Es el "cerebro" que conecta la Vista y el Modelo. Escucha los clics del usuario, le pide al Modelo que procese los datos y le dice a la Vista que se actualice.

---

## 🚀 Cómo Empezar

No se necesita ninguna instalación ni dependencias complejas. Simplemente:

1.  Clona este repositorio:
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    ```
2.  Navega al directorio del proyecto:
    ```bash
    cd tu-repositorio
    ```
3.  Abre el archivo `index.html` directamente en el navegador web preferido (Chrome, Firefox, etc.).

¡Y listo para usar!

---

## 📖 Guía de Uso

1.  **Agregar Cargas Fuente:**
    *   En el panel de la izquierda, introduce el valor y la unidad de tu carga (ej. `5` y `nC`).
    *   Introduce sus coordenadas en `X`, `Y`, y `Z`, y selecciona la unidad de posición (ej. `m`).
    *   Haz clic en "Agregar Carga". Repite el proceso para todas las cargas de tu problema.

2.  **Definir Punto de Cálculo:**
    *   En el panel de la derecha, introduce las coordenadas `Px`, `Py`, y `Pz` del punto donde deseas calcular el campo eléctrico. Las unidades aquí siempre son en **metros**.

3.  **Calcular y Analizar:**
    *   Asegúrate de que las cargas que quieres incluir en el cálculo estén marcadas con la casilla de verificación.
    *   Haz clic en el botón verde "Calcular Campo en P".
    *   Los resultados aparecerán debajo, mostrando el campo total, su vector unitario y el desglose de las contribuciones de cada carga.

---

## 🔬 Base Teórica

El cálculo central de esta aplicación se basa en el **Principio de Superposición** de la electrostática. El campo eléctrico total en un punto es la suma vectorial de los campos producidos por cada carga puntual individual. La fórmula implementada en el modelo es:

$$ \vec{E}_{total}(\vec{r}) = \sum_{i=1}^{N} \vec{E}_i = \sum_{i=1}^{N} \frac{Q_i}{4\pi\epsilon_0 |\vec{r} - \vec{r'}_i|^2} \hat{a}_{R_i} $$

Donde:
-   **Qᵢ** es el valor de la carga fuente i.
-   **ε₀** es la permitividad del espacio libre.
-   **r** es el vector de posición del punto de cálculo.
-   **r'ᵢ** es el vector de posición de la carga fuente i.
-   **â_Rᵢ** es el vector unitario que apunta desde **r'ᵢ** hacia **r**.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
