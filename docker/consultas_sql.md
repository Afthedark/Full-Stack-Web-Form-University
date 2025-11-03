# Consultas SQL - Sistema de Formulario Universitario

Este archivo contiene las consultas SQL más útiles para el sistema de formulario de admisión de posgrados de la Universidad El Bosque.

## 1. Consulta Básica - Todos los Usuarios

Muestra todos los datos de la tabla usuario sin relaciones:

```sql
SELECT * FROM usuario;
```

## 2. Consulta Completa con Relaciones

Muestra todos los datos de usuarios con los nombres de las tablas relacionadas (profesión, posgrado y modalidades):

```sql
SELECT 
    u.id,
    u.nombre,
    u.email,
    u.celular,
    u.edad,
    u.genero,
    lc.linea AS profesion_nombre,           -- Nombre de la línea de conocimiento
    f.nivel_formacion AS posgrado_nombre,   -- Nombre del nivel de formación
    u.razones,
    u.seguridad,
    u.estres,
    u.comodidad_estudio,
    u.metodos_aprendizaje,
    m.modalidad AS modalidades_nombre,      -- Nombre de la modalidad
    u.desafios,
    u.vision_futuro,
    u.respuesta_dificultad,
    u.fecha_inicio,
    u.financiamiento,
    u.programa,
    u.created_at
FROM usuario u
LEFT JOIN linea_conocimiento lc ON u.profesion = lc.id
LEFT JOIN Formacion f ON u.posgrado = f.id
LEFT JOIN modalidad m ON u.modalidades = m.id;
```

## 3. Consultas por Categorías

### 3.1 Usuarios por Profesión

```sql
SELECT 
    lc.linea AS profesion,
    COUNT(*) AS total_usuarios
FROM usuario u
LEFT JOIN linea_conocimiento lc ON u.profesion = lc.id
WHERE u.profesion IS NOT NULL
GROUP BY lc.linea
ORDER BY total_usuarios DESC;
```

### 3.2 Usuarios por Nivel de Formación

```sql
SELECT 
    f.nivel_formacion,
    COUNT(*) AS total_usuarios
FROM usuario u
LEFT JOIN Formacion f ON u.posgrado = f.id
WHERE u.posgrado IS NOT NULL
GROUP BY f.nivel_formacion
ORDER BY total_usuarios DESC;
```

### 3.3 Usuarios por Modalidad Preferida

```sql
SELECT 
    m.modalidad,
    COUNT(*) AS total_usuarios
FROM usuario u
LEFT JOIN modalidad m ON u.modalidades = m.id
WHERE u.modalidades IS NOT NULL
GROUP BY m.modalidad
ORDER BY total_usuarios DESC;
```

## 4. Consultas de Análisis

### 4.1 Distribución por Edad y Género

```sql
SELECT 
    edad,
    genero,
    COUNT(*) AS total
FROM usuario
WHERE edad IS NOT NULL AND genero IS NOT NULL
GROUP BY edad, genero
ORDER BY edad, genero;
```

### 4.2 Usuarios con Preferencias Específicas

```sql
SELECT 
    u.nombre,
    u.email,
    lc.linea AS profesion,
    f.nivel_formacion AS posgrado,
    m.modalidad AS modalidad_preferida,
    u.fecha_inicio
FROM usuario u
LEFT JOIN linea_conocimiento lc ON u.profesion = lc.id
LEFT JOIN Formacion f ON u.posgrado = f.id
LEFT JOIN modalidad m ON u.modalidades = m.id
WHERE u.fecha_inicio IS NOT NULL
ORDER BY u.fecha_inicio;
```

### 4.3 Análisis de Seguridad y Estrés

```sql
SELECT 
    seguridad,
    estres,
    COUNT(*) AS total_usuarios
FROM usuario
WHERE seguridad IS NOT NULL AND estres IS NOT NULL
GROUP BY seguridad, estres
ORDER BY total_usuarios DESC;
```

## 5. Consultas de Programas

### 5.1 Todos los Programas con Información Completa

