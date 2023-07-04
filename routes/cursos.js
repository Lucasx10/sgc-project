import express from "express";
import { curso } from "../models/index.js";
import { CursoController } from "../controller/curso.controller.js";
import { body, validationResult } from "express-validator";
import multer from "multer";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();


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
  ], AuthMiddleware,
  async (req, res) => {
    
    // caso encontre erros, ficará nessa variável errors
    console.log(req.role )
    if (req.role == 'admin') { 
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
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
    }else{
      res.status(403).json({ error: "Você não tem permissão para create" });
    }
  }
);

router.get("/page/:id", async (req, res) => {
  const { id } = req.params;
   console.log(id);
  const curso = await cursoController.getCurso(id);
  res.json(curso);
});

router.delete('/delete/:id', AuthMiddleware, async (req, res) => {
  try{
    if (req.role == 'admin') { 
    const id = req.params.id;
    await cursoController.deleteCurso(id);
    res.status(204).send(`Curso com ID ${id} excluído com sucesso`);
    }else{
      res.status(403).json({ error: "Você não tem permissão para delete" });
    }
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover Curso' });
  }
  
});

router.put('/update/:id', AuthMiddleware, async (req, res) => {
  if (req.role == 'admin') { 
  const id = req.params.id;
  const { name, image, description,ch, quantInscritos, date_start,categoriaId } = req.body;
  await cursoController.updateCurso(id,{name, image, description,ch,quantInscritos, date_start,categoriaId });
  res.send(`Curso com ID ${id} atualizado com sucesso`);
  }else{
    res.status(403).json({ error: "Você não tem permissão para update" });
  }
});

router.put('/updateQuantInscritos/:id', async (req, res) => {
  const id = req.params.id;
  const { quantInscritos } = req.body;
  await cursoController.updateCurso(id,{quantInscritos});
  res.send(`Curso com ID ${id} atualizado com sucesso`);
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'frontend/public/images/cards');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa o nome original do arquivo
  }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), (req, res) => {
  // Verifica se um arquivo foi recebido
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
  }

  // A imagem foi recebida e salva na pasta de destino
  const fileName = req.file.originalname;

  // Faça o processamento adicional necessário, como salvar o nome do arquivo no banco de dados, redimensionar a imagem, etc.

  // Retorna uma resposta de sucesso
  res.status(200).json({ message: 'Imagem enviada com sucesso' });
});

export default router;
