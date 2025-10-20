import { db } from "../config/db.js";

export const listarMedicos = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id, nome, email, crm, especialidade, telefone, celular, foto_url
      FROM usuarios
      WHERE tipo_usuario = 'medico' AND ativo = true
      ORDER BY nome
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar médicos" });
  }
};

export const listarPacientes = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id, nome, email, cpf, data_nascimento, telefone, celular, foto_url
      FROM usuarios
      WHERE tipo_usuario = 'paciente' AND ativo = true
      ORDER BY nome
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar pacientes" });
  }
};

export const obterUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT
        id, nome, email, tipo_usuario, cpf, data_nascimento,
        telefone, celular, foto_url, cep, endereco, numero,
        complemento, bairro, cidade, estado, crm, especialidade
      FROM usuarios
      WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar usuário" });
  }
};
