import { Sequelize } from "sequelize"
import sequelize from "../config/sequelize.js"
import Curso from "./curso.model.js"
import User from "./user.model.js"
import Categoria from "./categoria.model.js"
import Inscrever from "./inscrever.model.js"

export const user = User(sequelize, Sequelize.DataTypes)
export const categoria = Categoria(sequelize, Sequelize.DataTypes)
export const curso = Curso(sequelize, Sequelize.DataTypes)
export const inscrever = Inscrever(sequelize, Sequelize.DataTypes)