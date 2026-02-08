# 🚀 Mi Tienda Tech - Full Stack E-commerce
**Para empezar, este proyecto fue Realizado por Luis Rodríguez, Estudiante de la Universidad Valle de Momboy, actualmente cursando la materia Front End II**
**Mi Tienda Tech** es una plataforma robusta de comercio electrónico desarrollada con el stack **MERN** (MongoDB, Express, React, Node.js). El proyecto implementa un sistema completo de autenticación, gestión de perfiles, catálogo dinámico y un panel administrativo avanzado.

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React, Chakra UI (Diseño Responsivo), Axios, React Router Dom.
- **Backend:** Node.js, Express.
- **Base de Datos:** MongoDB & Mongoose.
- **Seguridad:** JSON Web Tokens (JWT) y encriptación de contraseñas.

---

## 📋 Requerimientos Implementados (Rúbrica)

### ✅ Autenticación y Seguridad
- **Sistema JWT:** Flujo completo de Login y Logout con persistencia de estado.
- **Registro Avanzado:** Captura de Nombre, Apellido, Email y Password con **confirmación de contraseña**.
- **Roles de Usuario:** Diferenciación clara entre `user` y `admin` con rutas protegidas.

### ✅ Catálogo y Productos
- **Filtros Dinámicos:** Filtrado por categorías directamente desde la base de datos.
- **Regla de Negocio (Stock):** Los productos con existencia 0 se ocultan automáticamente del catálogo.
- **Paginación:** Implementada tanto en Backend como en Frontend para optimizar el rendimiento.
- **Volumen de Datos:** El sistema cuenta con más de 20 productos registrados.

### ✅ Funcionalidades del Usuario
- **Perfil Editable:** El usuario puede modificar su nombre, apellido, teléfono y dirección.
- **Sistema de Favoritos:** Persistencia en MongoDB para que el usuario mantenga sus productos favoritos entre sesiones.
- **Renderizado Dinámico:** Mensajes condicionales en la sección de favoritos ("Aún no tienes productos favoritos 💔").

### ✅ Panel Administrativo
- **Control de Usuarios:** Sección exclusiva para que el administrador vea la lista de todas las personas registradas.
- **Edición Global:** El administrador tiene la facultad de editar la información de cualquier usuario del sistema.
- **Gestión de Inventario:** Solo el rol `admin` tiene acceso a la creación y modificación de productos.

---

## ⚙️ Configuración del Entorno

### 1. Variables de Entorno (Backend)
Crea un archivo `.env` en la carpeta del servidor con:
```env
PORT=5000
MONGO_URI=tu_cadena_de_conexion_mongodb
JWT_SECRET=tu_clave_secreta_segura

### 2. Instalar dependencias del servidor
cd server
npm install

### 3. Instalar dependencias del cliente
cd client
npm install
