const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        // Setări obligatorii pentru ca browserul ascuns să poată rula pe serverele Linux de la Render
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--disable-dev-shm-usage', 
            '--disable-gpu'
        ]
    }
});

console.log('Se porneste robotul pe Render...');

client.on('qr', (qr) => {
    // Generăm codul QR în secțiunea Logs de pe Render pentru a-l putea scana
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Robotul tau de WhatsApp este gata si ruleaza in Cloud 24/7!');
});

client.on('message_create', async (msg) => {
    const text = msg.body.toLowerCase();

    // 1. Comanda pentru TikTok
    if (text.includes('!tiktok')) {
        await msg.reply('Acesta este contul lui Adi de tiktok unde facem live-uri : https://tiktok.com');
    }

    // 2. Comanda pentru Discord (ACTUALIZAT LA FIX)
    if (text.includes('!discord')) {
        await msg.reply('Acesta este serverul nostru de discord : https://discord.gg/R7wWb6SZwD');
    }

    // 3. Comanda pentru Reguli
    if (text.includes('!reguli')) {
        await msg.reply('1.Va rugam sa nu spamati \n2.Faceti glume cu bunul simti si cu cine va permite');
    }
});

client.initialize();
