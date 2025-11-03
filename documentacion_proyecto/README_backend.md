# Backend API - Formulario de Admisión de Posgrados

Este backend, desarrollado en PHP, gestiona la lógica de negocio y el acceso a datos para el formulario de admisión de posgrados de la Universidad El Bosque. Proporciona endpoints para obtener datos dinámicos (profesiones y programas) y para almacenar la información enviada por los usuarios.

## Requisitos Previos

- Servidor web con soporte para PHP 7.x o superior (se recomienda Apache).
- Servidor de base de datos MySQL o MariaDB.
- Un entorno de desarrollo como Laragon, XAMPP o WAMP.

## Instalación y Configuración

Sigue estos pasos para poner en marcha el backend en tu entorno de desarrollo local.

### 1. Configuración de la Base de Datos

1.  Crea una nueva base de datos en tu servidor MySQL.
2.  Importa la estructura y los datos iniciales ejecutando el script `database.sql` que se encuentra en la raíz del proyecto.

### 2. Configuración de la Conexión

1.  Abre el archivo `backend/config.php`.
2.  Modifica las variables de conexión para que coincidan con la configuración de tu base de datos local:

    ```php
    // backend/config.php
    $host = 'localhost'; // O la IP de tu servidor de BD
    $db   = 'test_posgrados_ubosque'; // El nombre de tu base de datos
    $user = 'appuser'; // Tu usuario de la base de datos
    $pass = 'apppassword'; // Tu contraseña
    $port = 3308; // El puerto de tu servidor MySQL
    ```

### 3. Verificar la Conexión

Para asegurarte de que la configuración es correcta, puedes acceder a `backend/test_conexion.php` desde tu navegador. Deberías ver un mensaje de "Conexión exitosa".

---

## API Endpoints
### 4. Obtener Niveles de Formación

Recupera la lista de todos los niveles de formación disponibles.

- **Endpoint:** `GET /backend/get_formacion.php`
- **Método:** `GET`
- **Parámetros:** Ninguno.

- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      { "id": 1, "nivel_formacion": "Doctorado" },
      { "id": 2, "nivel_formacion": "Especialización" }
    ]
  }
  ```

- **Respuesta de Error (200 OK):**
  ```json
  {
    "success": false,
    "message": "No se encontraron datos de formación"
  }
  ```

- **Ejemplo con `curl`:**
  ```sh
  curl http://localhost/Full-Stack-Web-Form-University/backend/get_formacion.php
  ```

El backend expone los siguientes endpoints. Todas las respuestas se devuelven en formato JSON.

### 1. Obtener Líneas de Conocimiento (Profesiones)

Recupera la lista de todas las líneas de conocimiento disponibles.

- **Endpoint:** `GET /backend/get_profesiones.php`
- **Método:** `GET`
- **Parámetros:** Ninguno.

- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      { "id": 1, "linea": "Ciencias de la Salud" },
      { "id": 2, "linea": "Ingeniería y Tecnología" }
    ]
  }
  ```

- **Respuesta de Error (200 OK):**
  ```json
  {
    "success": false,
    "message": "No se encontraron profesiones"
  }
  ```

- **Ejemplo con `curl`:**
  ```sh
  curl http://localhost/Full-Stack-Web-Form-University/backend/get_profesiones.php
  ```

### 2. Obtener Programas por Línea de Conocimiento

Recupera los programas de posgrado asociados a una línea de conocimiento específica.

- **Endpoint:** `GET /backend/get_programas.php`
- **Método:** `GET`
- **Parámetros de URL:**
  - `linea_id` (entero, requerido): El ID de la línea de conocimiento.

- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      { "id": 101, "nombre": "Especialización en Cirugía Oral" },
      { "id": 102, "nombre": "Maestría en Salud Pública" }
    ]
  }
  ```

- **Respuesta de Error (200 OK):**
  ```json
  {
    "success": false,
    "message": "No se encontraron programas para esta línea"
  }
  ```

- **Ejemplo con `curl`:**
  ```sh
  curl "http://localhost/Full-Stack-Web-Form-University/backend/get_programas.php?linea_id=1"
  ```

### 3. Obtener Programas Filtrados por Selecciones Previas

**ENDPOINT PRINCIPAL** - Recupera programas específicos que coincidan exactamente con las selecciones de profesión, formación y modalidad del usuario.

- **Endpoint:** `GET /backend/get_programas_filtrados.php`
- **Método:** `GET`
- **Parámetros de URL (todos requeridos):**
  - `linea_id` (entero, requerido): El ID de la línea de conocimiento seleccionada.
  - `formacion_id` (entero, requerido): El ID del nivel de formación seleccionado.
  - `modalidad_id` (entero, requerido): El ID de la modalidad seleccionada.

- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      { "id": "1", "nombre": "Doctorado en Bioética" },
      { "id": "5", "nombre": "Posdoctorado en Bioética" }
    ]
  }
  ```

- **Respuesta Sin Resultados con Mensaje Personalizado (200 OK):**
  ```json
  {
    "success": true,
    "data": [],
    "message": "No se encontraron programas para la combinación seleccionada.",
    "nombres": {
      "linea": "Ciencias de la Salud",
      "nivel_formacion": "Doctorado",
      "modalidad": "Presencial con interacción directa"
    }
  }
  ```

- **Respuesta de Error (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Parámetros linea_id, formacion_id y modalidad_id son requeridos."
  }
  ```

- **Ejemplo con `curl`:**
  ```sh
  curl "http://localhost/Full-Stack-Web-Form-University/backend/get_programas_filtrados.php?linea_id=1&formacion_id=1&modalidad_id=1"
  ```

**Características avanzadas:**
- **Filtrado inteligente**: Solo devuelve programas que coinciden exactamente con las tres selecciones del usuario (profesión, formación y modalidad).
- **Mensajes personalizados**: Cuando no hay programas disponibles, incluye los nombres reales de las selecciones para mostrar un mensaje personalizado como: "No tenemos disponible un programa relacionado a Doctorado en tu Ciencias de la Salud en la Presencial con interacción directa para ti, estaremos en contacto."
- **Consulta JOIN optimizada**: Utiliza JOIN entre las tablas `programa`, `linea_conocimiento`, `Formacion` y `modalidad` para obtener tanto los programas como los nombres descriptivos.
- **Logging de depuración**: Incluye logs detallados para debugging y monitoreo de consultas.
- **Conexión MySQLi**: Utiliza MySQLi con prepared statements para máxima seguridad contra inyección SQL.

**Casos de uso:**
- **Pantalla 23 del formulario**: Muestra únicamente programas relevantes al usuario basados en sus selecciones previas.
- **Experiencia personalizada**: Filtra automáticamente los programas y proporciona mensajes contextuales.
- **Manejo de casos sin resultados**: Cuando no hay programas disponibles, muestra un mensaje personalizado con las selecciones específicas del usuario.
- **Optimización de UX**: Evita mostrar opciones irrelevantes, mejorando la experiencia del usuario.

### 4. Guardar Datos del Formulario

Recibe y almacena los datos del formulario de un nuevo usuario.

- **Endpoint:** `POST /backend/guardar_formulario_ajax.php`
- **Método:** `POST`
- **Cuerpo de la Petición (Body):** Debe ser un objeto JSON con la estructura completa del formulario.

- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "success": true,
    "message": "Formulario guardado exitosamente"
  }
  ```

- **Respuesta de Error (400/405/500):**
  ```json
  // 400 - JSON Inválido
  { "error": "Datos JSON inválidos" }

  // 405 - Método no permitido
  { "error": "Método no permitido" }

  // 500 - Error del servidor
  { "error": "Error al guardar: [mensaje del error]" }
  ```

- **Ejemplo de Cuerpo JSON:**
  ```json
  {
    "contact": {
      "nombre": "Ana Sofía",
      "email": "ana.sofia@example.com",
      "celular": "3101234567"
    },
    "age": "25-34",
    "gender": "mujer",
    "profession": "1",
    "postgraduate": "2",
    "reasons": ["crecimiento-profesional", "mejores-oportunidades"],
    "seguridad": "completamente-seguro",
    "stress": "muy-bien",
    "study_comfort": "muy-comodo",
    "learning_methods": ["practica-casos", "investigacion"],
    "modalities": "2",
    "challenges": ["costo-financiamiento"],
    "future_vision": ["liderando-proyectos"],
    "difficulty_response": ["seguir-adelante"],
    "start_date": "2025-10-15",
    "financing": ["credito-educativo"]
  }
  ```

