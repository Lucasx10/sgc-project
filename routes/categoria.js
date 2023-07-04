import express from "express";
import { categoria } from "../models/index.js";
import { CategoriaController } from "../controller/categoria.controller.js";
import { body, validationResult } from "express-validator";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

const categoriaController = new CategoriaController(categoria);

router.get("/", async (req, res) => {
  const categorias = await categoriaController.getAll();
  res.json(categorias);
});

router.post("/create", AuthMiddleware, async (req, res) => {
    // caso encontre erros, ficará nessa variável errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //se os dados forem válidos, o sistema executará aqui
    if (req.role == 'admin') { 
      const { name } = req.body;
      await categoriaController.adicionar({
        name,
      });
      res.status(201).send("Categoria criada com sucesso!");
    }else{
      res.status(403).json({ error: "Access denied" });
    }
  }
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const categoria = await categoriaController.getCategoria(id);
  res.json(categoria);
});

router.delete('/delete/:id', AuthMiddleware, async (req, res) => {
  try{
    if (req.role == 'admin') { 
    const id = req.params.id;
    await categoriaController.deleteCategoria(id);
    res.status(204).send(`Categoria com ID ${id} excluído com sucesso`);
    }else{
      res.status(403).json({ error: "Você não tem permissão para delete" });
    }
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover categoria' });
  }
  
});

router.put('/update/:id', AuthMiddleware, async (req, res) => {
  if (req.role == 'admin') { 
  const id = req.params.id;
  const { name } = req.body;
  await categoriaController.updateCategoria(id,{name});
  res.send(`Categoria com ID ${id} atualizado com sucesso`);
  }else{
    res.status(403).json({ error: "Você não tem permissão para fazer update" });
  }
});

export default router;
