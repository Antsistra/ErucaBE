const express = require("express");
const router = express.Router();
const prisma = require("../db/index");



// Existing code...
router.get("/sales-data", async (req, res) => {
  const { type } = req.query; // 'daily' atau 'monthly'

  let salesData;

  if (type === 'monthly') {
    salesData = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m-01') AS month, 
        SUM(totalPrice) AS totalSales 
      FROM Transaction 
      GROUP BY month 
      ORDER BY month ASC;
    `;
  } else {
    salesData = await prisma.$queryRaw`
      SELECT 
        DATE(createdAt) AS day, 
        SUM(totalPrice) AS totalSales 
      FROM Transaction 
      GROUP BY day 
      ORDER BY day ASC;
    `;
  }

  res.json(salesData);
});
// Existing code...

router.get("/quantity-data", async (req, res) => {
  const { type } = req.query; // 'daily' atau 'monthly'

  let quantityData;

  if (type === 'monthly') {
    quantityData = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m-01') AS month, 
        SUM(qty) AS totalQuantity 
      FROM Transaction 
      GROUP BY month 
      ORDER BY month ASC;
    `;
  } else {
    quantityData = await prisma.$queryRaw`
      SELECT 
        DATE(createdAt) AS day, 
        SUM(qty) AS totalQuantity 
      FROM Transaction 
      GROUP BY day 
      ORDER BY day ASC;
    `;
  }

  res.json(quantityData);
});
// Endpoint untuk mendapatkan produk yang paling banyak dibeli
router.get("/hot-product", async (req, res) => {
  try {
    const mostPurchasedProduct = await prisma.$queryRaw`
      SELECT detailLiquid.name, detailLiquid.image, SUM(Transaction.qty) as totalQuantity
      FROM Transaction
      JOIN detailLiquid ON Transaction.liquidID = detailLiquid.id
      GROUP BY detailLiquid.id
      ORDER BY totalQuantity DESC
      LIMIT 1;
    `;

    if (mostPurchasedProduct.length > 0) {
      res.json(mostPurchasedProduct[0]);
    } else {
      res.status(404).json({ message: "No products found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint lain yang sudah ada
router.patch("/update", async (req, res) => {
  const { income, totalSales } = req.body;
  const transaction = await prisma.wallet.update({
    where: {
      id: "clwmz8t4e0000npyds7xkybjf",
    },
    data: {
      income: {
        increment: income,
      },
      totalSales: {
        increment: totalSales,
      },
    },
  });
  res.send(transaction);
});

router.get("/", async (req, res) => {
  const transaction = await prisma.$queryRaw`
    SELECT Transaction.id, detailLiquid.name, detailLiquid.image, Transaction.qty, Transaction.totalPrice, Transaction.createdAt
    FROM Transaction
    JOIN detailLiquid ON Transaction.liquidID = detailLiquid.id;
  `;
  res.send(transaction);
});



module.exports = router;
