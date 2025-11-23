console.log(">>> CARREGOU clienteRoutes.js");

import express from 'express';
import {cadastrar} from '../controllers/clienteController.js'

const router = express.Router();

router.get('/debug', (req, res) => {
    res.send('router funcionando');
});

router.post('/clientes', cadastrar);

export default router;