**Notas importantes sobre los campos:**
- `profession`: ID de la línea de conocimiento seleccionada (referencia a tabla `linea_conocimiento`)
- `postgraduate`: ID del nivel de formación seleccionado (referencia a tabla `Formacion`)
- `modalities`: ID de la modalidad seleccionada como string (referencia a tabla `modalidad`)
  - `"1"` = Presencial con interacción directa
  - `"2"` = No tengo preferencia
  - `"3"` = 100% virtual por flexibilidad
  - `"4"` = Híbrido (presencial y virtual)
- `programa`: **CAMPO DEPRECADO** - Este campo ya no se utiliza en la pantalla 21. El formulario se envía sin selección de programa específico. La selección de programas ahora ocurre en la pantalla 23 (pantalla de resultados) mediante consulta de WhatsApp.
- Campos tipo array (`reasons`, `learning_methods`, etc.) se almacenan como JSON en la base de datos

**Flujo simplificado de envío:**
1. Usuario completa pantallas 1-20 con todas sus selecciones
2. En pantalla 21: Solo ingresa datos de contacto (nombre, email, celular)
3. Formulario se envía con `programa: ''` (campo vacío)
4. Backend guarda todos los datos del usuario
5. Usuario navega a pantalla 22 (loading 8 segundos)
6. Usuario llega a pantalla 23: Se muestran programas filtrados según sus selecciones previas
7. Usuario hace clic en "+ Información" de algún programa
8. Se abre WhatsApp con mensaje: "Hola, por favor quiero más información de [Nombre del Programa]"

- **Ejemplo con `curl`:**
  ```sh
  curl -X POST -H "Content-Type: application/json" \
  -d '{ "contact": { "nombre": "Test", "email": "test@test.com", "celular": "123" }, "age": "25-34", "gender": "otro", "profession": "1", "postgraduate": "2" }' \
  http://localhost/Full-Stack-Web-Form-University/backend/guardar_formulario_ajax.php
  ```

---

## Logging y Debugging

El backend incluye un sistema comprehensive de logging para facilitar el desarrollo y mantenimiento:

### Logs de get_programas_filtrados.php

```php
error_log("=== DEBUG GET_PROGRAMAS_FILTRADOS ===");
error_log("Parámetros recibidos - lineaId: $lineaId, formacionId: $formacionId, modalidadId: $modalidadId");
error_log("SQL ejecutado: $sql con parámetros [$lineaId, $formacionId, $modalidadId]");
error_log("Cantidad de programas encontrados: " . count($programas));
```

**Ubicación de logs:** Los logs se escriben al archivo de error de PHP configurado en tu servidor. Para ver los logs en tiempo real:

```bash
# En sistemas Unix/Linux/macOS
tail -f /path/to/php/error.log

# En Windows con Laragon
tail -f C:\laragon\tmp\php_errors.log
```

### Testing de Endpoints

**Prueba rápida de conectividad:**
```bash
curl http://localhost/Full-Stack-Web-Form-University/backend/test_conexion.php
```

**Prueba de endpoint con datos de ejemplo:**
```bash
# Profesiones
curl http://localhost/Full-Stack-Web-Form-University/backend/get_profesiones.php

# Formación
curl http://localhost/Full-Stack-Web-Form-University/backend/get_formacion.php

# Programas filtrados (ejemplo con IDs válidos)
curl "http://localhost/Full-Stack-Web-Form-University/backend/get_programas_filtrados.php?linea_id=1&formacion_id=1&modalidad_id=1"
```

---

## Seguridad

- **Inyección SQL:** Todas las consultas a la base de datos se realizan utilizando sentencias preparadas (`prepared statements`), lo que previene ataques de inyección SQL.
- **Validación de Datos:** Se recomienda implementar validación y sanitización de datos más robusta en el backend para garantizar la integridad de los datos antes de almacenarlos.
- **Headers de Seguridad:** Se recomienda agregar headers adicionales como `X-Content-Type-Options`, `X-Frame-Options`, etc.
- **Rate Limiting:** Para entornos de producción, considerar implementar rate limiting para prevenir abuso de endpoints.
