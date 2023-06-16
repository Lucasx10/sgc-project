export class CategoriaController {
    constructor(CategoriaModel) {
      this.categoria = CategoriaModel;
    }
  
    async getAll() {
      const categorias = await this.categoria.findAll();
      return categorias;
    }
  
    async getCategoria(id) {
      let categoriaFind = await this.categoria.findOne({
        where: { id },
      });
      return categoriaFind;
    }
  
    async adicionar(categoriaDTO) {
      try {
        console.log(categoriaDTO);
        await this.categoria.create(categoriaDTO);
      } catch (error) {
        console.log(error);
      }
    }
  }
  