import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

const SECRET = process.env.JWT_SECRET || "segredo123";

export const register = async (req, res) => {
  try {
    const { nome, email, senha, tipo_usuario } = req.body;
    const hash = await bcrypt.hash(senha, 10);
    await db.query(
      "INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES ($1, $2, $3, $4)",
      [nome, email, hash, tipo_usuario]
    );
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ erro: "Erro ao registrar usuário" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const result = await db.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) return res.status(404).json({ erro: "Usuário não encontrado" });

    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) return res.status(401).json({ erro: "Senha incorreta" });

    const token = jwt.sign(
      { id: user.id, tipo_usuario: user.tipo_usuario },
      SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login bem-sucedido",
      token,
      usuario: { id: user.id, nome: user.nome, tipo_usuario: user.tipo_usuario }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro no login" });
  }
};
