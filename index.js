const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
//auth
const AuthController = require("./src/auth/auth.controller");
app.use("/auth", AuthController);

//detail liquid
const detailLiquidController = require("./src/Liquid/liquid.controller");
app.use("/detailLiquid", detailLiquidController);

const {
  createTransaction,
} = require("./src/Payment/payment.services");
app.post("/create-transaction", createTransaction);

//transaksi
const transactionController = require("./src/transaction/transaction.controller");
app.use("/transaction", transactionController);
// const transaksiController = require("./transaksi/transaksi.controller");

const walletController = require("./src/wallet/wallet.controller");
app.use("/wallet", walletController);

module.exports = app;
