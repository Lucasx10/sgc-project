const categoria = (sequelize, DataTypes) => {
    const Categoria = sequelize.define(
      "Categoria",
      {
        name: {
          type: DataTypes.STRING,
        },
      },
      {
        tableName: "categoria_curso",
      }
    );
    return Categoria;
  };
  
  export default categoria;
  