import bcrypt from 'bcrypt';

const password = 'senha123';
const hash = await bcrypt.hash(password, 10);
console.log('Hash gerado:', hash);
