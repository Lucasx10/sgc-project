const curso = (sequelize, DataTypes) => {
  const Curso = sequelize.define(
    "Curso",
    {
      name: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      ch: {
        type: DataTypes.INTEGER,
      },
      date_start: {
        type: DataTypes.STRING,
      },
      categoriaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "categoria_curso",
          key: "id",
        },
      },
    },
    {
      tableName: "curso",
    }
  );

  Curso.associate = (models) => {
    Curso.belongsTo(models.Categoria, {
      foreignKey: 'categoriaId',
      as: 'categoria',
    });
  };

  return Curso;
};

export default curso;