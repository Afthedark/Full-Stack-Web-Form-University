# Guía: Docker Compose con MariaDB

## 📋 Descripción
Este archivo contiene los comandos e instrucciones para crear, ejecutar, detener, reiniciar y gestionar un contenedor de MariaDB usando Docker Compose.

---

## 📁 Estructura de archivos necesaria

```
docker/
├── docker-compose.yml
├── mysql-init/          # (Opcional) Scripts SQL para inicializar la base de datos
├── mysql-config/
│   └── my.cnf          # (Opcional) Configuración personalizada de MariaDB
└── README.md           # (Este archivo)
```

---

## 🚀 Crear y ejecutar el contenedor

### 1. Crear el archivo `docker-compose.yml`

```yaml
version: '3.8'  # Opcional: puede ser eliminado en versiones nuevas de Docker Compose

services:
  mysql:
    image: mariadb:10.6
    container_name: mysql-db
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: test_posgrados_ubosque
      MYSQL_USER: appuser
      MYSQL_PASSWORD: apppassword
    command: --innodb-buffer-pool-size=128M --innodb-log-file-size=16M --innodb-flush-method=fsync --explicit-defaults-for-timestamp=1
    ports:
      - "3308:3306"  # Puerto local:3308 -> Puerto del contenedor:3306
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql-init:/docker-entrypoint-initdb.d
      - ./mysql-config/my.cnf:/etc/mysql/conf.d/custom.cnf
    networks:
      - app-network

volumes:
  mysql_data:

networks:
  app-network:
    driver: bridge
```

### 2. Ejecutar el contenedor

```bash
# Navegar al directorio donde está el docker-compose.yml
cd docker/

# Iniciar los servicios (en primer plano)
docker-compose up

# O iniciar en segundo plano (detached mode)
docker-compose up -d
```

---

## 🛑 Detener el contenedor

```bash
# Detener los servicios (desde el directorio del docker-compose.yml)
docker-compose stop

# O detener y eliminar contenedores, redes, etc. (sin eliminar volúmenes)
docker-compose down

# O detener y eliminar contenedores, redes y volúmenes (¡CUIDADO! Esto borra los datos)
docker-compose down -v
```

---

## 🔄 Reiniciar el contenedor

```bash
# Si ya está corriendo, detener y volver a iniciar
docker-compose restart mysql-db

# O detener completamente y volver a iniciar
docker-compose down
docker-compose up -d
```

---

## 🗑️ Eliminar completamente el contenedor y sus datos

```bash
# Detener y eliminar contenedores, redes, volúmenes y redes
docker-compose down -v

# Opcional: Eliminar la imagen (libera espacio)
docker rmi mariadb:10.6
```

---

## 🔁 Volver a ejecutar el archivo YAML después de reiniciar la computadora

Después de reiniciar tu computadora:

1. Asegúrate de que Docker Desktop esté corriendo
2. Navega al directorio donde tienes tu `docker-compose.yml`
3. Ejecuta:

```bash
# Si ya tienes el archivo docker-compose.yml en el directorio
cd docker/
docker-compose up -d
```

> 💡 **Consejo:** Si quieres que el contenedor se inicie automáticamente al arrancar Docker, puedes usar herramientas como `docker-compose up -d --restart unless-stopped`, pero en Docker Compose se recomienda usar `restart: unless-stopped` en el archivo YAML:

```yaml
services:
  mysql:
    # ... otras configuraciones ...
    restart: unless-stopped
```

---

## 🔌 Gestión de puertos

### ¿Cómo funciona el mapeo de puertos?

```yaml
ports:
  - "3308:3306"  # Puerto local:3306 -> Puerto del contenedor:3306
```

- **3306**: Puerto interno del contenedor donde MariaDB escucha
- **3308**: Puerto externo de tu máquina local donde accederás
- Formato: `"PUERTO_LOCAL:PUERTO_CONTENEDOR"`

### ¿Qué hacer si el puerto está ocupado?

1. Verifica qué proceso usa el puerto:
   ```bash
   # En Windows
   netstat -ano | findstr :3306

   # En Linux/Mac
   lsof -i :3306
   ```

2. Cambia el puerto local en `docker-compose.yml`:
   ```yaml
   ports:
     - "3309:3306"  # Cambiado a puerto 3309 local
   ```

3. Asegúrate de usar el nuevo puerto en tu aplicación/cliente (ej: MySQL Workbench: puerto 3309)

---

## 📊 Comandos útiles

```bash
# Verificar estado de contenedores
docker-compose ps

# Ver logs del contenedor
docker-compose logs mysql-db

# Ver logs en tiempo real
docker-compose logs -f mysql-db

# Ejecutar comandos dentro del contenedor
docker exec -it mysql-db mysql -u appuser -papppassword

# Verificar volumenes
docker volume ls

# Verificar redes
docker network ls
```

---

## 📝 Conexión desde aplicaciones externas

- **Hostname:** `localhost` o `127.0.0.1`
- **Port:** `3308` (o el puerto que hayas configurado)
- **Username:** `appuser`
- **Password:** `apppassword`
- **Database:** `test_posgrados_ubosque`

---

## ⚠️ Precauciones

- `docker-compose down -v` **elimina permanentemente** los datos de la base de datos
- Asegúrate de tener el archivo `docker-compose.yml` en el directorio correcto
- Verifica que no haya otros servicios usando los puertos que defines
- Si cambias el puerto en el YAML, recuerda actualizar tu aplicación/cliente para usar el nuevo puerto