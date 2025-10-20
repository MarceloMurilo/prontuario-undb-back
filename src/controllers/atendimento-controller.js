import { db } from "../config/db.js";

export const criarAtendimento = async (req, res) => {
  try {
    const {
      paciente_id,
      medico_id,
      data_atendimento,
      tipo_atendimento,
      queixa_principal,
      historia_doenca_atual,
      exame_fisico,
      hipotese_diagnostica,
      diagnostico_definitivo,
      pressao_arterial,
      frequencia_cardiaca,
      temperatura,
      peso,
      altura,
      prescricao,
      orientacoes,
      encaminhamento,
      atestado_dias,
      observacoes
    } = req.body;

    // Calcular IMC se peso e altura forem fornecidos
    let imc = null;
    if (peso && altura) {
      imc = (peso / (altura * altura)).toFixed(2);
    }

    const result = await db.query(
      `INSERT INTO atendimentos (
        paciente_id, medico_id, data_atendimento, tipo_atendimento,
        queixa_principal, historia_doenca_atual, exame_fisico,
        hipotese_diagnostica, diagnostico_definitivo,
        pressao_arterial, frequencia_cardiaca, temperatura, peso, altura, imc,
        prescricao, orientacoes, encaminhamento, atestado_dias, observacoes,
        status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, 'concluido'
      ) RETURNING id`,
      [
        paciente_id, medico_id, data_atendimento || new Date(), tipo_atendimento || 'consulta',
        queixa_principal, historia_doenca_atual, exame_fisico,
        hipotese_diagnostica, diagnostico_definitivo,
        pressao_arterial, frequencia_cardiaca, temperatura, peso, altura, imc,
        prescricao, orientacoes, encaminhamento, atestado_dias, observacoes
      ]
    );

    res.status(201).json({
      message: "Atendimento criado com sucesso!",
      id: result.rows[0].id
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ erro: "Erro ao criar atendimento" });
  }
};

export const listarAtendimentos = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        a.*,
        p.nome AS nome_paciente,
        p.cpf AS cpf_paciente,
        p.data_nascimento AS data_nascimento_paciente,
        m.nome AS nome_medico,
        m.crm AS crm_medico,
        m.especialidade AS especialidade_medico
      FROM atendimentos a
      LEFT JOIN usuarios p ON a.paciente_id = p.id
      LEFT JOIN usuarios m ON a.medico_id = m.id
      ORDER BY a.data_atendimento DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar atendimentos" });
  }
};

export const obterAtendimento = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT
        a.*,
        p.nome AS nome_paciente,
        p.cpf AS cpf_paciente,
        p.data_nascimento AS data_nascimento_paciente,
        p.telefone AS telefone_paciente,
        p.celular AS celular_paciente,
        m.nome AS nome_medico,
        m.crm AS crm_medico,
        m.especialidade AS especialidade_medico
      FROM atendimentos a
      LEFT JOIN usuarios p ON a.paciente_id = p.id
      LEFT JOIN usuarios m ON a.medico_id = m.id
      WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Atendimento não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar atendimento" });
  }
};

export const atualizarAtendimento = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      queixa_principal,
      historia_doenca_atual,
      exame_fisico,
      hipotese_diagnostica,
      diagnostico_definitivo,
      pressao_arterial,
      frequencia_cardiaca,
      temperatura,
      peso,
      altura,
      prescricao,
      orientacoes,
      encaminhamento,
      atestado_dias,
      observacoes
    } = req.body;

    // Calcular IMC se peso e altura forem fornecidos
    let imc = null;
    if (peso && altura) {
      imc = (peso / (altura * altura)).toFixed(2);
    }

    await db.query(
      `UPDATE atendimentos
       SET
         status = COALESCE($1, status),
         queixa_principal = COALESCE($2, queixa_principal),
         historia_doenca_atual = COALESCE($3, historia_doenca_atual),
         exame_fisico = COALESCE($4, exame_fisico),
         hipotese_diagnostica = COALESCE($5, hipotese_diagnostica),
         diagnostico_definitivo = COALESCE($6, diagnostico_definitivo),
         pressao_arterial = COALESCE($7, pressao_arterial),
         frequencia_cardiaca = COALESCE($8, frequencia_cardiaca),
         temperatura = COALESCE($9, temperatura),
         peso = COALESCE($10, peso),
         altura = COALESCE($11, altura),
         imc = COALESCE($12, imc),
         prescricao = COALESCE($13, prescricao),
         orientacoes = COALESCE($14, orientacoes),
         encaminhamento = COALESCE($15, encaminhamento),
         atestado_dias = COALESCE($16, atestado_dias),
         observacoes = COALESCE($17, observacoes),
         atualizado_em = NOW()
       WHERE id = $18`,
      [
        status, queixa_principal, historia_doenca_atual, exame_fisico,
        hipotese_diagnostica, diagnostico_definitivo,
        pressao_arterial, frequencia_cardiaca, temperatura, peso, altura, imc,
        prescricao, orientacoes, encaminhamento, atestado_dias, observacoes,
        id
      ]
    );

    res.json({ message: "Atendimento atualizado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ erro: "Erro ao atualizar atendimento" });
  }
};

export const historicoPaciente = async (req, res) => {
  try {
    const { paciente_id } = req.params;

    const result = await db.query(
      `SELECT
        a.*,
        m.nome AS nome_medico,
        m.crm AS crm_medico,
        m.especialidade AS especialidade_medico
       FROM atendimentos a
       LEFT JOIN usuarios m ON a.medico_id = m.id
       WHERE a.paciente_id = $1
       ORDER BY a.data_atendimento DESC`,
      [paciente_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar histórico do paciente" });
  }
};
