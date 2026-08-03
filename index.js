require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { createPayment } = require("./services/payment");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

// Health Check
app.get("/", (req, res) => {
  res.send("Global Payment Bot is Online 🚀");
});


// Start Command
bot.onText(/\/start/, async (msg) => {

  await bot.sendMessage(
    msg.chat.id,
    `🌍 Welcome!

Choose an option below.`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🛒 Buy ToolsBot",
              callback_data: "buy_ToolsBot"
            }
          ],
          [
            {
              text: "📞 Contact Admin",
              url: "https://t.me/qwertwrww"
            }
          ]
        ]
      }
    }
  );

});


// Button Handler
bot.on("callback_query", async (query) => {

  const chatId = query.message.chat.id;

  await bot.answerCallbackQuery(query.id);


  if (query.data === "buy_ToolsBot") {

    try {

      await bot.sendMessage(
        chatId,
        "💳 Creating your crypto payment invoice...\nPlease wait."
      );


      const invoice = await createPayment({

        priceAmount: 100,

        priceCurrency: "usd",

        payCurrency: "ton",

        orderId: `ORDER-${Date.now()}`,

        orderDescription: "ToolsBot Access",

        successUrl: "https://your-domain.com/success",

        cancelUrl: "https://your-domain.com/cancel"

      });


      await bot.sendMessage(
        chatId,
        `✅ Payment Created

🛒 Product:
ToolsBot Access

💰 Amount:
$100

💎 Payment:
TON

🔗 Pay Here:
${invoice.invoice_url}`
      );


    } catch (error) {

      console.error(
        "Payment Error:",
        error.response?.data || error.message
      );


      await bot.sendMessage(
        chatId,
        "❌ Failed creating payment invoice. Please try again later."
      );

    }

  }

});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
