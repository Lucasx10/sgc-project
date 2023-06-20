import express from "express";
import { categoria } from "../models/index.js";
import { CategoriaController } from "../controller/categoria.controller.js";
import { body, validationResult } from "express-validator";
const router = express.Router();

const categoriaController = new CategoriaController(categoria);

router.get("/", async (req, res) => {
  const categorias = await categoriaController.getAll();
  res.json(categorias);
});

router.post(
  "/create", async (req, res) => {
    // caso encontre erros, ficará nessa variável errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //se os dados forem válidos, o sistema executará aqui
    const { name } = req.body;
    await categoriaController.adicionar({
      name,
    });
    res.status(201).send("Categoria criada com sucesso!");
  }
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const categoria = await categoriaController.getCategoria(id);
  res.json(categoria);
});

router.delete('/delete/:id', async (req, res) => {
  try{
    const id = req.params.id;
    await categoriaController.deleteCategoria(id);
    res.status(204).send(`Categoria com ID ${id} excluído com sucesso`);
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover categoria' });
  }
  
});

router.put('/update/:id', async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  await categoriaController.updateCategoria(id,{name});
  res.send(`Categoria com ID ${id} atualizado com sucesso`);
});

export default router;
