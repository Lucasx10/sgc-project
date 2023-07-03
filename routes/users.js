import express from "express";
import { user } from "../models/index.js";
import { UserController } from "../controller/user.controller.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const router = express.Router();
const userController = new UserController(user);

router.get("/", AuthMiddleware, async (req, res) => {
  //console.log(req)
  if (req.role == 'admin') { // Verifica se o usuário é o (root) pelo id do token
    const users = await userController.getAll();
    res.json(users);
  } else {
    res.status(403).json({ error: "Access denied" });
  }
});

router.get("/login/:id", AuthMiddleware, async (req, res) => {
  const { id } = req.params;
  const user = await userController.getUser(id);
  console.log(req.user_id)
  res.json(user);
});

router.get('/logout', (req, res) => {
  res.clearCookie('nToken');
  return res.redirect('/');
});

router.post("/create", async (req, res) => {
  const { name, email, password } = req.body;
  const resp = await userController.adicionar({ name, email, password });
  console.log("aqui 2", resp);
  if (resp.error) {
    return res.status(400).json(resp);
  }

  res.status(200).json(resp);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const resp = await userController.login({ email, password });
  console.log(resp.token)
  res.cookie('nToken', resp.token, { maxAge: 900000, httpOnly: true,  sameSite: 'Strict' });
  console.log("chamou o cookie")
  if (resp.error) {
    return res.status(400).json(resp);
  }
  res.status(200).json(resp);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const user = await userController.getUser(id);
  res.json(user);
});

router.put('/update/:id', async (req, res) => {
  const id = req.params.id;
  const { name , endereco , image, email , oldPassword, newPassword, whatsapp, isAtivo, role } = req.body;

  const resp = await userController.updateUserPerfil(id,{ name , endereco , image, email, oldPassword, newPassword, whatsapp, isAtivo, role});

  if (resp.error) {
    return res.status(401).json(resp);
  }

  res.status(200).json({ message: `Usuário com ID ${id} atualizado com sucesso` });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'frontend/public/images/usuarios');
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