```sql
SELECT 
    p.id,
    p.nombre AS programa,
    f.nivel_formacion,
    m.modalidad,
    lc.linea AS linea_conocimiento
FROM programa p
JOIN Formacion f ON p.formacion = f.id
JOIN modalidad m ON p.modalidad = m.id
JOIN linea_conocimiento lc ON p.linea_conocimiento = lc.id
ORDER BY f.nivel_formacion, lc.linea, p.nombre;
```

### 5.2 Programas por Modalidad

```sql
SELECT 
    m.modalidad,
    COUNT(*) AS total_programas,
    GROUP_CONCAT(p.nombre SEPARATOR '; ') AS programas
FROM programa p
JOIN modalidad m ON p.modalidad = m.id
GROUP BY m.modalidad
ORDER BY total_programas DESC;
```

### 5.3 Programas por Línea de Conocimiento

```sql
SELECT 
    lc.linea,
    COUNT(*) AS total_programas,
    GROUP_CONCAT(CONCAT(f.nivel_formacion, ': ', p.nombre) SEPARATOR '; ') AS programas
FROM programa p
JOIN linea_conocimiento lc ON p.linea_conocimiento = lc.id
JOIN Formacion f ON p.formacion = f.id
GROUP BY lc.linea
ORDER BY total_programas DESC;
```

## 6. Consultas de Búsqueda

### 6.1 Buscar Usuario por Email

```sql
SELECT 
    u.nombre,
    u.email,
    u.celular,
    lc.linea AS profesion,
    f.nivel_formacion AS posgrado,
    m.modalidad AS modalidad_preferida
FROM usuario u
LEFT JOIN linea_conocimiento lc ON u.profesion = lc.id
LEFT JOIN Formacion f ON u.posgrado = f.id
LEFT JOIN modalidad m ON u.modalidades = m.id
WHERE u.email = 'email@ejemplo.com';
```

### 6.2 Buscar Programas por Nombre

```sql
SELECT 
    p.nombre AS programa,
    f.nivel_formacion,
    m.modalidad,
    lc.linea AS linea_conocimiento
FROM programa p
JOIN Formacion f ON p.formacion = f.id
JOIN modalidad m ON p.modalidad = m.id
JOIN linea_conocimiento lc ON p.linea_conocimiento = lc.id
WHERE p.nombre LIKE '%bioética%'
ORDER BY p.nombre;
```

## 7. Consultas de Mantenimiento

### 7.1 Verificar Integridad de Datos

```sql
-- Usuarios sin profesión asignada
SELECT COUNT(*) AS usuarios_sin_profesion 
FROM usuario 
WHERE profesion IS NULL OR profesion = '';

-- Usuarios sin posgrado asignado
SELECT COUNT(*) AS usuarios_sin_posgrado 
FROM usuario 
WHERE posgrado IS NULL OR posgrado = '';

-- Usuarios sin modalidad asignada
SELECT COUNT(*) AS usuarios_sin_modalidad 
FROM usuario 
WHERE modalidades IS NULL OR modalidades = '';
```

### 7.2 Últimos Registros

```sql
SELECT 
    u.nombre,
    u.email,
    u.created_at,
    lc.linea AS profesion,
    f.nivel_formacion AS posgrado
FROM usuario u
LEFT JOIN linea_conocimiento lc ON u.profesion = lc.id
LEFT JOIN Formacion f ON u.posgrado = f.id
ORDER BY u.created_at DESC
LIMIT 10;
```

---

## Notas de Uso

1. **LEFT JOIN vs INNER JOIN**: Se usa `LEFT JOIN` para incluir usuarios aunque no tengan valores asignados en las tablas relacionadas.

2. **Campos NULL**: Algunos usuarios pueden tener campos vacíos o NULL, por lo que las consultas incluyen verificaciones cuando es necesario.

3. **Rendimiento**: Para bases de datos grandes, considera agregar índices en los campos que se usan frecuentemente en WHERE y JOIN.

4. **Modificaciones**: Estas consultas están basadas en la estructura actual de la base de datos. Si se modifican las tablas, las consultas deberán actualizarse.