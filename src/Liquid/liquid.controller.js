const express = require("express");
const router = express.Router();
const prisma = require("../db/index");
const {
  addNewLiquid,
  updateStock,
  reduceStockService,
  createNewTransaction,
} = require("./liquid.services");

router.get("/", async (req, res) => {
  const liquid = await prisma.detailLiquid.findMany();
  res.send(liquid);
});
// Tambahkan liquid baru
router.post("/add", async (req, res) => {
  try {
    const newLiquid = req.body;
    const liquid = await addNewLiquid(newLiquid);
    res.send({
      data: liquid,
      message: "Liquid Berhasil Ditambahkan",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Update stok liquid
router.patch("/update/:id/:stock", async (req, res) => {
  try {
    const { id, stock } = req.params;
    const liquid = await updateStock({ id, stock });
    res.send({
      data: liquid,
      message: "Stock Liquid Berhasil Diupdate",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Kurangi stok dan simpan transaksi setelah pembayaran berhasil
router.post("/reduce-stock", async (req, res) => {
  const { cart } = req.body; // Pastikan frontend mengirim userId
  try {
    for (let item of cart) {
      await reduceStockService(item.id, item.qty);
      await createNewTransaction({
        liquidID: item.id,
        qty: item.qty,
        totalPrice: item.qty * item.price,
      });
    }
    res.status(200).send({
      message:
        "Stok berhasil dikurangi dan transaksi berhasil disimpan",
    });
  } catch (error) {
    console.error(
      "Error reducing stock or saving transaction",
      error
    );
    res.status(500).send({
      message:
        "Gagal mengurangi stok atau menyimpan transaksi",
    });
  }
});

// Dapatkan detail stok semua liquid
router.get("/stock", async (req, res) => {
  const stock = await prisma.$queryRaw`
    SELECT stockLiquid.id, detailLiquid.id, detailLiquid.name, detailLiquid.nicotine, detailLiquid.taste,
    detailLiquid.material, detailLiquid.image, detailLiquid.price, stockLiquid.stock
    FROM stockLiquid
    JOIN detailLiquid ON stockLiquid.detailLiquidId = detailLiquid.id`;
  res.send(stock);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const liquid = await prisma.$queryRaw`
  SELECT stockLiquid.id, detailLiquid.id, detailLiquid.name, detailLiquid.nicotine, detailLiquid.taste,
  detailLiquid.material, detailLiquid.image, detailLiquid.price, stockLiquid.stock
  FROM stockLiquid
  JOIN detailLiquid ON stockLiquid.detailLiquidId = detailLiquid.id WHERE detailLiquid.id = ${id}`;
  res.send(liquid);
});


router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.$transaction(async (prisma) => {
            await prisma.$queryRaw`DELETE FROM stockLiquid WHERE detailLiquidId = ${id}`;
            await prisma.$queryRaw`DELETE FROM detailLiquid WHERE id = ${id}`;
            res.send("Berhasil Menghapus Liquid")
        });

 
    } catch (error) {
        console.error("Error deleting liquid:", error);
        res.status(500).send("Terjadi kesalahan saat menghapus data.");
    }
});
module.exports = router;
