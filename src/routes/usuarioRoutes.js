import express from "express";
import { verificarToken } from "../middleware/authMiddleware.js";
import {
  listarMedicos,
  listarPacientes,
  obterUsuario
} from "../controllers/usuario-controller.js";

const router = express.Router();

router.get("/medicos", verificarToken, listarMedicos);
router.get("/pacientes", verificarToken, listarPacientes);
router.get("/:id", verificarToken, obterUsuario);

export default router;
