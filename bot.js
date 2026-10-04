const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { computeExecutablePath } = require('@puppeteer/browsers');
const path = require('path');

async function pornesteRobot() {
    let chromePath = '';
    
    try {
        // Găsește automat unde a descărcat Render browserul Chrome în cloud
        chromePath = computeExecutablePath({
            cacheDir: path.join(process.env.HOME || '/opt/render', '.cache', 'puppeteer'),
            browser: 'chrome',
            buildId: '146.0.7680.31'
        });
        console.log(`S-a gasit browserul Chrome la calea: ${chromePath}`);
    } catch (e) {
        console.log('Se incearca pornirea cu setarile implicite...');
    }

    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true,
            // Folosește calea găsită automat sau lasă implicit dacă nu o găsește
            executablePath: chromePath || undefined,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage', 
                '--disable-gpu'
            ]
        }
    });

    console.log('Se conecteaza la WhatsApp...');

    client.on('qr', (qr) => {
        console.log('SUCCES! Codul QR a fost generat mai jos:');
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Robotul tau de WhatsApp este gata si ruleaza in Cloud 24/7!');
    });

    client.on('message_create', async (msg) => {
        const text = msg.body.toLowerCase();

        if (text.includes('!tiktok')) {
            await msg.reply('Acesta este contul lui Adi de tiktok unde facem live-uri : https://www.tiktok.com/@nesstywf');
        }

        if (text.includes('!discord')) {
            await msg.reply('Acesta este serverul nostru de discord : https://discord.gg/R7wWb6SZwD');
        }

        if (text.includes('!reguli')) {
            await msg.reply('1.Va rugam sa nu spamati \n2.Faceti glume cu bunul simti si cine va permite');
        }
    });

    client.initialize();
}

pornesteRobot();


