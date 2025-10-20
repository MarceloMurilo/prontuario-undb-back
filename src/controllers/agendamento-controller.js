import { db } from "../config/db.js";

export const criarAgendamento = async (req, res) => {
  try {
    const {
      paciente_id,
      medico_id,
      data_hora,
      duracao_minutos,
      tipo_consulta,
      motivo,
      observacoes
    } = req.body;

    const result = await db.query(
      `INSERT INTO agendamentos (
        paciente_id, medico_id, data_hora, duracao_minutos,
        tipo_consulta, motivo, observacoes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'agendado')
      RETURNING id`,
      [paciente_id, medico_id, data_hora, duracao_minutos || 30, tipo_consulta, motivo, observacoes]
    );

    res.status(201).json({
      message: "Agendamento criado com sucesso!",
      id: result.rows[0].id
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ erro: "Erro ao criar agendamento" });
  }
};

export const listarAgendamentos = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        a.*,
        p.nome AS nome_paciente,
        p.telefone AS telefone_paciente,
        p.celular AS celular_paciente,
        m.nome AS nome_medico,
        m.crm AS crm_medico,
        m.especialidade AS especialidade_medico
      FROM agendamentos a
      LEFT JOIN usuarios p ON a.paciente_id = p.id
      LEFT JOIN usuarios m ON a.medico_id = m.id
      ORDER BY a.data_hora DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar agendamentos" });
  }
};

export const agendamentosPaciente = async (req, res) => {
  try {
    const { paciente_id } = req.params;
    const result = await db.query(
      `SELECT
        a.*,
        m.nome AS nome_medico,
        m.crm AS crm_medico,
        m.especialidade AS especialidade_medico
      FROM agendamentos a
      LEFT JOIN usuarios m ON a.medico_id = m.id
      WHERE a.paciente_id = $1
      ORDER BY a.data_hora DESC`,
      [paciente_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar agendamentos do paciente" });
  }
};

export const agendamentosMedico = async (req, res) => {
  try {
    const { medico_id } = req.params;
    const result = await db.query(
      `SELECT
        a.*,
        p.nome AS nome_paciente,
        p.telefone AS telefone_paciente,
        p.celular AS celular_paciente
      FROM agendamentos a
      LEFT JOIN usuarios p ON a.paciente_id = p.id
      WHERE a.medico_id = $1
      ORDER BY a.data_hora DESC`,
      [medico_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar agendamentos do médico" });
  }
};

export const atualizarAgendamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, data_hora, observacoes } = req.body;

    await db.query(
      `UPDATE agendamentos
       SET
         status = COALESCE($1, status),
         data_hora = COALESCE($2, data_hora),
         observacoes = COALESCE($3, observacoes),
         atualizado_em = NOW()
       WHERE id = $4`,
      [status, data_hora, observacoes, id]
    );

    res.json({ message: "Agendamento atualizado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ erro: "Erro ao atualizar agendamento" });
  }
};
