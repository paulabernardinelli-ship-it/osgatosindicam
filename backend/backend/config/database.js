const sql = require('mssql');

const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: true, // Para Azure SQL
    trustServerCertificate: false,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool;

const connectDB = async () => {
  try {
    pool = await sql.connect(dbConfig);
    console.log('Conectado ao Azure SQL Database com sucesso!');
    return pool;
  } catch (err) {
    console.error('Erro ao conectar com o banco de dados:', err);
    throw err;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return pool;
};

const closeDB = async () => {
  try {
    if (pool) {
      await pool.close();
      console.log('Conexão com o banco de dados fechada.');
    }
  } catch (err) {
    console.error('Erro ao fechar conexão:', err);
  }
};

module.exports = {
  connectDB,
  getPool,
  closeDB,
  sql
};