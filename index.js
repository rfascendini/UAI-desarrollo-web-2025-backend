import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// usar la variable del .env o un valor por defecto
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hola Mundo!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});