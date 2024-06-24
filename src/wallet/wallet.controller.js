const express = require("express");
const router = express.Router();
const prisma = require("../db/index");

router.get("/", async (req, res) => {
  const wallet =
    await prisma.$queryRaw`SELECT * FROM Wallet`;
  res.send(wallet);
});

module.exports = router;
