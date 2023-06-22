import { curso } from "./index.js";

const inscrever = (sequelize, DataTypes) => {
    const Inscrever = sequelize.define(
      "Inscrever",
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        cursoId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        tableName: "Inscrever",
      }
    );

    Inscrever.belongsTo(curso, { foreignKey: "cursoId" });
  
    return Inscrever;
  };
  
  export default inscrever;
  