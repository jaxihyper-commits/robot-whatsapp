const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        // Setări esențiale pentru serverele din cloud
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--disable-dev-shm-usage', 
            '--disable-gpu'
        ]
    }
});

console.log('Se porneste robotul actualizat pe Render...');

client.on('qr', (qr) => {
    console.log('SUCCES! Codul QR a fost generat mai jos:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Robotul tau de WhatsApp este gata si ruleaza in Cloud 24/7!');
});

client.on('message_create', async (msg) => {
    const text = msg.body.toLowerCase();

    // 1. Comanda pentru TikTok (CORECTĂ)
    if (text.includes('!tiktok')) {
        await msg.reply('Acesta este contul lui Adi de tiktok unde facem live-uri : https://www.tiktok.com/@nesstywf');
    }

    // 2. Comanda pentru Discord (CORECTĂ)
    if (text.includes('!discord')) {
        await msg.reply('Acesta este serverul nostru de discord : https://discord.gg/R7wWb6SZwD');
    }

    // 3. Comanda pentru Reguli
    if (text.includes('!reguli')) {
        await msg.reply('1.Va rugam sa nu spamati \n2.Faceti glume cu bunul simti si cine va permite');
    }
});

client.initialize();

