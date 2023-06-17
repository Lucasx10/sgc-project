const user = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
      },
      endereco: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      whatsapp: {
        type: DataTypes.STRING,
      },
      isAtivo: {
        type: DataTypes.BOOLEAN,
      }
    },
    {
      tableName: "user",
    }
  );
  return User;
};

export default user;
