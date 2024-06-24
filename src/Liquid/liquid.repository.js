const prisma = require("../db/index");

const createLiquid = async (newLiquid) => {
  const liquid = await prisma.detailLiquid.create({
    data: {
      name: newLiquid.name,
      taste: newLiquid.taste,
      material: newLiquid.material,
      nicotine: parseInt(newLiquid.nicotine),
      image: newLiquid.image,
      price: parseInt(newLiquid.price),
    },
  });
  const liquidStock = await prisma.stockLiquid.create({
    data: {
      detailLiquidId: liquid.id,
      stock: 0,
    },
  });
  return liquid;
};

const updatingStock = async ({ id, stock }) => {
  const liquid = await prisma.stockLiquid.update({
    where: {
      detailLiquidId: id,
    },
    data: {
      stock: {
        increment: parseInt(stock),
      },
    },
  });
  return liquid;
};

const reduceStock = async (id, qty) => {
  const liquid = await prisma.stockLiquid.update({
    where: {
      detailLiquidId: id,
    },
    data: {
      stock: {
        decrement: qty,
      },
    },
  });
  return liquid;
};

const createTransaction = async (transactionData) => {
  const transaction = await prisma.transaction.create({
    data: transactionData,
  });
  return transaction;
};

module.exports = {
  updatingStock,
  createLiquid,
  reduceStock,
  createTransaction, // tambahkan ini
};
