import express from "express";
import { verificarToken } from "../middleware/authMiddleware.js";
import {
  criarAgendamento,
  listarAgendamentos,
  agendamentosPaciente,
  agendamentosMedico,
  atualizarAgendamento
} from "../controllers/agendamento-controller.js";

const router = express.Router();

router.post("/", verificarToken, criarAgendamento);
router.get("/", verificarToken, listarAgendamentos);
router.get("/paciente/:paciente_id", verificarToken, agendamentosPaciente);
router.get("/medico/:medico_id", verificarToken, agendamentosMedico);
router.put("/:id", verificarToken, atualizarAgendamento);

export default router;
