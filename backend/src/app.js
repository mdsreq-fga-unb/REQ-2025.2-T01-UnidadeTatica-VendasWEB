import express from 'express';
import clienteRoutes from './routes/clienteRoutes.js';
import cors from 'cors';
import sacRoutes from "./routes/sacRoutes.js";

const app = express();

// Configurar CORS para produção e desenvolvimento
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requisições sem origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api', clienteRoutes);
app.use('/api', sacRoutes);





export default app;
