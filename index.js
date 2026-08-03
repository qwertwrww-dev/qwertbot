require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

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
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `🌍 Welcome!

Choose an option below.`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🛒 Buy Subscription", callback_data: "buy_subscription" }],
          [{ text: "📞 Contact Admin", url: "https://t.me/yourusername" }]
        ]
      }
    }
  );
});

// Button Handler
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "buy_subscription") {
    await bot.sendMessage(
      chatId,
      "💳 Creating your crypto payment invoice...\nPlease wait."
    );
  }

  bot.answerCallbackQuery(query.id);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
