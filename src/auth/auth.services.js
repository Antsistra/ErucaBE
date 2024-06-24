const bcryptjs = require("bcryptjs");
const prisma = require("../db/index");
const {
  insertUser,
  getAllUsers,
  userLogin,
  insertEmploye,
} = require("./auth.repository");

const AllUsers = async () => {
  const users = await getAllUsers();
  return users;
};

const login = async (loginDetails) => {
  if (!loginDetails.email || !loginDetails.password) {
    throw new Error("All fields are required");
  }
  if (!loginDetails.email.includes("@")) {
    throw new Error("Invalid email Format");
  }
  const loginUser = await userLogin(
    loginDetails.email.toLowerCase(),
    loginDetails.password
  ); // Normalisasi email
  return loginUser;
};

const createEmploye = async (newEmploye) => {
  if (
    !newEmploye.name ||
    !newEmploye.email ||
    !newEmploye.password ||
    !newEmploye.role
  ) {
    throw new Error("All fields are required");
  }
  if (newEmploye.password.length < 6) {
    throw new Error(
      "Password must be at least 6 characters"
    );
  }
  if (!newEmploye.email.includes("@")) {
    throw new Error("Invalid email Format");
  }
  const userExist = await prisma.user.findUnique({
    where: {
      email: newEmploye.email.toLowerCase(), // Normalisasi email
    },
  });
  if (userExist) {
    throw new Error("User already exist");
  }
  const user = await insertEmploye(newEmploye);
  return user;
};

const createUser = async (newUser) => {
  if (
    !newUser.name ||
    !newUser.email ||
    !newUser.password
  ) {
    throw new Error("All fields are required");
  }
  if (newUser.password.length < 6) {
    throw new Error(
      "Password must be at least 6 characters"
    );
  }
  if (!newUser.email.includes("@")) {
    throw new Error("Invalid email Format");
  }
  const userExist = await prisma.user.findUnique({
    where: {
      email: newUser.email.toLowerCase(), // Normalisasi email
    },
  });
  if (userExist) {
    throw new Error("User already exist");
  }
  const user = await insertUser(newUser);
  return user;
};

const updatePassword = async (changePasswordDetail) => {
  if (
    !changePasswordDetail.currentPassword ||
    !changePasswordDetail.newPassword ||
    !changePasswordDetail.email
  ) {
    throw new Error("All fields are required");
  }
  if (changePasswordDetail.newPassword.length < 6) {
    throw new Error(
      "Password must be at least 6 characters"
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: changePasswordDetail.email.toLowerCase(),
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const validPassword = await bcryptjs.compare(
    changePasswordDetail.currentPassword,
    user.password
  );

  if (!validPassword) {
    throw new Error("Current password is incorrect");
  }

  if (
    changePasswordDetail.currentPassword ===
    changePasswordDetail.newPassword
  ) {
    throw new Error(
      "New password cannot be the same as the current password"
    );
  }

  const hashedNewPassword = await bcryptjs.hash(
    changePasswordDetail.newPassword,
    10
  );

  const updatedPassword = await prisma.user.update({
    where: {
      email: changePasswordDetail.email.toLowerCase(),
    },
    data: {
      password: hashedNewPassword,
    },
  });

  return updatedPassword;
};
module.exports = {
  createUser,
  AllUsers,
  login,
  createEmploye,
  updatePassword,
};
