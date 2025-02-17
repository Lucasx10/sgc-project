import "./dotenv.js";
import express from "express";
import routes from "./routes/index.js";
import sequelize from "./config/sequelize.js";
import cors from "cors";
import path from "path";
import fileDirName from './config/file-dir-name.js';
const { __dirname, __filename } = fileDirName(import.meta);

const app = express();
const PORT = 3000;

// Definindo dir root project global
global.__basedir = __dirname;

// Definindo static folder
app.use(express.static(path.join(__dirname, "/frontend/public")));

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROTAS
app.use("/", routes);

// Conexão com Banco de Dados
sequelize.sync().then(() => {
  console.log("Conectado ao Banco de Dados com sucesso!");
});

app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
