# Formulario Web Responsivo — Universidad El Bosque

## Descripción General
Este proyecto es un formulario web responsivo diseñado para la Universidad El Bosque. Simula una experiencia tipo app en dispositivos móviles y se adapta perfectamente a escritorio y tablets. El formulario guía al usuario a través de varias pantallas de preguntas, mostrando una barra de progreso animada y controles visuales modernos.

## Características principales
- **Diseño responsivo:** Adaptable a móviles, tablets y escritorio.
- **Estética tipo app:** Interfaz moderna, componentes grandes y animaciones suaves.
- **Barra de progreso:** Visualiza el avance del usuario.
- **Selects personalizados:** Desplegables modernos y animados.
- **Botón de acción destacado:** Con icono de flecha y estados visuales claros.
- **Variables globales de color:** Personalización sencilla desde CSS.
- **Estructura escalable:** Preparado para crecer hasta 21 pantallas o más.
- **Footer global único:** Consistente y siempre visible.

## Estructura de Carpetas
- `index.html`: Estructura principal del formulario y pantallas.
- `css/styles.css`: Estilos globales, responsivos y de componentes personalizados.
- `js/main.js`: Lógica de navegación, validación, animaciones y sincronización de selects personalizados.
- `assets/`: Imágenes y recursos gráficos.
- `memory_context/`: Documentación y archivos de contexto del proyecto.

## Tecnologías utilizadas
- **Frontend:** HTML5, CSS3 (variables, media queries), JavaScript Vanilla.
- **Backend sugerido:** PHP clásico (almacenamiento de respuestas en MySQL, sin API REST por defecto).
- **Base de datos:** MySQL.

## Instalación y uso
1. Clona el repositorio:
   ```sh
   git clone <url-del-repo>
   ```
2. Abre `index.html` en tu navegador o usa un servidor local (recomendado para rutas de imágenes y JS):
   ```sh
   # Python 3
   python -m http.server 8000
   # o usa Live Server en VS Code
   ```
3. (Opcional) Configura el backend PHP y la base de datos MySQL para almacenar respuestas.

## Guía para crear nuevas pantallas
- Cada pantalla es una sección `<section class="form-step" id="step-N">` en `index.html`.
- Usa componentes reutilizables: botones `.next-btn`, selects `.custom-select`, checkboxes `.checkbox-option`.
- El footer global ya está implementado y no debe duplicarse en cada pantalla.
- La barra de progreso se actualiza automáticamente.
- La lógica de validación y navegación se centraliza en `js/main.js`.

### Ejemplo de estructura de pantalla
```html
<!-- Pantalla N: [descripción] -->
<section class="form-step" id="step-N">
  <h2>[Título de la pregunta]</h2>
  <!-- Contenido específico -->
  <button type="button" class="next-btn" id="toStep(N+1)" disabled>
    <span>Continuar</span>
    <svg class="arrow-icon" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"/></svg>
  </button>
</section>
```

## Flujo de datos y validación
- Cada pantalla almacena la respuesta en una variable JS.
- Al finalizar, se recopilan todas las respuestas en un objeto `formData` y se envían al backend.
- Validaciones en cada pantalla: los botones "Continuar" solo se habilitan si la selección es válida.
- Validación adicional en el backend antes de guardar en la base de datos.

## Ejemplo de datos enviados al backend
```json
{
  "age": "25-34",
  "gender": "mujer",
  "profession": "ingenieria",
  "postgraduate": "maestria-epidemiologia",
  "reasons": ["crecimiento-profesional", "mejorar-conocimiento"],
  "seguridad": "bastante-seguro",
  "stress": "muy-bien",
  "study_comfort": "muy-comodo",
  "learning_methods": ["practica-casos", "teorico-casos"],
  "modalities": ["hibrido"],
  "challenges": ["equilibrar-estudio-trabajo", "costo-financiamiento"],
  "future_vision": ["liderando-proyectos"],
  "difficulty_response": ["seguir-adelante"],
  "start_date": "2025-10-04",
  "financing": ["credito-educativo"],
  "contact": {
    "nombre": "Ana García",
    "email": "ana.garcia@email.com",
    "celular": "3001234567"
  }
}
```

## Buenas prácticas y recomendaciones
- Usa IDs y clases siguiendo la convención: `step-N`, `toStepN`, `nombreSelect`, etc.
- Deshabilita los botones "Continuar" por defecto y habilítalos solo tras una selección válida.
- Mantén la lógica de validación y navegación en `js/main.js`.
- Usa variables CSS para colores y media queries para responsividad.
- No dupliques el footer, ya existe uno global.
- Prueba el formulario en diferentes dispositivos y navegadores.

## Accesibilidad
- Navegación por teclado soportada.
- Etiquetas semánticas y atributos `aria-*` donde corresponde.
- Contraste de colores adecuado.

## Colaboración y flujo de trabajo
- Crea ramas por feature: `feature/step-8`, `fix/progress-bar`, etc.
- Mensajes de commit claros.
- Pull Requests con descripción y capturas si es posible.
- Revisión de código antes de merge.

## Créditos y licencia
- Proyecto desarrollado para la Universidad El Bosque.
- Diseño y desarrollo: equipo interno y colaboradores.
- Licencia: MIT (modificable según requerimientos institucionales).

---

Para más detalles técnicos y guía de colaboración, habla conmigo.
