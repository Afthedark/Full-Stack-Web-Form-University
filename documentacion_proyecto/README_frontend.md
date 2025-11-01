# Documentación del Proyecto: Formulario Web Full-   **`js/cargar_programas.js`**: **SCRIPT AVANZADO Y MEJORADO** - Maneja la carga dinámica y filtrado inteligente de programas específicos:
    1.  **Filtrado inteligente**: Realiza peticiones `fetch` al endpoint `backend/get_programas_filtrados.php` con tres parámetros (línea de conocimiento, formación y modalidad).
    2.  **Carga automática**: Se ejecuta automáticamente al navegar a la pantalla 21, sin intervención del usuario.
    3.  **Mensajería personalizada**: Cuando no hay programas disponibles, muestra mensajes contextuales como "No tenemos disponible un programa relacionado a {Formación} en tu {Línea} en la {Modalidad} para ti, estaremos en contacto."
    4.  **UX avanzada del dropdown**: 
        - **Scroll mejorado**: Custom scrollbar con diseño elegante (6px de ancho, colores personalizados)
        - **Posicionamiento inteligente**: Detecta proximidad al footer y abre hacia arriba automáticamente
        - **Z-index hierarchy**: Sistema de capas (10003 para dropdown abierto) que evita superposiciones
        - **Responsive behavior**: Se adapta al redimensionamiento de ventana
    5.  **Gestión de eventos**: Click fuera para cerrar, escape key, y prevención de múltiples dropdowns abiertos.
    6.  **Validación condicional**: Permite envío del formulario cuando no hay programas disponibles o cuando se selecciona uno.
    7.  **Integración completa**: Inicializa custom select con todos los event listeners y manejo de estado.

-   **`js/titulo_dinamico.js`**: Script encargado de actualizar dinámicamente los títulos de las pantallas 5 y 6 en base a la selección previa del usuario (profesión y posgrado). Permite que los títulos reflejen el contexto real de lo que el usuario seleccionó, mejorando la personalización y experiencia.Stack

## 1. Descripción General

Este documento detalla la arquitectura, el funcionamiento y las convenciones del proyecto de formulario web para la Universidad El Bosque. El proyecto consiste en un frontend interactivo de 22 pasos y un backend en PHP que gestiona la lógica de negocio y la persistencia de datos.

El objetivo es ofrecer una experiencia de usuario fluida y moderna, optimizada para cualquier dispositivo, que guía al usuario a través de un proceso de recolección de datos progresivo.

## 2. Estructura del Proyecto

La estructura de carpetas está organizada para separar claramente las responsabilidades del frontend y el backend.

