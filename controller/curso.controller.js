export class CursoController {
  constructor(CursoModel) {
    this.curso = CursoModel;
  }

  async getAll() {
    const cursos = await this.curso.findAll();
    return cursos;
  }

  async getCurso(id) {
    let cursoFind = await this.curso.findOne({
      where: { id },
    });
    return cursoFind;
  }

  async adicionar(cursoDTO) {
    try {
      console.log(cursoDTO);
      await this.curso.create(cursoDTO);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCurso(id) {
    await this.curso.destroy({ where: { id: id } });
  }

  async updateCurso(id, cursoDTO) {
    await this.curso.update(cursoDTO,{ where: { id: id } });
  }

}
