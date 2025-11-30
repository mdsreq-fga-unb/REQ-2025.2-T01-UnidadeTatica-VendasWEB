import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Client } = pg;

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false }
});

async function runMigrations() {
  console.log('🔄 Conectando ao banco de dados...');
  await client.connect();
  console.log('✅ Conectado!');

  const migrationsDir = path.join(__dirname, '../migrations/postgres');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    console.log(`\n📝 Executando: ${file}`);
    try {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await client.query(sql);
      console.log(`✅ ${file} executado com sucesso!`);
    } catch (error) {
      console.log(`⚠️  ${file}: ${error.message}`);
    }
  }

  await client.end();
  console.log('\n✅ Migrações concluídas!');
  process.exit(0);
}

runMigrations().catch(err => {
  console.error('❌ Erro:', err);
  process.exit(1);
});
