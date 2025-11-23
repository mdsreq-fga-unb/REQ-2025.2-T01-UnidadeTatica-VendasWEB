import bcrypt from 'bcrypt';
import * as repo from '../repositories/clienteRepository.js';

async function CadastrarCliente(nome, email, senha, telefone) {
    if(await repo.emailExiste(email)){
        throw new Error("e-mail já cadastrado");//
    }
    const senhaHash = await bcrypt.hash(senha, 10);

    const cliente = {
    nome, 
    email, 
    senhaHash,
    telefone
    };

    await repo.inserirCliente(cliente);

}

export {CadastrarCliente};

