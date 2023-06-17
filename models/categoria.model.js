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

  Categoria.associate = (models) => {
    Categoria.hasOne(models.Curso, {
      foreignKey: "categoriaId",
      as: "curso",
    });
  };

  return Categoria;
};

export default categoria;