import inscrever from "../models/inscrever.model.js";
import { curso } from "../models/index.js";
import { user } from "../models/index.js";

export class InscreverController {
    constructor(inscreverModel) {
      this.inscrever = inscreverModel;
    }
  
    async getInscrever(userId) {
      console.log("Aqui");
      const userCursoAPI = await user.findOne({
        where: { id: userId },
        include: {
          model: inscrever,
          include: curso,
        },
      });
  
      return userCursoAPI.inscrever;
    }

    async deleteInscricao(id) {
      await this.inscrever.destroy({ where: { cursoId: id } });
    }
}
