import express from 'express';
import clienteRoutes from './routes/clienteRoutes.js';
import cors from 'cors';
import sacRoutes from "./routes/sacRoutes.js";

const app = express();

// Configurar CORS para produção e desenvolvimento
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://unidade-tatica-frontend.onrender.com',
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL
].filter(Boolean);

console.log('🌐 CORS - Origens permitidas:', allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    console.log('🔍 CORS - Origem da requisição:', origin);
    
    // Permitir requisições sem origin (mobile apps, Postman, curl, etc)
    if (!origin) {
      console.log('✅ CORS - Permitido (sem origin)');
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      console.log('✅ CORS - Permitido:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS - Bloqueado:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api', clienteRoutes);
app.use('/api', sacRoutes);





export default app;
