# 🧪 Como Testar o Backend

## 1️⃣ Iniciar o Backend

```bash
cd backend
npm run dev
```

O servidor deve iniciar na porta **3000** e exibir:
```
Servidor rodando na porta 3000
✅ Tabelas verificadas no Supabase Postgres!
```

---

## 2️⃣ Testar Registro de Usuário

### Registrar um Médico:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Dr. João Silva",
    "email": "joao@exemplo.com",
    "senha": "senha123",
    "tipo_usuario": "medico"
  }'
```

### Registrar um Paciente:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "email": "maria@exemplo.com",
    "senha": "senha123",
    "tipo_usuario": "paciente"
  }'
```

**Resposta esperada:**
```json
{
  "message": "Usuário criado com sucesso!"
}
```

---

## 3️⃣ Testar Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "senha": "senha123"
  }'
```

**Resposta esperada:**
```json
{
  "message": "Login bem-sucedido",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "Dr. João Silva",
    "tipo_usuario": "medico"
  }
}
```

**⚠️ IMPORTANTE:** Copie o token retornado, você vai precisar dele para as próximas requisições!

---

## 4️⃣ Testar Criar Atendimento (Requer Token)

```bash
curl -X POST http://localhost:3000/api/atendimentos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "paciente_id": 2,
    "medico_id": 1,
    "tipo_exame": "Consulta Geral",
    "observacoes": "Paciente com febre há 3 dias",
    "diagnostico": "Gripe comum",
    "prescricao": "Paracetamol 500mg a cada 6h",
    "encaminhamento": ""
  }'
```

---

## 5️⃣ Testar Listar Atendimentos (Requer Token)

```bash
curl -X GET http://localhost:3000/api/atendimentos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## ✅ Backend Corrigido!

Todas as funções agora usam **PostgreSQL** corretamente:
- ✅ `db.query()` ao invés de `db.get()` e `db.run()`
- ✅ Placeholders `$1, $2, $3` ao invés de `?`
- ✅ `result.rows` para acessar resultados
- ✅ `NOW()` ao invés de `CURRENT_TIMESTAMP`

---

## 🌐 Testar no Frontend

Acesse: **http://localhost:5176/**

1. Clique em "Criar conta"
2. Preencha os dados (escolha "Médico" ou "Paciente")
3. Após criar, faça login
4. Você será redirecionado para o dashboard correto!
