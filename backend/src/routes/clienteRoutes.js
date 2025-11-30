import express from 'express';
import {cadastrar} from '../controllers/clienteController.js'

const router = express.Router();


router.post('/clientes', cadastrar);

export default router;