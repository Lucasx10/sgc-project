import express from "express";
import { user } from "../models/index.js";
import { UserController } from "../controller/user.controller.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();
const userController = new UserController(user);


router.get("/", AuthMiddleware, async (req, res) => {
  if (req.user_id == 1) { // Verifica se o usuário é o (root) pelo id do token
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
  const { name , endereco , image, email , password, whatsapp, isAtivo, isAdmin } = req.body;
  await userController.updateUser(id,{ name , endereco , image, email , password, whatsapp, isAtivo, isAdmin });
  res.send(`Usuário com ID ${id} atualizado com sucesso`);
});

export default router;
