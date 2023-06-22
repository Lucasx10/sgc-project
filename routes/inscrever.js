import express from "express";
import { curso, user, inscrever } from "../models/index.js";
import { InscreverController } from "../controller/inscrever.controller.js";


const router = express.Router();
const inscreverController = new InscreverController(inscrever);


// Defina a rota para criar a relação UserCurso
router.post("/user-curso", async (req, res) => {
  try {
    const { userId, cursoId } = req.body;
    console.log(userId, cursoId)

    // Verifique se o usuário já está inscrito no curso
    const isUsuarioInscrito = await inscrever.findOne({
      where: {
        userId: userId,
        cursoId: cursoId
      }
    });
  
    if (isUsuarioInscrito) {
      // O usuário já está inscrito no curso
      return res.status(400).json({ error: "Usuário já está inscrito no curso" });
    }
  
    // Crie a relação UserCurso no banco de dados
    const userCursoAPI = await inscrever.create({
      userId: userId,
      cursoId: cursoId,
    });
  
    // Responda com a relação UserCurso criada
    res.status(201).json(userCursoAPI);
  } catch (error) {
    console.error("Erro ao criar a relação UserCurso:", error);
    res.status(500).json({ error: "Erro ao criar a relação UserCurso" });
  }
});
  
router.get("/:userId/cursos", async (req, res) => {
  const { userId } = req.params;

  try {
    const userCursos = await inscrever.findAll({
      where: { userId },
      include: curso,
    });

    res.json(userCursos);
  } catch (error) {
    console.error("Erro ao buscar os cursos do usuário:", error);
    res.status(500).json({ error: "Erro ao buscar os cursos do usuário" });
  }
});

export default router;