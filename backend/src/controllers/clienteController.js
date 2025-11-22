import * as service from '../services/clienteService.js';


async function cadastrar(req, res) {
    const {nome, email, senha, telefone} = req.body;

    if(!nome || !email || !senha){
        return res.status(400).json({erro: "campos obrigatórios não preenchidos "});
    }

    try {
        await service.CadastrarCliente(nome, email, senha, telefone);
        res.status(201).json({mensagem: "cliente cadastrado com sucesso"});
    }catch(erro){
        res.status(400).json({erro: erro.mensagem});
    }
    
}