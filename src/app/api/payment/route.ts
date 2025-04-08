import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    // Optional: Generate a random receipt ID using UUID or timestamp hash
    const receiptId = crypto
      .createHash("md5")
      .update(Date.now().toString())
      .digest("hex")
      .slice(0, 12);

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${receiptId}`,
      payment_capture: 1, // Auto-capture
    };

    const order = await razorpay.orders.create(options);

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return new Response(JSON.stringify({ error: "Error creating order" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
