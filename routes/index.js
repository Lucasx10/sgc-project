import express from "express";
import users from "./users.js";
import cursos from "./cursos.js";

const router = express.Router();

router.get("/", (req, res) => {
  // res.send("Pagina inicial");
  res.sendFile(__basedir + "/frontend/src/index.html");
});

router.get("/login.html", (req, res) => {
  // res.send("Pagina inicial");
  res.sendFile(__basedir + "/frontend/src/login.html");
});

router.get("/pagina-curso.html", (req, res) => {
  // res.send("Pagina inicial");
  res.sendFile(__basedir + "/frontend/src/pagina-curso.html");
});

router.use("/users", users);
router.use("/cursos", cursos);

export default router;
