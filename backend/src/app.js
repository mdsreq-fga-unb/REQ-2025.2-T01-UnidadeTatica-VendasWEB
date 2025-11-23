

import express from 'express';
import clienteRoutes from './routes/clienteRoutes.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api', clienteRoutes);





export default app;