```
/
├── index.html              # Estructura principal del formulario (22 pantallas)
├── css/
│   └── styles.css          # Estilos visuales, diseño responsivo y componentes mejorados
├── js/
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

### Selección de Programa Específico (Pantalla 21) - FUNCIONALIDAD COMPLETA Y MEJORADA

La pantalla 21 incluye un sistema avanzado de selección de programa con múltiples mejoras de UX:

**Características principales:**
-   **Carga automática inteligente**: Al llegar a la pantalla 21, se cargan automáticamente los programas que coinciden con las selecciones previas
-   **Filtrado exacto**: Solo muestra programas donde `linea_conocimiento`, `formacion` y `modalidad` coinciden exactamente con las selecciones del usuario
-   **Diseño consistente**: Utiliza el sistema de `custom-select` mejorado con scrolling y posicionamiento inteligente
-   **Validación condicional**: El botón "ENVIAR" se habilita cuando se selecciona un programa O cuando no hay programas disponibles

**Mejoras avanzadas de UX:**
-   **Dropdown con scroll mejorado**: 
    - Custom scrollbar estilizado (6px de ancho, colores personalizados)
    - Scroll suave dentro del dropdown para listas largas de programas
    - Scrollbar compatible con Firefox (`scrollbar-width: thin`) y WebKit
-   **Posicionamiento inteligente**: 
    - Detecta automáticamente si el dropdown se cortaría con el footer
    - Abre hacia arriba (`near-footer` class) cuando hay menos de 220px de espacio
    - Se reajusta dinámicamente al redimensionar la ventana
-   **Z-index hierarchy optimizado**:
    - Base: 10002 para dropdown cerrado
    - Abierto: 10003 para dropdown activo (evita superposición con footer)
    - Sistema de capas que funciona con elementos complejos de la página

**Manejo de casos sin resultados - MEJORADO:**
- **Mensajes personalizados contextuales**: En lugar de mostrar "No hay programas disponibles", muestra mensajes específicos como:
  ```
  "No tenemos disponible un programa relacionado a Doctorado en tu Ciencias de la Salud en la Presencial con interacción directa para ti, estaremos en contacto."
  ```
- **Ocultación inteligente del selector**: Cuando no hay programas, el dropdown se oculta completamente y se muestra solo el mensaje
- **Flujo de envío optimizado**: El formulario se puede enviar sin seleccionar programa cuando no hay opciones disponibles
- **Estado visual claro**: Diferenciación visual entre "no hay selección" vs "no hay opciones disponibles"

**Almacenamiento y validación:**
- **Nombre completo**: Se almacena el **nombre completo** del programa seleccionado (no el ID)
- **Validación inteligente**: Permite envío cuando `window.noProgramaDisponible === true` o cuando hay selección válida
- **Prevención de errores**: Validación previa al envío para asegurar consistencia de datos

**Flujo técnico optimizado:**
1. Usuario completa pantallas 3 (profesión), 4 (formación) y 12 (modalidad)
2. Al navegar a pantalla 21: `cargarProgramasPorFiltros()` se ejecuta automáticamente con validación de parámetros
3. Se consulta `backend/get_programas_filtrados.php` con logging detallado para debugging
4. **Respuesta con programas**: El select se puebla con scroll mejorado y posicionamiento inteligente
5. **Respuesta sin programas**: Se obtienen nombres reales de selecciones y se muestra mensaje personalizado
6. Usuario interactúa → validación condicional → datos se incluyen correctamente en `formData`

**Gestión de eventos mejorada:**
- Click fuera del dropdown para cerrar automáticamente
- Escape key support para cerrar dropdowns
- Prevención de múltiples dropdowns abiertos simultáneamente
- Event listeners optimizados que se limpian y recrean para evitar memory leaks
- Responsive behavior con reajuste automático en resize de ventana

### Pantalla de Agradecimiento (Pantalla 22) - NUEVA FUNCIONALIDAD

La pantalla 22 es la pantalla final de agradecimiento que se muestra después del envío exitoso del formulario:

**Características principales:**
-   **Navegación automática**: Se muestra automáticamente después del envío exitoso del formulario (pantalla 21)
-   **Mensaje de confirmación**: Confirma que el formulario fue enviado correctamente
-   **Diseño elegante**: Incluye logo de la universidad y mensaje personalizado
-   **Indicador visual**: Muestra un check verde confirmando el envío exitoso
-   **Instrucciones claras**: Informa al usuario que recibirá contacto del equipo de admisiones

**Flujo de navegación:**
1. Usuario completa todos los campos en pantalla 21 y hace clic en "ENVIAR"
2. Se envían los datos al backend via `guardar_formulario_ajax.php`
3. Si el envío es exitoso: se ejecuta `goToStep(22)` automáticamente
4. Si hay error: se muestra alert con mensaje de error (no cambia de pantalla)
5. La pantalla 22 no tiene botones de navegación (es terminal)

**Configuración visual:**
- **Fondo especial**: Utiliza el mismo fondo degradado que otras pantallas de contenido
- **Sin barra de progreso**: Se oculta la barra de progreso para enfoque en el mensaje
- **Header transparente**: Header con fondo transparente para mejor presentación
- **Responsive**: Se adapta correctamente a diferentes tamaños de pantalla

**Diseño UX:**
- Mensaje principal de agradecimiento con tipografía destacada
- Logo de la universidad con opacidad reducida para elegancia
- Card de confirmación con check verde y mensaje de éxito
- Instrucciones sobre próximos pasos (revisar correo electrónico)
- Mensaje inspiracional final sobre el futuro académico

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
