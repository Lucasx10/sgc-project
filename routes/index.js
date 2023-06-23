import express from "express";
import cookieParser from 'cookie-parser';
import users from "./users.js";
import cursos from "./cursos.js";
import categoria from "./categoria.js";
import inscrever from "./inscrever.js"

const cookieParserT = cookieParser;

let router = express();
router.use(cookieParserT())
router = express.Router();

router.get("/", (req, res) => {
  // res.send("Pagina inicial");
  res.sendFile(__basedir + "/frontend/src/index.html");
});

router.get("/login", (req, res) => {
  res.sendFile(__basedir + "/frontend/src/login.html");
});

router.get("/cursos-management", (req, res) => {
  res.sendFile(__basedir + "/frontend/src/cursos.html");
});

router.get("/cursos-edit", (req, res) => {
  res.sendFile(__basedir + "/frontend/src/editar-curso.html");
});

router.get("/novo-curso", (req, res) => {
  res.sendFile(__basedir + "/frontend/src/novo-curso.html");
});

router.get("/categorias", (req, res) => {
  res.sendFile(__basedir + "/frontend/src/categorias.html");
});

router.get("/root", (req, res) => {
  res.sendFile(__basedir + "/frontend/src/root.html");
});

router.get("/pagina-curso/:id", (req, res) => {
  // res.send("Pagina inicial");
  const { id } = req.params;
  res.append("Set-Cookie", "cursoid=" + id); // setando o cookie
  res.sendFile(__basedir + "/frontend/src/pagina-curso.html");
});

router.get("/perfil", (req, res) => {
  res.sendFile(__basedir + "/frontend/src/perfil.html");
});

router.use("/users", users);
router.use("/cursos", cursos);
router.use("/categoria", categoria);
router.use("/inscrever", inscrever);
export default router;
