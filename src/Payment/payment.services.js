const midtransClient = require("midtrans-client");

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const createTransaction = async (req, res) => {
  const items = req.body.products.map((product) => ({
    id: product.id,
    price: product.price,
    quantity: product.qty,
    name: product.name,
  })); // Mapping items from the request

  let parameter = {
    transaction_details: {
      order_id:
        "order-id-node-" +
        Math.round(new Date().getTime() / 1000),
      gross_amount: req.body.amount,
    },
    item_details: items,
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: req.body.firstName,
      email: req.body.email,
    },
  };

  try {
    const transaction = await snap.createTransaction(
      parameter
    );
    res.status(200).json({
      token: transaction.token,
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

module.exports = { createTransaction };
