import express from 'express';
import dotenv from 'dotenv'; 
import { connectToMongoDB } from './libs/mongodb';


// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Crear una instancia de Express
const app = express();

// Usar la variable del .env o un valor por defecto
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectToMongoDB();

// Definir una ruta simple para probar el servidor
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

