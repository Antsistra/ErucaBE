const express = require("express");
const router = express.Router();
const prisma = require("../db/index");
const {
  createUser,
  AllUsers,
  login,
  createEmploye,
  updatePassword,
} = require("./auth.services");

router.get("/", async (req, res) => {
  const users = await AllUsers();
  res.send(users);
});

router.get("/employe", async (req, res) => {
  try {
    const employe = await prisma.user.findMany({
      where: {
        role: {
          in: ["admin", "Cashier"], // Menggunakan operator 'in'
        },
      },
    });
    res.send(employe);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching employees");
  }
});

router.delete("/employe/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.send({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while deleting employee");
  }
});
router.post("/register", async (req, res) => {
  try {
    const newUser = req.body;
    const user = await createUser(newUser);
    res.send({
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/employe/register", async (req, res) => {
  try {
    const newEmploye = req.body;
    const user = await createEmploye(newEmploye);
    res.send({
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const loginDetails = req.body;
    const loginControl = await login(loginDetails);
    res.send({
      data: loginControl,
      message: "User logged in successfully",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/change-password", async (req, res) => {
  try {
    const changePasswordDetail = req.body;
    const updatedPassword = await updatePassword(
      changePasswordDetail
    );
    res.send({
      data: updatedPassword,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
