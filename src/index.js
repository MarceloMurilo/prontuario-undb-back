import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import atendimentoRoutes from "./src/routes/atendimentoRoutes.js";
import { db } from "./src/config/db.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/atendimentos", atendimentoRoutes);

app.get("/", (req, res) => res.send("🚀 API Prontuário Médico rodando!"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
