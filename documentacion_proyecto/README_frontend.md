# Documentación del Proyecto: Formulario Web Full-Stack

## 1. Descripción General

Este documento detalla la arquitectura, el funcionamiento y las convenciones del proyecto de formulario web para la Universidad El Bosque. El proyecto consiste en un frontend interactivo de **23 pantallas** y un backend en PHP que gestiona la lógica de negocio y la persistencia de datos.

El objetivo es ofrecer una experiencia de usuario fluida y moderna, optimizada para cualquier dispositivo, que guía al usuario a través de un proceso de recolección de datos progresivo, culminando con:
- **Pantalla 22**: Loading animado de 8 segundos
- **Pantalla 23**: Resultados personalizados con programas filtrados y contacto directo por WhatsApp

## 2. Estructura del Proyecto

La estructura de carpetas está organizada para separar claramente las responsabilidades del frontend y el backend.

```
/
├── index.html              # Estructura principal del formulario (23 pantallas)
├── css/
│   └── styles.css          # Estilos visuales, diseño responsivo y componentes mejorados
├── js/
│   ├── main.js             # Lógica central del formulario (navegación, validación, UI)
│   ├── obtener_profesiones.js # Carga dinámica de profesiones desde el backend
│   ├── obtener_formacion.js   # Carga dinámica de niveles de formación desde el backend
│   ├── obtener_programas.js   # NUEVO - Carga programas para pantalla 23
│   ├── programa_whatsapp.js   # NUEVO - Integración WhatsApp para consultas
│   └── titulo_dinamico.js  # Actualiza dinámicamente los títulos en las pantallas 5 y 6
├── backend/
│   ├── config.php          # Configuración de la conexión a la base de datos
│   ├── get_profesiones.php # Endpoint para obtener las profesiones
│   ├── get_formacion.php   # Endpoint para obtener los niveles de formación
│   ├── get_programas_filtrados.php # Endpoint para programas filtrados (pantalla 23)
│   └── guardar_formulario_ajax.php # Endpoint para guardar los datos del formulario
├── assets/                 # Recursos visuales (imágenes, iconos, SVG)
└── database.sql            # Script para la creación de la base de datos
```
│   ├── main.js             # Lógica central del formulario (navegación, validación, UI)
│   ├── obtener_profesiones.js # Carga dinámica de profesiones desde el backend
│   ├── obtener_formacion.js   # Carga dinámica de niveles de formación desde el backend
│   ├── cargar_programas.js    # NUEVO MEJORADO - Carga inteligente de programas con UX avanzada
│   └── titulo_dinamico.js  # Actualiza dinámicamente los títulos en las pantallas 5 y 6
├── backend/
│   ├── config.php          # Configuración de la conexión a la base de datos
│   ├── get_profesiones.php # Endpoint para obtener las profesiones
│   ├── get_formacion.php   # Endpoint para obtener los niveles de formación
│   ├── get_programas.php   # Endpoint para obtener los programas por línea
│   ├── get_programas_filtrados.php # MEJORADO - Endpoint con mensajes personalizados
│   └── guardar_formulario_ajax.php # Endpoint para guardar los datos del formulario
├── assets/                 # Recursos visuales (imágenes, iconos, SVG)
└── database.sql            # Script para la creación de la base de datos
```

## 3. Arquitectura del Frontend

El frontend está construido con **HTML5, CSS3 y JavaScript (Vanilla JS)**. Su principal responsabilidad es gestionar la interfaz de usuario, la interactividad del formulario y la comunicación con el backend.

### Componentes Clave

-   **`index.html`**: Contiene la estructura de las 22 pantallas del formulario. Cada pantalla es una sección (`<section>`) que se muestra u oculta dinámicamente.
-   **`css/styles.css`**: Define la apariencia visual del formulario, utilizando variables de CSS para un theming consistente y Media Queries para un diseño totalmente responsivo. **MEJORADO con componentes UI avanzados:**
    - **Custom dropdown mejorado**: Sistema de z-index optimizado (10002-10003) para manejo de superposiciones
    - **Scrollbar personalizado**: Custom scrollbar de 6px con colores temáticos para dropdown de programas
    - **Posicionamiento inteligente**: Detección automática de proximidad al footer con clase `near-footer`
    - **Responsive dropdown**: Se adapta automáticamente al espacio disponible y redimensionamiento
    - **UX pulida**: Transiciones suaves, estados hover optimizados y gestión de foco mejorada
-   **`js/main.js`**: Es el cerebro del frontend. Sus responsabilidades incluyen:
    -   **Navegación entre Pasos:** Controla la visibilidad de las pantallas y actualiza la barra de progreso.
    -   **Manejo de Estado:** Almacena las respuestas del usuario en variables locales.
    -   **Validación en Tiempo Real:** Habilita o deshabilita los botones de "Continuar" según las selecciones del usuario.
    -   **Gestión de Componentes:** Inicializa y maneja la lógica de los componentes reutilizables (selects personalizados, calendario, etc.).
    -   **Envío de Datos:** Recopila todas las respuestas en un objeto `formData` y lo envía al backend al finalizar.

-   **`js/titulo_dinamico.js`**: Script encargado de actualizar dinámicamente los títulos de las pantallas 5 y 6 en base a la selección previa del usuario (profesión y posgrado). Permite que los títulos reflejen el contexto real de lo que el usuario seleccionó, mejorando la personalización y experiencia.

### Ejemplo de Personalización Dinámica de Títulos

Cuando el usuario selecciona una profesión y un posgrado, los títulos de las pantallas 5 y 6 se actualizan automáticamente:

- Pantalla 5:
  ```html
  <h2>¿Cuál es la razón principal por la que deseas estudiar la {Maestría en Filosofía de la Ciencia} en {Humanidades}?</h2>
  ```
- Pantalla 6:
  ```html
  <h2>¿Qué tan seguro estás<br>de querer estudiar<br>{Maestría en Filosofía de la Ciencia} en {Humanidades}</h2>
  ```

Esta funcionalidad se implementa de forma desacoplada en `js/titulo_dinamico.js` y no afecta la lógica principal de navegación ni validación del formulario.

### Carga de Datos Dinámicos

Para evitar hardcodear opciones en el HTML, el formulario carga datos dinámicamente desde el backend:

-   **`js/obtener_profesiones.js`**:
    1.  Al cargar la página, realiza una petición `fetch` al endpoint `backend/get_profesiones.php`.
    2.  Recibe la lista de profesiones en formato JSON.
    3.  Puebla dinámicamente el select de profesiones en la pantalla 3.

-   **`js/obtener_formacion.js`**:
    1.  Al cargar la página, realiza una petición `fetch` al endpoint `backend/get_formacion.php`.
    2.  Recibe la lista de niveles de formación en formato JSON.
    3.  Puebla dinámicamente el select de formación en la pantalla 4.

-   **`js/obtener_programas.js`**: **NUEVO - Script para pantalla 23**
    1.  Se ejecuta automáticamente al llegar a la pantalla 23 (`goToStep(22)`).
    2.  Realiza petición `fetch` a `backend/get_programas_filtrados.php` con tres parámetros:
        - `linea_id`: Profesión seleccionada (pantalla 3)
        - `formacion_id`: Formación seleccionada (pantalla 4)
        - `modalidad_id`: Modalidad seleccionada (pantalla 12)
    3.  Recibe programas filtrados que coinciden exactamente con las selecciones del usuario.
    4.  Renderiza los programas como lista simple (no cards) con botones "+ Información".
    5.  Maneja casos sin resultados mostrando mensajes personalizados.

-   **`js/programa_whatsapp.js`**: **NUEVO - Integración WhatsApp**
    1.  Proporciona función `enviarWhatsAppPrograma(id, nombre)` para abrir WhatsApp.
    2.  Configuración editable de número de WhatsApp y mensaje base.
    3.  Se invoca cuando el usuario hace clic en cualquier botón "+ Información".
    4.  Abre WhatsApp Web/App con mensaje pre-completado sobre el programa.
    5.  Funciones auxiliares para configurar número y mensaje dinámicamente.

### Diseño de Modalidades (Pantalla 12)

La pantalla 12 implementa un diseño especial de checkbox-options que permite selección única:

-   **Diseño Visual**: Utiliza la clase `checkbox-options` con checkboxes estilizados como tarjetas visuales
-   **Funcionalidad**: Solo permite una selección a la vez (simula radio buttons pero con diseño de checkboxes)
-   **Valores de Modalidad**:
    -   `value="1"` = Presencial con interacción directa
    -   `value="2"` = No tengo preferencia  
    -   `value="3"` = 100% virtual por flexibilidad
    -   `value="4"` = Híbrido (presencial y virtual)
-   **Almacenamiento**: El ID de la modalidad seleccionada se envía como string al backend para referencia a la tabla `modalidad`

### Formulario de Contacto (Pantalla 21) - SIMPLIFICADO

La pantalla 21 ahora es un formulario de contacto simple sin selección de programas:

**Características principales:**
-   **Solo datos de contacto**: Campos para nombre, email y celular
-   **Validación en tiempo real**: Habilita el botón "ENVIAR" cuando todos los campos son válidos
-   **Sin selector de programas**: La funcionalidad de selección de programas se movió a la pantalla 23
-   **Envío simplificado**: El formulario se envía con `programa: ''` (campo vacío)

**Campos del formulario:**
1. **Nombre**: Mínimo 3 caracteres
2. **Email**: Validación de formato email válido
3. **Celular**: Validación de 10 dígitos numéricos

**Validación:**
```javascript
function validateContactForm() {
  const isNameValid = nombreInput.value.trim().length >= 3;
  const isEmailValid = validateEmail(emailInput.value);
  const isPhoneValid = validatePhone(celularInput.value);
  
  submitFormBtn.disabled = !(isNameValid && isEmailValid && isPhoneValid);
}
```

**Flujo de envío:**
1. Usuario completa nombre, email y celular
2. Botón "ENVIAR" se habilita automáticamente cuando todos los campos son válidos
3. Click en "ENVIAR": Se construye objeto `formData` con todos los datos del formulario
4. Se envía al backend via `guardar_formulario_ajax.php` con `programa: ''`
5. Si exitoso: Navega a pantalla 22 (loading)
6. Si error: Muestra alert con mensaje de error

**Diferencia clave con versión anterior:**
- ❌ **Antes**: Pantalla 21 incluía selector de programas filtrados
- ✅ **Ahora**: Pantalla 21 solo recopila datos de contacto
- ✅ **Programas**: Se muestran en pantalla 23 después del envío

### Pantalla de Loading (Pantalla 22) - NUEVA FUNCIONALIDAD

La pantalla 22 es una pantalla de transición con loading animado que se muestra después del envío exitoso del formulario:

**Características principales:**
-   **Navegación automática**: Se muestra automáticamente después del envío exitoso del formulario (pantalla 21)
-   **Loading animado**: GIF animado que se muestra durante 8 segundos
-   **Botón con delay**: Botón "CONTINUAR" que aparece después de 8 segundos
-   **Diseño elegante**: Fondo degradado consistente con el resto del formulario
-   **Transición suave**: Preparación visual para la pantalla de resultados

**Flujo de navegación:**
1. Usuario completa todos los campos en pantalla 21 y hace clic en "ENVIAR"
2. Se envían los datos al backend via `guardar_formulario_ajax.php`
3. Si el envío es exitoso: se ejecuta `goToStep(21)` para mostrar pantalla 22
4. Si hay error: se muestra alert con mensaje de error (no cambia de pantalla)
5. **Timeout de 8 segundos**: Se ejecuta automáticamente después del envío
6. Después de 8 segundos: El botón "CONTINUAR" se hace visible
7. Usuario hace clic en "CONTINUAR": Navega a pantalla 23 (resultados)

**Configuración visual:**
- **Fondo degradado**: `linear-gradient(180deg, #F8F4F0 0%, #DDD0C8 100%)`
- **Barra de progreso visible**: Muestra el progreso del formulario
- **Header transparente**: Header con fondo transparente
- **Responsive**: Se adapta correctamente a diferentes tamaños de pantalla

**Implementación técnica:**
```javascript
setTimeout(() => {
  const step22 = document.getElementById('step-22');
  const toStep23Btn = step22.querySelector('#toStep23');
  if (toStep23Btn) {
    toStep23Btn.classList.add('button-visible');
  }
}, 8000);
```

### Pantalla de Resultados (Pantalla 23) - NUEVA FUNCIONALIDAD COMPLETA

La pantalla 23 es la pantalla final de resultados que muestra programas personalizados y permite contacto directo por WhatsApp:

**Características principales:**
-   **Carga dinámica automática**: Al llegar a la pantalla, se cargan automáticamente los programas filtrados
-   **Filtrado inteligente**: Solo muestra programas que coinciden exactamente con las selecciones del usuario:
    - Línea de conocimiento (profesión) seleccionada en pantalla 3
    - Nivel de formación seleccionado en pantalla 4
    - Modalidad seleccionada en pantalla 12
-   **Sin logo de universidad**: Diseño minimalista sin logo en el header
-   **Diseño simple**: Programas mostrados como lista simple (NO cards)
-   **Contacto directo**: Botón "+ Información" que abre WhatsApp automáticamente

**Estructura visual:**
```
┌─────────────────────────────────┐
│  Estos son                      │
│  los posgrados que              │
│  encontramos para ti.           │
├─────────────────────────────────┤
│                                 │
│  Especialización en Bioética    │
│     [+ Información] 🟧          │
│                                 │
│  Maestría en Bioética           │
│     [+ Información] 🟧          │
│                                 │
│  Doctorado en Bioética          │
│     [+ Información] 🟧          │
│                                 │
└─────────────────────────────────┘
```

**Estilos de texto aplicados:**
- **Nombre del programa**:
  - Font: Acherus Grotesque
  - Weight: 700 (Bold)
  - Size: 16px
  - Line-height: 20px
  - Color: #1a1a1a
  
- **Botón "+ Información"**:
  - Background: #FB6402
  - Font: Acherus Grotesque
  - Weight: 700 (Bold)
  - Size: 16px
  - Line-height: 20px
  - Padding: 12px 24px
  - Min-width: 160px

**Responsive design:**
- **Desktop**: Tamaños y espaciados estándar
- **Mobile (≤768px)**: Mantiene tamaños grandes para mejor legibilidad
  - Gap entre programas: 24px
  - Font-size mantenido en 16px
- **Mobile pequeño (≤480px)**: Optimizado para pantallas pequeñas
  - Ajustes de padding y márgenes
  - Mantiene claridad visual

**Integración con WhatsApp:**
- **Archivo**: `js/programa_whatsapp.js`
- **Función principal**: `enviarWhatsAppPrograma(programaId, programaNombre)`
- **Configuración editable**:
  ```javascript
  const WHATSAPP_CONFIG = {
      numeroWhatsApp: '573001234567',  // Formato: código país + número
      mensajeBase: 'Hola, por favor quiero más información de'
  };
  ```
- **Mensaje enviado**: "Hola, por favor quiero más información de [Nombre del Programa]"
- **Funcionalidad**: Al hacer clic en cualquier botón "+ Información", se abre WhatsApp Web/App automáticamente

**Flujo técnico completo:**
1. Usuario completa pantalla 21 y envía formulario
2. Backend guarda datos con `programa: ''` (campo vacío)
3. Pantalla 22: Loading de 8 segundos
4. Usuario hace clic en "CONTINUAR"
5. **Navegación a pantalla 23**: `goToStep(22)` ejecuta `obtenerYMostrarProgramas()`
6. **Consulta al backend**: Se ejecuta fetch a `get_programas_filtrados.php` con:
   - `linea_id`: ID de profesión (localStorage/window)
   - `formacion_id`: ID de formación (localStorage/window)
   - `modalidad_id`: ID de modalidad (localStorage/window)
7. **Renderizado de programas**:
   - Con programas: Se muestra lista con botones
   - Sin programas: Se muestra mensaje personalizado
8. **Interacción del usuario**: Click en "+ Información"
9. **WhatsApp**: Se abre con mensaje pre-completado

**Manejo de casos sin resultados:**
```javascript
// Mensaje personalizado cuando no hay programas
`No tenemos disponible un programa relacionado a ${formacion} 
en ${linea} en la modalidad ${modalidad} para ti.`
```

**Scripts involucrados:**
- `js/obtener_programas.js`: Carga y renderizado de programas
- `js/programa_whatsapp.js`: Integración con WhatsApp
- `js/main.js`: Navegación y control de flujo
- `backend/get_programas_filtrados.php`: API de programas filtrados

-   **Funcionalidad adicional de programas**:
    1.  Si se necesita en el futuro cargar programas específicos, se puede usar el endpoint `backend/get_programas.php`.
    2.  Este endpoint recibe un parámetro `linea_id` y devuelve los programas de esa línea de conocimiento.
    3.  Actualmente no se usa en el frontend, pero está disponible para futuras implementaciones.

## 4. Integración con el Backend

La comunicación entre el frontend y el backend se realiza a través de una API RESTful simple.

### Flujo de Datos

1.  **Obtención de Datos (GET):**
    -   El frontend solicita las profesiones, niveles de formación y programas a los endpoints `get_profesiones.php`, `get_formacion.php` y `get_programas.php`.
    -   El backend consulta la base de datos y devuelve los resultados en formato JSON.

2.  **Envío de Datos (POST):**
    -   Al completar el formulario, `js/main.js` construye un objeto `formData` con todas las respuestas.
    -   Este objeto se envía mediante una petición `fetch` con el método `POST` al endpoint `backend/guardar_formulario_ajax.php`.
    -   El backend recibe el objeto JSON, lo procesa y lo inserta en la base de datos.

### Estructura del Objeto `formData`

El objeto que se envía al backend tiene la siguiente estructura:

```json
{
  "age": "25-34",
  "gender": "mujer",
  "profession": "1", // ID de la profesión (referencia a linea_conocimiento)
  "postgraduate": "2", // ID del nivel de formación (referencia a Formacion)
  "modalities": "3", // ID de modalidad seleccionada (referencia a modalidad)
  "programa": "Maestría en Bioética", // MEJORADO - Nombre completo con validación inteligente
  "reasons": ["crecimiento-profesional"],
  // ... resto de los campos
  "contact": {
    "nombre": "Nombre Apellido",
    "email": "correo@ejemplo.com",
    "celular": "3001234567"
  }
}
```

**Notas sobre campos específicos:**
- `profession`: ID de línea de conocimiento seleccionada (pantalla 3)
- `postgraduate`: ID de nivel de formación seleccionado (pantalla 4)
- `modalities`: ID de modalidad como string (1-4, corresponde a los valores en tabla modalidad, pantalla 12)
- `programa`: **CAMPO VACÍO** - Se envía como string vacío (`''`). La selección de programas ahora ocurre en la pantalla 23 (pantalla de resultados) mediante consulta de WhatsApp, no durante el envío del formulario.
- Campos array (como `reasons`) se almacenan como JSON en la base de datos

**Proceso simplificado de formulario:**
1. Usuario completa pantallas 1-20 con todas sus selecciones (edad, género, profesión, formación, modalidad, etc.)
2. **Pantalla 21**: Solo ingresa datos de contacto (nombre, email, celular)
3. **Envío**: Formulario se envía con `programa: ''` (campo vacío)
4. **Backend**: Guarda todos los datos del usuario en la base de datos
5. **Pantalla 22**: Loading animado de 8 segundos
6. **Pantalla 23**: Se muestran programas filtrados según las selecciones previas del usuario
7. **WhatsApp**: Usuario hace clic en "+ Información" de algún programa para consultar por WhatsApp
- `programa`: **CAMPO MEJORADO** - Nombre completo del programa específico seleccionado (pantalla 21). Se obtiene mediante filtrado inteligente y validación condicional:
  - **Con programas disponibles**: Se envía el nombre completo del programa seleccionado
  - **Sin programas disponibles**: Se envía string vacío (`""`) y se marca `window.noProgramaDisponible = true`
  - **Mensajes personalizados**: El frontend muestra mensajes contextuales basados en las selecciones reales del usuario
- Campos array (como `reasons`) se almacenan como JSON en la base de datos

**Proceso avanzado de selección de programa:**
1. **Filtrado automático**: Se utilizan los IDs de `profession`, `postgraduate` y `modalities` para consultar programas disponibles via `get_programas_filtrados.php`
2. **Carga inteligente**: Solo se muestran programas que coinciden exactamente con las tres selecciones del usuario
3. **Validación condicional**: El formulario permite envío cuando se selecciona un programa O cuando no hay programas disponibles
4. **UX optimizada**: Dropdown con scroll mejorado, posicionamiento inteligente y mensajes personalizados
5. **Almacenamiento consistente**: Se guarda el **nombre completo** (no el ID) para facilitar análisis y seguimiento
6. **Logging detallado**: Todas las interacciones quedan registradas para debugging y monitoreo

## 6. Mejoras Técnicas Recientes

### Sistema de Dropdown Mejorado (custom-select)

El sistema de dropdown personalizado ha sido significativamente mejorado para proporcionar una experiencia de usuario superior:

**Mejoras de Scroll:**
- **Custom scrollbar**: Scrollbar de 6px de ancho con diseño personalizado
- **Cross-browser compatibility**: Soporte para Firefox (`scrollbar-width: thin`) y WebKit browsers
- **Smooth scrolling**: Experiencia de scroll fluida dentro del dropdown
- **Visual consistency**: Colores que coinciden con el theme general de la aplicación

**Posicionamiento Inteligente:**
- **Detección automática**: El dropdown detecta si se cortaría con el footer de la página
- **Adaptive positioning**: Cambia automáticamente de abrir hacia abajo a abrir hacia arriba cuando es necesario
- **Dynamic class management**: Usa la clase `near-footer` para aplicar estilos de posicionamiento especial
- **Responsive behavior**: Se reajusta automáticamente cuando la ventana cambia de tamaño

**Gestión de Z-Index:**
```css
.custom-options { z-index: 10002; }          /* Dropdown cerrado */
.custom-select.open .custom-options { z-index: 10003; } /* Dropdown abierto */
.form-footer { z-index: 10000; }             /* Footer base */
```

**Event Management Optimizado:**
- **Click outside to close**: Cierra dropdown al hacer click fuera del componente
- **Multiple dropdown prevention**: Previene que múltiples dropdowns estén abiertos simultáneamente
- **Memory leak prevention**: Event listeners se limpian y recrean correctamente
- **Keyboard support**: Soporte básico para navegación con teclado

### Mensajería Personalizada Avanzada

Sistema de mensajes contextuales que mejora significativamente la experiencia cuando no hay programas disponibles:

**Características:**
- **Mensajes dinámicos**: Construye mensajes usando los nombres reales de las selecciones del usuario
- **Ejemplo**: "No tenemos disponible un programa relacionado a Doctorado en tu Ciencias de la Salud en la Presencial con interacción directa para ti, estaremos en contacto."
- **Ocultación inteligente**: El dropdown se oculta completamente cuando no hay opciones disponibles
- **Styling consistente**: Mensaje estilizado que mantiene la coherencia visual con el resto del formulario

### Validación Condicional Inteligente

Sistema de validación que se adapta a diferentes escenarios:

**Lógica de validación:**
```javascript
// Permite envío si no hay programa disponible O si se seleccionó uno
const isProgramSelected = window.noProgramaDisponible || (programSelect && programSelect.value !== '');
```

**Estados manejados:**
1. **Programa seleccionado**: Validación normal, se envía el nombre del programa
2. **No hay programas disponibles**: Se permite envío, se envía string vacío
3. **No hay selección**: Se bloquea envío hasta que usuario haga una selección

### Logging y Debugging Mejorado

Sistema comprehensive de logging para facilitar el desarrollo y mantenimiento:

**Frontend logging:**
```javascript
console.log('=== DEBUG CARGAR PROGRAMAS ===');
console.log('lineaId recibido:', lineaId, 'tipo:', typeof lineaId);
// ... más logs detallados
```

**Backend logging:**
```php
error_log("=== DEBUG GET_PROGRAMAS_FILTRADOS ===");
error_log("Parámetros recibidos - lineaId: $lineaId, formacionId: $formacionId, modalidadId: $modalidadId");
// ... logs de consultas SQL y resultados
```

**Beneficios:**
- **Debugging simplificado**: Información detallada sobre flujo de datos y estados
- **Monitoreo de rendimiento**: Tracking de consultas y tiempos de respuesta
- **Error tracking**: Identificación rápida de problemas en producción

## 7. Guía para Desarrolladores

### Cómo Añadir una Nueva Pantalla

1.  **HTML (`index.html`):**
    -   Crea una nueva `<section class="form-step" id="step-N">`.
    -   Añade los elementos de la nueva pantalla (títulos, inputs, botones).

2.  **JavaScript (`js/main.js`):**
    -   **Declarar Elementos:** Obtén referencias a los nuevos elementos del DOM.
    -   **Validación:** Implementa la lógica para validar la selección del usuario y habilitar el botón "Continuar".
    -   **Navegación:** Asegúrate de que el botón "Continuar" de la pantalla anterior navegue a la nueva (`goToStep(N-1)`) y que el de la nueva pantalla navegue a la siguiente.
    -   **Recolección de Datos:** Almacena la respuesta de la nueva pantalla en una variable para que se incluya en el objeto `formData` final.

### Buenas Prácticas

-   **Componentes**: Reutiliza los componentes existentes (selects mejorados, checkboxes) siempre que sea posible para mantener la consistencia visual y funcional.
-   **Accesibilidad**: Asegúrate de que los nuevos elementos interactivos sean accesibles (uso de `aria-labels`, navegación por teclado).
-   **Rendimiento**: Optimiza las imágenes y otros recursos para garantizar una carga rápida de la página.
-   **UX de Dropdowns**: Para dropdowns con muchas opciones, considera implementar el sistema de scroll y posicionamiento inteligente usado en el selector de programas.
-   **Validación condicional**: Implementa validación que se adapte a diferentes estados (datos disponibles vs no disponibles).
-   **Logging**: Incluye logging detallado para facilitar debugging, especialmente en operaciones asíncronas y llamadas al backend.

### Reutilización del Sistema de Dropdown Mejorado

Si necesitas crear un nuevo dropdown con las mismas capacidades avanzadas:

1. **HTML Structure:**
   ```html
   <div class="custom-select" data-select="yourSelectId">
     <div class="custom-select__trigger">
       <span>Selecciona una opción</span>
     </div>
     <div class="custom-options">
       <!-- Options se popolaran dinámicamente -->
     </div>
   </div>
   <select id="yourSelectId" style="display: none;">
     <option value="">Selecciona una opción</option>
   </select>
   ```

2. **CSS Classes:** Las clases ya están disponibles en `styles.css` y se aplicarán automáticamente

3. **JavaScript Integration:** Adapta las funciones de `cargar_programas.js` para tu nuevo componente:
   - `checkDropdownPosition()` para posicionamiento inteligente
   - Event listeners para click outside y gestión de estado
   - Lógica de scroll y z-index management
