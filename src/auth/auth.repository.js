const prisma = require("../db/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const insertUser = async (newUser) => {
  const hashedPassword = await bcrypt.hash(
    newUser.password,
    10
  );
  const user = await prisma.user.create({
    data: {
      name: newUser.name,
      email: newUser.email.toLowerCase(), // Normalisasi email
      password: hashedPassword,
      role: newUser.role,
    },
  });
  return user;
};

const insertEmploye = async (newEmploye) => {
  const hashedPassword = await bcrypt.hash(
    newEmploye.password,
    10
  );
  const user = await prisma.user.create({
    data: {
      name: newEmploye.name,
      email: newEmploye.email.toLowerCase(), // Normalisasi email
      password: hashedPassword,
      role: newEmploye.role,
    },
  });
  return user;
};

const userLogin = async (email, password) => {
  const users = await getAllUsers();
  const user = users.find(
    (user) => user.email === email.toLowerCase()
  ); // Normalisasi email
  if (!user) {
    throw new Error("Email Tidak Tersedia");
  }
  const validPassword = await bcrypt.compare(
    password,
    user.password
  );
  if (!validPassword) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign(
    { Id: user.id, Role: user.role },
    "inirahasiaya"
  );
  return {
    user,
    token,
  };
};

module.exports = {
  insertUser,
  getAllUsers,
  userLogin,
  insertEmploye,
};
