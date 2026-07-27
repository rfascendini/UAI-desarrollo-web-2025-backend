# 5YA CS1.6 - Backend

Proyecto backend del Trabajo Práctico Integrador de Desarrollo Web 2025, desarrollado como API REST para administrar usuarios y salas de Counter-Strike 1.6 en formato 5 vs 5.

El backend se encarga de validar requests, proteger rutas privadas, verificar tokens de Firebase, aplicar reglas de negocio y persistir datos en MongoDB Atlas.

## Tecnologías utilizadas

- Node.js
- Express
- TypeScript
- MongoDB Atlas
- Mongoose
- Joi
- Firebase Admin
- Autenticación con JWT gestionado por Firebase
- CORS
- Vercel para deploy

## Consigna del TP

### Desarrollar y presentar

- Proyecto Frontend alojado en repositorio Github a nombre del alumno.
- Proyecto Backend alojado en repositorio Github a nombre del alumno.
- Ambos repositorios deben contener código prolijo, segmentado en commits.
- Ambos proyectos deben estar hosteados en la nube por separado, cada uno debe poder accederse a través de una URL y deben comunicarse entre sí a través del protocolo HTTP.
- Base de datos hosteada en la nube, la cual será consumida por el proyecto backend.

La temática del proyecto es libre. Se puede utilizar cualquier tecnología siempre y cuando se respete la arquitectura API REST. Recomendación/sugerencia: stack MERN.

### Funcionalidad mínima requerida

- Ruta pública en el Frontend que visualice datos traídos desde el backend.
- Ruta pública de login en el Frontend que permita ingresar usuario y contraseña para iniciar sesión, con sus respectivas validaciones.
- Ruta privada en el Frontend, accesible solo con sesión iniciada, con un CRUD de datos guardados en la base de datos, con sus respectivas validaciones.
- El CRUD debe afectar de forma directa los datos que se muestran en la pantalla pública.
- Manejo de estado global.
- Login y registro de usuarios tanto en Backend como en Frontend.
- Funcionalidad de Logout en el Frontend y redirección al Home.

### Tecnologías recomendadas

- Frontend: Vite, React, Flexbox, React Router DOM, Redux Toolkit, Joi y React Hook Forms, Firebase, Autenticación con JWT.
- Backend: Node.js, Express, MongoDB, Mongoose, Joi, Firebase, Autenticación con JWT.
- Cloud Server: Vercel para Frontend y Render para Backend.

### Proceso de evaluación del examen final

1. Abrir la aplicación web cliente en Google Chrome, deployada en Vercel.
2. Visitar la página pública y verificar que los datos que se muestran están en la base de datos.
3. Acceder a la pantalla de login, verificando el manejo de errores, y al loguearse que redirija a la página privada.
4. Desde la página privada, ver el listado completo, dar de alta, eliminar y modificar los datos, y verificar que se actualizan en la base de datos.
5. Al eliminar se debe visualizar un popup o modal de confirmación, que permita cancelar o confirmar la operación.
6. Hacer logout y que se redirija a la página pública.
7. Ingresar por URL a la página privada estando deslogueado, y verificar que no permita acceder, o que redirija a la pantalla de login.
8. Revisar la calidad del código del Backend y del Frontend en Github y el correcto uso de las tecnologías mencionadas.
9. Correcta utilización de git/github, trabajo colaborativo e historial de commits.
10. Revisar el correcto entendimiento de las funcionalidades desarrolladas, revisando el código y charlando sobre el flujo de datos en la aplicación.

CRUD: Crear, Leer, Actualizar y Eliminar. En este proyecto la eliminación de salas se implementa como baja lógica mediante el campo `isDeleted` en MongoDB.

## Arquitectura

La aplicación usa una arquitectura cliente-servidor:

- El frontend en React consume datos mediante HTTP.
- El backend expone una API REST con Express.
- Firebase Authentication gestiona usuarios y emite tokens.
- Firebase Admin valida los tokens recibidos por el backend.
- MongoDB Atlas guarda usuarios, salas y participantes.

