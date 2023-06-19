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
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Define o valor padrão como falso
      },
    },
    {
      tableName: "user",
    }
  );

  User.addHook("afterSync", async () => {
    const rootUser = await User.findOne({ where: { name: "root" } });

    if (!rootUser) {
      // Criar o usuário root
      const hashedPassword = await bcrypt.hash("1234", 8); // Criptografar a senha

      await User.create({
        name: "root",
        email: "root@gmail.com",
        password: hashedPassword, // Usar a senha criptografada
        isAtivo: true,
        // isAdmin: true
      });
    }
  });

  return User;
};

export default user;
