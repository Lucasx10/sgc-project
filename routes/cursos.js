import express from "express";
import { curso } from "../models/index.js";
import { CursoController } from "../controller/curso.controller.js";
import { body, validationResult } from "express-validator";
const router = express.Router();
//Para manipulação da imagem
//const multer = require('multer');
const cursoController = new CursoController(curso);

router.get("/", async (req, res) => {
  const cursos = await cursoController.getAll();
  res.json(cursos);
});
//adiconar upload.single('image') ao parâmetros do post para a imagem
router.post(
  "/create",
  [
    //validação dos dados
    body("name").notEmpty().trim().withMessage("O campo nome é obrigatório"),
  ],
  async (req, res) => {
    // caso encontre erros, ficará nessa variável errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // const storage = multer.diskStorage({
    //   destination: '/home/lucas_anderson/Documentos/Curso-CC/Banco de Dados II/sgc-project/frontend/public/images/cards', // Pasta de destino para salvar as imagens
    //   filename: (req, file, cb) => {
    //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    //     cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    //   }
    // });

    // const imageName = req.file.filename;

    
    //const upload = multer({ storage });
    //se os dados forem válidos, o sistema executará aqui
    const { name, image, description,ch, quantInscritos, date_start,categoriaId } = req.body;
    await cursoController.adicionar({
      name,
      image,
      description,
      ch,
      quantInscritos,
      date_start,
      categoriaId,
    });
    res.status(201).send("Curso criado com sucesso!");
  }
);

router.get("/page/:id", async (req, res) => {
  const { id } = req.params;
   console.log(id);
  const curso = await cursoController.getCurso(id);
  res.json(curso);
});

router.delete('/delete/:id', async (req, res) => {
  try{
    const id = req.params.id;
    await cursoController.deleteCurso(id);
    res.status(204).send(`Curso com ID ${id} excluído com sucesso`);
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover Curso' });
  }
  
});

router.put('/update/:id', async (req, res) => {
  const id = req.params.id;
  const { name, image, description,ch, quantInscritos, date_start,categoriaId } = req.body;
  await cursoController.updateCurso(id,{name, image, description,ch,quantInscritos, date_start,categoriaId });
  res.send(`Curso com ID ${id} atualizado com sucesso`);
});

export default router;
