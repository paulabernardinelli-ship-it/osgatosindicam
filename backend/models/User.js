const { getPool, sql } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Criar tabela de usuários (executar uma vez)
  static async createTable() {
    try {
      const pool = getPool();
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
        CREATE TABLE users (
          id INT IDENTITY(1,1) PRIMARY KEY,
          name NVARCHAR(100) NOT NULL,
          email NVARCHAR(255) UNIQUE NOT NULL,
          password NVARCHAR(255) NOT NULL,
          created_at DATETIME2 DEFAULT GETDATE(),
          updated_at DATETIME2 DEFAULT GETDATE()
        )
      `);
      console.log('Tabela users verificada/criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar tabela:', error);
      throw error;
    }
  }

  // Criar usuário
  static async create(userData) {
    try {
      const { name, email, password } = userData;
      const hashedPassword = await bcrypt.hash(password, 12);

      const pool = getPool();
      const result = await pool.request()
        .input('name', sql.NVarChar, name)
        .input('email', sql.NVarChar, email)
        .input('password', sql.NVarChar, hashedPassword)
        .query(`
          INSERT INTO users (name, email, password) 
          OUTPUT INSERTED.* 
          VALUES (@name, @email, @password)
        `);

      return result.recordset[0];
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('email', sql.NVarChar, email)
        .query('SELECT * FROM users WHERE email = @email');

      return result.recordset[0] || null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  // Buscar usuário por ID
  static async findById(id) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT id, name, email, created_at FROM users WHERE id = @id');

      return result.recordset[0] || null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  // Atualizar usuário
  static async update(id, userData) {
    try {
      const { name, email } = userData;
      const pool = getPool();
      
      const result = await pool.request()
        .input('id', sql.Int, id)
        .input('name', sql.NVarChar, name)
        .input('email', sql.NVarChar, email)
        .query(`
          UPDATE users 
          SET name = @name, email = @email, updated_at = GETDATE() 
          OUTPUT INSERTED.* 
          WHERE id = @id
        `);

      return result.recordset[0];
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  // Deletar usuário
  static async delete(id) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM users WHERE id = @id');

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }

  // Listar todos os usuários
  static async findAll() {
    try {
      const pool = getPool();
      const result = await pool.request()
        .query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC');

      return result.recordset;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  // Verificar senha
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;