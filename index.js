require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { createPayment } = require("./services/payment");
const prisma = require("./lib/prisma");
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
bot.onText(/\/status/, async (msg) => {

  const telegramId = String(msg.chat.id);

  const user = await prisma.user.findUnique({
    where: {
      telegramId: telegramId
    }
  });


  if (!user) {

    await bot.sendMessage(
      msg.chat.id,
      "❌ You don't have ToolsBot access yet."
    );

    return;

  }


  if (user.status === "active") {

    await bot.sendMessage(
      msg.chat.id,
      `✅ ToolsBot Access Active

Product:
${user.product}

Status:
${user.status}`
    );

  }

});
  
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

        orderId: `ORDER-${chatId}`,

        orderDescription: "ToolsBot Access",

        successUrl: "https://your-domain.com/success",

        cancelUrl: "https://your-domain.com/cancel"

      });

      console.log(
  "INVOICE URL:",
  invoice.invoice_url
);

console.log(
  "INVOICE ID:",
  invoice.id
);
      await prisma.user.upsert({

  where: {
    telegramId: telegramId
  },

  update: {
    status: "active"
  },

  create: {
    telegramId: telegramId,
    product: "ToolsBot",
    status: "active"
  }

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

    console.log("NOWPayments Webhook:", payment);


    if (
      payment.payment_status === "finished" ||
      payment.payment_status === "confirmed"
    ) {

      const telegramId = payment.order_id.replace("ORDER-", "");


      await prisma.user.upsert({

        where: {
          telegramId: telegramId
        },

        update: {
          status: "active",
          paymentId: payment.payment_id || null
        },

        create: {
          telegramId: telegramId,
          product: "ToolsBot",
          paymentId: payment.payment_id || null,
          status: "active"
        }

      });


      await bot.sendMessage(
        telegramId,
        `✅ Payment Successful!

Your ToolsBot access has been activated 🚀`
      );

    }


    res.sendStatus(200);


  } catch (error) {

    console.error(error);

    res.sendStatus(500);

  }

});

// Start Server

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});
