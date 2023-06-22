import bcrypt from "bcrypt";

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
        defaultValue: true,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'student', 
      },
    },
    {
      tableName: "user",
    }
  );

  User.associate = (models) => {
    User.belongsToMany(models.Curso, {
      through: "Inscrever",
      foreignKey: "userId",
    });
  };

  User.addHook("afterSync", async () => {
    const rootUser = await User.findOne({ where: { name: "root" } });

    if (!rootUser) {
      // Criar o usuário root
      const hashedPassword = await bcrypt.hash("123", 8); // Criptografar a senha

      await User.create({
        name: "root",
        email: "root@gmail.com",
        password: hashedPassword, // Usar a senha criptografada
        role: "admin",
        isAtivo: true
      });
    }
  });

  return User;
};

export default user;
