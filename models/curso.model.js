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
      category: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      tags: {
        type: DataTypes.JSON,
      },
      date_start: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "curso",
    }
  );
  return Curso;
};

export default curso;
