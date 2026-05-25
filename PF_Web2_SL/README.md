# FleetOps Command — Proyecto Final Web 2

Sistema de gestión de flota con backend Node/Express, base de datos MySQL y
frontend estático. Incluye **login real con JWT** y está **dockerizado** para
desplegarse en cualquier dispositivo.

---

## 🚀 Opción 1: Levantar TODO con Docker (recomendado)

Requisito: tener **Docker Desktop** instalado.

Desde la carpeta raíz del proyecto (donde está `docker-compose.yml`):

```bash
docker compose up --build
```

Esto levanta dos contenedores:
- `fleetops_db` → MySQL 8 (carga `db/init.sql` automáticamente la primera vez)
- `fleetops_api` → el servidor Express, que **también sirve el frontend**

Cuando termine de arrancar, abre en el navegador:

```
http://localhost:3000/login.html
```

Para apagar todo:
```bash
docker compose down
```

Para borrar también la base de datos (empezar de cero):
```bash
docker compose down -v
```

---

## 🔑 Credenciales de prueba

```
Email:       admin@fleetops.com
Contraseña:  admin123
```

---

## 🧩 Opción 2: Desarrollo local (sin Docker)

Requisitos: Node.js 18+ y un MySQL corriendo.

1. Crea la base de datos ejecutando el script `db/init.sql` en tu MySQL.
2. Ajusta `backend/.env` con los datos de tu MySQL (host, puerto, usuario, contraseña).
3. Instala dependencias y arranca:

```bash
cd backend
npm install
npm start
```

4. Abre `http://localhost:3000/login.html`

---

## 📁 Estructura

```
PF_Web2/
├── docker-compose.yml      # Orquesta DB + API
├── Dockerfile              # Imagen del backend (sirve también el frontend)
├── db/
│   └── init.sql            # Esquema + datos de prueba + usuario admin
├── backend/
│   ├── server.js           # Servidor Express (API + frontend estático)
│   ├── config/db.js        # Pool de conexión a MySQL
│   ├── controllers/        # Lógica de vehículos y autenticación
│   ├── middleware/         # Verificación de token JWT
│   └── routes/             # Rutas de la API
└── frontend/
    ├── login.html          # Pantalla de inicio de sesión
    ├── dashboard.html      # Panel principal (protegido)
    ├── flota.html          # Gestión de vehículos (protegido)
    ├── inspeccion.html     # Inspecciones (protegido)
    ├── mantenimiento.html  # Mantenimiento (protegido)
    └── js/
        ├── auth.js         # Login, sesión, protección de vistas, logout
        ├── dashboard.js    # Métricas del dashboard
        └── flota.js        # CRUD de vehículos
```

---

## 🔒 Cómo funciona el login

1. El usuario inicia sesión en `login.html`. El backend valida el email y la
   contraseña (hasheada con **bcrypt**) y devuelve un **token JWT**.
2. El token se guarda en el navegador (`localStorage`).
3. Cada vista protegida verifica al cargar que exista una sesión; si no, redirige
   al login.
4. Todas las peticiones al API envían el token en la cabecera `Authorization`.
   Las rutas `/api/vehiculos` y `/api/metrics` están protegidas: sin token válido
   devuelven 401/403.
5. El botón "Sign Out" borra la sesión y vuelve al login.

> No hay manejo de roles: cualquier usuario autenticado tiene el mismo acceso.
