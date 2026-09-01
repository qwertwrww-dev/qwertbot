# Bot Telegram - Reply /start

## Cara pakai (di Termux)

1. Masuk ke folder ini:
   ```
   cd telegram-bot-start
   ```

2. Install dependency:
   ```
   npm install
   ```

3. Buka `bot.js`, ganti `ISI_TOKEN_BOT_DISINI` dengan token bot dari @BotFather.
   Atau jalankan pakai environment variable biar token gak ke-hardcode:
   ```
   BOT_TOKEN=isi_token_kamu node bot.js
   ```

4. Jalankan bot:
   ```
   npm start
   ```

5. Buka Telegram, kirim `/start` ke bot kamu. Bot akan balas dengan tombol "menu" yang mengarah ke https://kurominsm.vercel.app

## Deploy ke Railway
Bot ini pakai polling (bukan webhook), jadi tinggal deploy seperti biasa dan set environment variable `BOT_TOKEN` di dashboard Railway. Pastikan proses selalu jalan (tidak cocok untuk Netlify Functions karena butuh proses persisten).
