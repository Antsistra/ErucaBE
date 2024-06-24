const prisma = require("../db/index");

const {
  updatingStock,
  createLiquid,
  reduceStock,
  createTransaction,
} = require("./liquid.repository");

const addNewLiquid = async (newLiquid) => {
  if (
    !newLiquid.name ||
    !newLiquid.taste ||
    !newLiquid.material ||
    !newLiquid.nicotine ||
    !newLiquid.price ||
    !newLiquid.image
  ) {
    throw new Error("All fields are required");
  }
  const liquidExist = await prisma.detailLiquid.findFirst({
    where: {
      name: newLiquid.name,
    },
  });
  if (liquidExist) {
    throw new Error("Liquid already exist");
  }
  const liquid = await createLiquid(newLiquid);
  return liquid;
};

const updateStock = async ({ id, stock }) => {
  if (!id || !stock) {
    throw new Error("All fields are required");
  }
  if (stock <= 0) {
    throw new Error("Stock must be at least 1");
  }
  const liquid = await updatingStock({ id, stock });
  return liquid;
};

const reduceStockService = async (id, qty) => {
  if (!id || !qty) {
    throw new Error("All fields are required");
  }
  if (qty <= 0) {
    throw new Error("Quantity must be at least 1");
  }
  const liquid = await reduceStock(id, qty);
  return liquid;
};

const createNewTransaction = async (transactionData) => {
  const transaction = await createTransaction(
    transactionData
  );
  return transaction;
};

module.exports = {
  addNewLiquid,
  updateStock,
  reduceStockService,
  createNewTransaction, // tambahkan ini
};