El login se realiza con Firebase desde el frontend. Luego, el frontend envía el token de Firebase en cada request privada:

```http
Authorization: Bearer <firebase_id_token>
```

El backend valida ese token con `admin.auth().verifyIdToken()` y busca el usuario asociado en MongoDB mediante `firebaseUID`.

## Endpoints principales

| Método | Endpoint | Acceso | Descripción |
| --- | --- | --- | --- |
| `GET` | `/system/status` | Público | Verifica que la API esté funcionando. |
| `POST` | `/api/users/register` | Público | Registra usuario en Firebase y MongoDB. |
| `GET` | `/api/users/me` | Privado | Devuelve el perfil del usuario logueado. |
| `PATCH` | `/api/users/me` | Privado | Actualiza nombre, apellido y usuario. |
| `DELETE` | `/api/users/me` | Privado | Da de baja la cuenta del usuario. |
| `GET` | `/api/rooms/public` | Público | Lista salas activas para la pantalla pública. |
| `GET` | `/api/rooms` | Privado | Lista salas con datos según el usuario logueado. |
| `POST` | `/api/rooms` | Privado | Crea una sala. |
| `PATCH` | `/api/rooms/:id` | Privado | Edita una sala. |
| `POST` | `/api/rooms/:id/join` | Privado | Permite unirse a una sala. |
| `POST` | `/api/rooms/:id/leave` | Privado | Permite abandonar una sala. |
| `POST` | `/api/rooms/:id/close` | Privado | Elimina una sala mediante baja lógica. |
| `POST` | `/api/rooms/:id/kick` | Privado | Expulsa a un jugador de la sala. |
| `POST` | `/api/rooms/:id/move` | Privado | Mueve a un jugador de posición. |
| `POST` | `/api/rooms/:id/transfer` | Privado | Transfiere el liderazgo de la sala. |

## Modelos principales

### User

Guarda los datos propios de la aplicación:

- `firstName`
- `lastName`
- `username`
- `email`
- `firebaseUID`
- `isActive`

Firebase no reemplaza a MongoDB. Firebase autentica y MongoDB guarda los datos de negocio.

### Room

Guarda los datos de cada sala:

- `name`
- `description`
- `users`
- `createdBy`
- `max_players`
- `isPrivate`
- `roomPassword`
- `serverIP`
- `serverPort`
- `serverPassword`
- `isDeleted`

Las salas eliminadas se marcan con `isDeleted: true`, por lo que dejan de aparecer en los listados activos.

## Validaciones y seguridad

- Joi valida los datos que llegan al backend.
- Mongoose valida la estructura de los documentos.
- Firebase Admin valida los tokens de sesión.
- Las rutas privadas requieren `Authorization: Bearer <token>`.
- Las contraseñas de sala privada se guardan hasheadas con bcrypt.
- Las credenciales y claves se manejan mediante variables de entorno.
- CORS permite definir el origen habilitado del frontend.

## Variables de entorno

El archivo `.env.example` contiene las variables necesarias:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.example.mongodb.net/uai_dw_tp_2025
MONGODB_DB_NAME=uai_dw_tp_2025
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
CLIENT_ORIGIN=https://uai-mdw-2025-fe.vercel.app
PORT=3000
```

## Ejecutar localmente

```bash
npm install
npm run dev
```

Para validar TypeScript:

```bash
npm run check
```

Para generar build:

```bash
npm run build
```

## Links del proyecto

| Recurso | Link |
| --- | --- |
| Backend deployado | https://uai-mdw-2025-be.vercel.app |
| Healthcheck backend | https://uai-mdw-2025-be.vercel.app/system/status |
| Frontend deployado | https://uai-mdw-2025-fe.vercel.app |
| Repositorio Backend | https://github.com/rfascendini/UAI-desarrollo-web-2025-backend |
| Repositorio Frontend | https://github.com/rfascendini/UAI-desarrollo-web-2025-frontend |
