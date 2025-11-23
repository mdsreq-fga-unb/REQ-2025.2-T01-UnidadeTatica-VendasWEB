console.log("CARREGOU O APP.JS CORRETO!!!");

import express from 'express';
import clienteRoutes from './routes/clienteRoutes.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

console.log("DEBUG: Rotas carregadas");
console.log(clienteRoutes);

app.get('/api/debug-app', (req, res) => {
  res.send("debug direto do app");
});


app.use('/api', clienteRoutes);

app.get('/ping', (req, res) => {
  res.send('pong');
});



export default app;
