import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

export const db = new Pool({
  connectionString: process.env.PG_URI,
  ssl: { rejectUnauthorized: false }
});

async function criarTabelas() {
  try {
    // Criar tabela de usuários básica primeiro
    await db.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        tipo_usuario VARCHAR(20) CHECK (tipo_usuario IN ('admin','medico','paciente')) NOT NULL,
        criado_em TIMESTAMP DEFAULT NOW(),
        atualizado_em TIMESTAMP DEFAULT NOW()
      );
    `);

    // Adicionar novas colunas à tabela usuarios se não existirem
    await db.query(`
      DO $$
      BEGIN
        -- Dados pessoais
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='cpf') THEN
          ALTER TABLE usuarios ADD COLUMN cpf VARCHAR(14) UNIQUE;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='data_nascimento') THEN
          ALTER TABLE usuarios ADD COLUMN data_nascimento DATE;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='telefone') THEN
          ALTER TABLE usuarios ADD COLUMN telefone VARCHAR(20);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='celular') THEN
          ALTER TABLE usuarios ADD COLUMN celular VARCHAR(20);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='foto_url') THEN
          ALTER TABLE usuarios ADD COLUMN foto_url TEXT;
        END IF;

        -- Endereço
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='cep') THEN
          ALTER TABLE usuarios ADD COLUMN cep VARCHAR(9);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='endereco') THEN
          ALTER TABLE usuarios ADD COLUMN endereco VARCHAR(255);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='numero') THEN
          ALTER TABLE usuarios ADD COLUMN numero VARCHAR(10);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='complemento') THEN
          ALTER TABLE usuarios ADD COLUMN complemento VARCHAR(100);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='bairro') THEN
          ALTER TABLE usuarios ADD COLUMN bairro VARCHAR(100);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='cidade') THEN
          ALTER TABLE usuarios ADD COLUMN cidade VARCHAR(100);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='estado') THEN
          ALTER TABLE usuarios ADD COLUMN estado VARCHAR(2);
        END IF;

        -- Dados profissionais
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='crm') THEN
          ALTER TABLE usuarios ADD COLUMN crm VARCHAR(20);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='especialidade') THEN
          ALTER TABLE usuarios ADD COLUMN especialidade VARCHAR(100);
        END IF;

        -- Controle
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='ativo') THEN
          ALTER TABLE usuarios ADD COLUMN ativo BOOLEAN DEFAULT true;
        END IF;
      END $$;
    `);

    // Criar tabela de atendimentos
    await db.query(`
      CREATE TABLE IF NOT EXISTS atendimentos (
        id SERIAL PRIMARY KEY,
        paciente_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        medico_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
        data_atendimento TIMESTAMP DEFAULT NOW(),
        tipo_atendimento VARCHAR(50) DEFAULT 'consulta',
        status VARCHAR(30) DEFAULT 'agendado',
        queixa_principal TEXT,
        historia_doenca_atual TEXT,
        exame_fisico TEXT,
        hipotese_diagnostica TEXT,
        diagnostico_definitivo TEXT,
        pressao_arterial VARCHAR(20),
        frequencia_cardiaca INTEGER,
        temperatura DECIMAL(4,1),
        peso DECIMAL(5,2),
        altura DECIMAL(4,2),
        imc DECIMAL(4,2),
        prescricao TEXT,
        orientacoes TEXT,
        encaminhamento TEXT,
        atestado_dias INTEGER,
        observacoes TEXT,
        criado_em TIMESTAMP DEFAULT NOW(),
        atualizado_em TIMESTAMP DEFAULT NOW()
      );
    `);

    // Adicionar colunas novas de atendimentos se não existirem
    await db.query(`
      DO $$
      BEGIN
        -- Colunas antigas (compatibilidade)
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='atendimentos' AND column_name='tipo_exame') THEN
          ALTER TABLE atendimentos ADD COLUMN tipo_exame VARCHAR(100);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='atendimentos' AND column_name='diagnostico') THEN
          ALTER TABLE atendimentos ADD COLUMN diagnostico TEXT;
        END IF;

        -- Novas colunas
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='atendimentos' AND column_name='data_atendimento') THEN
          ALTER TABLE atendimentos ADD COLUMN data_atendimento TIMESTAMP DEFAULT NOW();
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='atendimentos' AND column_name='tipo_atendimento') THEN
          ALTER TABLE atendimentos ADD COLUMN tipo_atendimento VARCHAR(50) DEFAULT 'consulta';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='atendimentos' AND column_name='queixa_principal') THEN
          ALTER TABLE atendimentos ADD COLUMN queixa_principal TEXT;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='atendimentos' AND column_name='historia_doenca_atual') THEN
          ALTER TABLE atendimentos ADD COLUMN historia_doenca_atual TEXT;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='atendimentos' AND column_name='exame_fisico') THEN
          ALTER TABLE atendimentos ADD COLUMN exame_fisico TEXT;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='atendimentos' AND column_name='hipotese_diagnostica') THEN
          ALTER TABLE atendimentos ADD COLUMN hipotese_diagnostica TEXT;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='atendimentos' AND column_name='diagnostico_definitivo') THEN
          ALTER TABLE atendimentos ADD COLUMN diagnostico_definitivo TEXT;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='atendimentos' AND column_name='pressao_arterial') THEN
          ALTER TABLE atendimentos ADD COLUMN pressao_arterial VARCHAR(20);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='atendimentos' AND column_name='frequencia_cardiaca') THEN
          ALTER TABLE atendimentos ADD COLUMN frequencia_cardiaca INTEGER;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='atendimentos' AND column_name='temperatura') THEN
          ALTER TABLE atendimentos ADD COLUMN temperatura DECIMAL(4,1);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='atendimentos' AND column_name='peso') THEN
          ALTER TABLE atendimentos ADD COLUMN peso DECIMAL(5,2);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='atendimentos' AND column_name='altura') THEN
          ALTER TABLE atendimentos ADD COLUMN altura DECIMAL(4,2);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='atendimentos' AND column_name='imc') THEN
          ALTER TABLE atendimentos ADD COLUMN imc DECIMAL(4,2);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='atendimentos' AND column_name='prescricao') THEN
          ALTER TABLE atendimentos ADD COLUMN prescricao TEXT;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='atendimentos' AND column_name='orientacoes') THEN
          ALTER TABLE atendimentos ADD COLUMN orientacoes TEXT;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='atendimentos' AND column_name='atestado_dias') THEN
          ALTER TABLE atendimentos ADD COLUMN atestado_dias INTEGER;
        END IF;
      END $$;
    `);

    // Criar tabelas adicionais
    await db.query(`
      CREATE TABLE IF NOT EXISTS exames (
        id SERIAL PRIMARY KEY,
        atendimento_id INTEGER REFERENCES atendimentos(id) ON DELETE CASCADE,
        paciente_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        medico_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
        tipo_exame VARCHAR(100) NOT NULL,
        descricao TEXT,
        resultado TEXT,
        arquivo_url TEXT,
        data_solicitacao TIMESTAMP DEFAULT NOW(),
        data_resultado TIMESTAMP,
        status VARCHAR(30) DEFAULT 'solicitado',
        criado_em TIMESTAMP DEFAULT NOW(),
        atualizado_em TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS prescricoes (
        id SERIAL PRIMARY KEY,
        atendimento_id INTEGER REFERENCES atendimentos(id) ON DELETE CASCADE,
        paciente_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        medico_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
        medicamento VARCHAR(200) NOT NULL,
        dosagem VARCHAR(100),
        frequencia VARCHAR(100),
        duracao VARCHAR(100),
        quantidade VARCHAR(50),
        via_administracao VARCHAR(50),
        observacoes TEXT,
        ativa BOOLEAN DEFAULT true,
        data_inicio DATE,
        data_fim DATE,
        criado_em TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS alergias (
        id SERIAL PRIMARY KEY,
        paciente_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        tipo VARCHAR(50),
        descricao VARCHAR(200) NOT NULL,
        gravidade VARCHAR(30),
        observacoes TEXT,
        criado_em TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS historico_medico (
        id SERIAL PRIMARY KEY,
        paciente_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        tipo VARCHAR(50),
        descricao TEXT NOT NULL,
        data_ocorrencia DATE,
        observacoes TEXT,
        criado_em TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS agendamentos (
        id SERIAL PRIMARY KEY,
        paciente_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        medico_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        data_hora TIMESTAMP NOT NULL,
        duracao_minutos INTEGER DEFAULT 30,
        tipo_consulta VARCHAR(50),
        status VARCHAR(30) DEFAULT 'agendado',
        motivo TEXT,
        observacoes TEXT,
        criado_em TIMESTAMP DEFAULT NOW(),
        atualizado_em TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS documentos (
        id SERIAL PRIMARY KEY,
        paciente_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        atendimento_id INTEGER REFERENCES atendimentos(id) ON DELETE SET NULL,
        tipo VARCHAR(50),
        titulo VARCHAR(200) NOT NULL,
        descricao TEXT,
        arquivo_url TEXT NOT NULL,
        arquivo_tipo VARCHAR(50),
        criado_em TIMESTAMP DEFAULT NOW()
      );
    `);

    // Criar índices
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
      CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON usuarios(cpf);
      CREATE INDEX IF NOT EXISTS idx_atendimentos_paciente ON atendimentos(paciente_id);
      CREATE INDEX IF NOT EXISTS idx_atendimentos_medico ON atendimentos(medico_id);
      CREATE INDEX IF NOT EXISTS idx_atendimentos_data ON atendimentos(data_atendimento);
      CREATE INDEX IF NOT EXISTS idx_exames_paciente ON exames(paciente_id);
      CREATE INDEX IF NOT EXISTS idx_prescricoes_paciente ON prescricoes(paciente_id);
      CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data_hora);
    `);

    console.log("✅ Banco de dados completo criado/atualizado no Supabase!");
  } catch (err) {
    console.error("Erro ao criar/atualizar tabelas:", err);
  }
}

criarTabelas();
