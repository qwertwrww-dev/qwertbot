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

      console.log("INVOICE DATA:", invoice);
      
        priceAmount: 100,

        priceCurrency: "usd",

        payCurrency: "ton",

        orderId: `ORDER-${chatId}`,

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

💎 Pay With:
TON

🔗 Payment Link:
${invoice.invoice_url}`
      );


    } catch (error) {

      console.log(
        "PAYMENT ERROR:",
        JSON.stringify(
          error.response?.data || error.message,
          null,
          2
        )
      );


      await bot.sendMessage(
        chatId,
        "❌ Failed creating payment invoice. Please try again later."
      );

    }

  }

});



// NOWPayments Webhook

app.post("/nowpayments-webhook", async (req, res) => {

  try {

    const payment = req.body;

    console.log(
      "NOWPayments Webhook:",
      payment
    );


    if (
      payment.payment_status === "finished" ||
      payment.payment_status === "confirmed"
    ) {


      const telegramId = payment.order_id.replace(
        "ORDER-",
        ""
      );


      await bot.sendMessage(
        telegramId,
        `✅ Payment Successful!

Your ToolsBot access has been activated 🚀`
      );


    }


    res.sendStatus(200);


  } catch (error) {

    console.error(
      "Webhook Error:",
      error
    );

    res.sendStatus(500);

  }

});



// Start Server

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});
