import express from 'express';
import clienteRoutes from './routes/clienteRoutes.js';
import cors from 'cors';
import sacRoutes from "./routes/sacRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api', clienteRoutes);
app.use('/api', sacRoutes);





export default app;
