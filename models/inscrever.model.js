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
      porcentagemConcluida: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0
      },
      IsCertificateReady: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
