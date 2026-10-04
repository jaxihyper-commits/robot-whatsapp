const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const express = require('express');

// Pornim serverul web pentru a opri eroarea de port binding pe Render
const app = express();
const PORT = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Robotul functioneaza in Cloud!'));
app.listen(PORT, () => console.log(`Server web pornit pe portul ${PORT}`));

const authPath = path.join(__dirname, '.wwebjs_auth');
if (fs.existsSync(authPath)) {
    try {
        fs.rmSync(authPath, { recursive: true, force: true });
    } catch (err) {
        console.log('Se curata memoria cache...');
    }
}

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--disable-dev-shm-usage', 
            '--disable-gpu'
        ]
    },
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://githubusercontent.com'
    }
});

console.log('Se porneste robotul cu logare rapida pentru iPhone...');

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: false });
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

