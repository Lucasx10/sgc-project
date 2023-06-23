import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "../config/auth.js";

export class UserController {
  constructor(UserModel) {
    this.user = UserModel;
  }

  async getAll() {
    const users = await this.user.findAll();
    return users;
  }

  async getUser(id) {
    let userFind = await this.user.findOne({
      where: { id },
    });
    return userFind;
  }
  

  async adicionar(userData) {
    let userExist = await this.user.findOne({
      where: { email: userData.email },
    });

    if (userExist) {
      return {
        error: true,
        message: "Usuário já existe",
      };
    }

    const { name, email, password } = userData;
    const userNew = { name, email, password };

    // Criptografar a senha
    userNew.password = await bcrypt.hash(userNew.password, 8);

    try {
      const userCreate = await this.user.create(userNew);
      console.log("aqui 1'", userCreate);
      return userCreate;
    } catch (error) {
      console.log(error);
    }
  }

  async login(userData) {
    let userExist = await this.user.findOne({
      where: { email: userData.email },
    });

    if (!userExist) {
      return {
        error: true,
        message: "Usuário não existe",
      };
    }

    // Como o usuário existe vanmos verificar se a senha está correta
    if (!(await bcrypt.compare(userData.password, userExist.password))) {
      return {
        error: true,
        message: "Senha inválida",
      };
    }

    // Usuário existe E senha correta
    return {
      error: false,
      user: {
        id: userExist.id,
        name: userExist.name,
        email: userExist.email,
        isAtivo: userExist.isAtivo,
        role: userExist.role
      },
      token: jwt.sign({ id: userExist.id, isAtivo: userExist.isAtivo, role: userExist.role}, auth.secret, {
        expiresIn: auth.expireIn,
      }),
    };
  }

  async updateUser(id, userDTO) {
    let userFind = await this.user.findOne({ where: { id } });
  
    // Verificar se a senha antiga está correta
    if (!(await bcrypt.compare(userDTO.oldPassword, userFind.password))) {
      return {
        error: true,
        message: "Senha antiga inválida",
      };
    }
  
    // Criptografar a nova senha apenas se ela estiver presente no objeto userDTO
    if (userDTO.newPassword) {
      userDTO.newPassword = await bcrypt.hash(userDTO.newPassword, 8);
    }
  
    await this.user.update(userDTO, { where: { id: id } });
  
    return {
      error: false,
      message: "Usuário atualizado com sucesso",
    };
  }
  
  
}


