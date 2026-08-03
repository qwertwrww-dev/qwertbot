require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Welcome!\n\nChoose an option below:",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🛒 Buy", callback_data: "buy" }],
          [{ text: "📞 Contact", url: "https://t.me/yourusername" }]
        ]
      }
    }
  );
});

console.log("Bot is running...");
