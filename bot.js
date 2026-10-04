const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
// Portul implicit pentru Oracle Cloud (sau poți folosi orice port dorești)
const PORT = process.env.PORT || 3000; 

app.get('/', (req, res) => res.send('Robotul functioneaza in Oracle Cloud Free Tier!'));
app.listen(PORT, () => console.log(`Server web pornit pe portul ${PORT}`));

// Inițializare client WhatsApp cu salvarea permanentă a sesiunii
const client = new Client({
    authStrategy: new LocalAuth(), // Sesiunea se va salva în folderul .wwebjs_auth și nu va mai fi ștearsă
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--disable-dev-shm-usage', 
            '--disable-gpu'
        ]
    },
    // Folosim versiunea locală din cache pentru stabilitate crescută
    webVersionCache: {
        type: 'local',
        path: path.join(__dirname, '.wwebjs_cache')
    }
});

console.log('Se porneste robotul stabil pe Oracle Cloud...');

// Generare cod QR în terminal
client.on('qr', (qr) => {
    console.log('Scanează codul QR de mai jos pentru a te conecta:');
    qrcode.generate(qr, { small: false });
});

// Eveniment când botul s-a conectat cu succes
client.on('ready', () => {
    console.log('Robotul tau de WhatsApp este gata si ruleaza in Cloud 24/7!');
});

// Logica pentru comenzi
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
        await msg.reply('1.Va rugam sa nu spamati \n2.Faceti glume cu bunul simt si cu cine va permite');
    }
});

client.initialize();


