require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { createPayment } = require("./services/payment");
const prisma = require("./lib/prisma");
const products = require("./config/products");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

const pendingOrders = {};

// Health Check
app.get("/", (req, res) => {
  res.send("Global Payment Bot is Online 🚀");
});

// Start Command
bot.onText(/\/start/, async (msg) => {

  const buttons = Object.values(products).map(product => ([
    {
      text: `${product.name} - $${product.price}`,
      callback_data: `buy_${product.id}`
    }
  ]));

  buttons.push([
    {
      text: "📞 Contact Admin",
      url: "https://t.me/qwertwrww"
    }
  ]);

  await bot.sendMessage(
    msg.chat.id,
    "🌍 Welcome!\n\nChoose an option below.",
    {
      reply_markup: {
        inline_keyboard: buttons
      }
    }
  );

});

// Status Command
bot.onText(/\/status/, async (msg) => {

  const telegramId = String(msg.chat.id);

  const user = await prisma.user.findUnique({
    where: {
      telegramId
    }
  });

  if (!user) {

    return bot.sendMessage(
      msg.chat.id,
      "❌ You don't have ToolsBot access yet."
    );

  }

  await bot.sendMessage(
    msg.chat.id,
    `✅ ToolsBot Access Active

Product: ${user.product}

Status: ${user.status}`
  );

});

// Button Handler
bot.on("callback_query", async (query) => {

  const chatId = query.message.chat.id;

  await bot.answerCallbackQuery(query.id);

  if (!query.data.startsWith("buy_")) return;

  const productId = query.data.replace("buy_", "");

  const product = products[productId];

  if (!product) {
    return bot.sendMessage(chatId, "❌ Product not found.");
  }
pendingOrders[chatId] = {
  productId: product.id
};

return bot.sendMessage(
  chatId,
  `📝 Product: ${product.name}

Please enter the mobile number you want to track..`
);
  try {

    await bot.sendMessage(
      chatId,
      `💳 Creating invoice for ${product.name}...`
    );

    const invoice = await createPayment({
      priceAmount: product.price,
      priceCurrency: product.currency,
      payCurrency: product.payCurrency,
      orderId: `ORDER-${chatId}-${product.id}`,
      orderDescription: product.description,
      successUrl: "https://your-domain.com/success",
      cancelUrl: "https://your-domain.com/cancel"
    });

    await bot.sendMessage(
      chatId,
      `✅ Payment Created

🛒 Product:
${product.name}

💰 Price:
$${product.price}

💎 Pay With:
${product.payCurrency.toUpperCase()}

🔗 Payment Link:
${invoice.invoice_url}`
    );

  } catch (error) {

    console.error(error.response?.data || error.message);

    await bot.sendMessage(
      chatId,
      "❌ Failed creating payment invoice."
    );

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

      const parts = payment.order_id.split("-");

const telegramId = parts[1];
const productId = parts[2];

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
          product: productId,
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
