import express from "express";
import { curso, inscrever } from "../models/index.js";
import { InscreverController } from "../controller/inscrever.controller.js";
import { Op } from "sequelize"


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

router.post("/cargaHoraria", async (req, res) => {
  const userId = req.body.userId; // Supondo que o ID do usuário seja enviado no corpo da requisição
  const cursoId = req.body.cursoId; // Supondo que o ID do curso seja enviado no corpo da requisição
  const novaPorcentagemConcluida = req.body.porcentagemConcluida; // Supondo que a nova carga horária concluída seja enviada no corpo da requisição

  inscrever.findOne({ where: { userId, cursoId } })
    .then((inscricao) => {
      if (inscricao) {
        // A inscrição foi encontrada
        inscricao.porcentagemConcluida = novaPorcentagemConcluida;
        return inscricao.save();
      } else {
        // A inscrição não foi encontrada
        throw new Error("Inscrição não encontrada.");
      }
    })
    .then(() => {
      console.log("Carga horária concluída atualizada com sucesso.");
      res.sendStatus(200); // Responda com status 200 (OK) para indicar que a carga horária foi atualizada com sucesso
    })
    .catch((error) => {
      console.error("Erro ao atualizar a carga horária concluída:", error);
      res.sendStatus(500); // Responda com status 500 (Internal Server Error) para indicar que ocorreu um erro ao atualizar a carga horária
    });
});

router.get("/fecharCurso/:cursoId", async (req, res) => {
  const { cursoId } = req.params;
  console.log(cursoId);

  try {
    const inscricoes = await inscrever.findAll({ where: { cursoId } });
    const usuariosCertificados = []; // Array para armazenar os usuários que têm porcentagem concluída maior que 90%

    inscricoes.forEach((inscricao) => {
      const porcentagemConcluida = inscricao.porcentagemConcluida;
      const userId = inscricao.userId;
  
      if (porcentagemConcluida > 90) {
        usuariosCertificados.push(userId); // Adiciona o ID do usuário ao array de usuários certificados
      }
    });

    // Atualiza a coluna IsCertificateReady para true para cada um dos usuários certificados inscritos no curso
    await inscrever.update(
      { IsCertificateReady: true },
      { where: { cursoId, userId: { [Op.in]: usuariosCertificados } } }   //permite verificar se um valor está presente em um array de valores
    );

    res.status(200).json(usuariosCertificados); // Retorna o array de usuários certificados

  } catch (error) {
    console.error("Erro ao fechar o curso e emitir certificados:", error);
    res.status(500).json({ error: "Erro ao obter as inscrições" });
  }
});

router.get('/isCertificateReady/:userId/:cursoId', async (req, res) => {
  const { userId, cursoId } = req.params;

  try {
    // Verifique se o usuário está inscrito no curso
    const inscricao = await inscrever.findOne({
      where: {
        userId: userId,
        cursoId: cursoId,
      },
    });

    if (inscricao && inscricao.IsCertificateReady) {
      res.status(200).json(inscricao.IsCertificateReady);
    } else {
      res.status(200).json(false);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao verificar a disponibilidade do certificado.' });
  }
});
export default router;