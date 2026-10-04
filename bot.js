const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');

// Identificăm calea corectă din cloud unde Linux instalează browserul Chrome
const chromePath = path.join('/opt', 'render', '.cache', 'puppeteer', 'chrome', 'linux-146.0.7680.31', 'chrome-linux', 'chrome');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        // Forțăm robotul să folosească Chrome-ul instalat pe serverul Linux
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || chromePath,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--disable-dev-shm-usage', 
            '--disable-gpu'
        ]
    }
});

console.log('Se porneste robotul pe Render cu link-urile si calea Chrome corectate...');

client.on('qr', (qr) => {
    console.log('SUCCES! Codul QR a fost generat:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Robotul tau de WhatsApp este gata si ruleaza in Cloud 24/7!');
});

client.on('message_create', async (msg) => {
    const text = msg.body.toLowerCase();

    // 1. Comanda pentru TikTok
    if (text.includes('!tiktok')) {
        await msg.reply('Acesta este contul lui Adi de tiktok unde facem live-uri : https://www.tiktok.com/@nesstywf');
    }

    // 2. Comanda pentru Discord
    if (text.includes('!discord')) {
        await msg.reply('Acesta este serverul nostru de discord : https://discord.gg/R7wWb6SZwD');
    }

    // 3. Comanda pentru Reguli
    if (text.includes('!reguli')) {
        await msg.reply('1.Va rugam sa nu spamati \n2.Faceti glume cu bunul simti si cine va permite');
    }
});

client.initialize();

