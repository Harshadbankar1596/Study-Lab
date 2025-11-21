// import Razorpay from "razorpay";
// import crypto from "crypto";

const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
const createOrder = async (req, reply) => {
  try {
    const { amount, currency = "INR" } = req.body;

    console.log("👉 Received body:", req.body);

    const options = {
      amount: Number(amount) * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    console.log("👉 Options for order:", options);

    const order = await razorpay.orders.create(options);

    console.log("✅ Razorpay order created:", order);

    return reply.send({ success: true, order });
  } catch (error) {
    console.error("❌ Razorpay order create error:", error);
    return reply.status(500).send({ success: false, message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res
        .status(200)
        .json({ success: true, message: "Payment verified successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, verifyPayment };
