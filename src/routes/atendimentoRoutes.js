import express from "express";
import { verificarToken } from "../middleware/authMiddleware.js";
import {
  criarAtendimento,
  listarAtendimentos,
  obterAtendimento,
  atualizarAtendimento,
  historicoPaciente
} from "../controllers/atendimento-controller.js";

const router = express.Router();

router.post("/", verificarToken, criarAtendimento);
router.get("/", verificarToken, listarAtendimentos);
router.get("/:id", verificarToken, obterAtendimento);
router.put("/:id", verificarToken, atualizarAtendimento);
router.get("/paciente/:paciente_id", verificarToken, historicoPaciente);

export default router;
