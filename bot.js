const TelegramBot = require('node-telegram-bot-api');

// Ganti dengan token bot kamu dari @BotFather
const TOKEN = process.env.BOT_TOKEN || 'ISI_TOKEN_BOT_DISINI';

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const text = `ORDER JASA DISINI 👇`;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'menu',
            url: 'http://t.me/jasalacaknohp_bot/JASALACAKNOHP',
          },
        ],
      ],
    },
  };

  bot.sendMessage(chatId, text, options);
});

bot.on('polling_error', (err) => {
  console.error('Polling error:', err.message);
});

console.log('Bot berjalan...');
