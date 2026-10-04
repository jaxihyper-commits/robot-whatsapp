const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000; 

app.get('/', (req, res) => res.send('Robotul functioneaza in Cloud cu TCT Session!'));
app.listen(PORT, () => console.log(`Server web pornit pe portul ${PORT}`));

// --- CONFIGURARE CORECTĂ A SESIUNII TCT ---
const sessionPath = path.join(__dirname, '.wwebjs_auth', 'session');

if (process.env.SESSION_ID) {
    console.log('S-a detectat SESSION_ID în setări. Se generează fișierele de autentificare...');
    try {
        if (!fs.existsSync(sessionPath)) {
            fs.mkdirSync(sessionPath, { recursive: true });
        }
        const sessionData = Buffer.from(process.env.SESSION_ID, 'base64').toString('utf-8');
        fs.writeFileSync(path.join(sessionPath, 'creds.json'), sessionData);
        console.log('Fișierul creds.json a fost creat cu succes.');
    } catch (error) {
        console.error('Eroare tehnică la procesarea noului Session ID:', error);
    }
} else {
    console.log('Atenție: Variabila SESSION_ID nu a fost găsită în setările cloud-ului!');
}

// --- CONFIGURARE BROWSER EXTERN PENTRU RENDER (SOLUȚIA DEFINITIVĂ) ---
const puppeteerOptions = {
    // Folosim o conexiune WebSocket către un server public gratuit de test pentru a rula WhatsApp
    browserWSEndpoint: 'ws://chrome.browserless.io?token=YOUR_API_KEY', 
    headless: true,
    args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage'
    ]
};

// Dacă vrei să ruleze 100% nativ fără token, Render poate folosi direct o conexiune simplificată:
if (!puppeteerOptions.browserWSEndpoint || puppeteerOptions.browserWSEndpoint.includes('YOUR_API_KEY')) {
    // Alternativă: Forțăm Puppeteer să folosească modul minimal dacă nu ai cont Browserless
    delete puppeteerOptions.browserWSEndpoint;
}

// Inițializare client WhatsApp
const client = new Client({
    takeoverOnConflict: true,
    puppeteer: {
        headless: true,
        // Eliminăm executablePath pentru a lăsa sistemul să ruleze în mod nativ prin fetch web
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    webVersionCache: {
        type: 'local',
        path: path.join(__dirname, '.wwebjs_cache')
    }
});

console.log('Se pornește robotul stabil folosind TCT Session...');

client.on('ready', () => {
    console.log('Robotul tău de WhatsApp este gata și rulează în Cloud 24/7!');
});

client.on('auth_failure', (msg) => {
    console.error('Autentificarea a eșuat. Verifică dacă Session ID-ul mai este valabil în telefon:', msg);
});

// Logica pentru comenzi
client.on('message_create', async (msg) => {
    const text = msg.body.toLowerCase();

    if (text.includes('!tiktok')) {
        await msg.reply('Acesta este contul lui Adi de tiktok unde facem live-uri : https://www.tiktok.com/@nesstywf');
    }
    if (text.includes('!discord')) {
        await msg.reply('Acesta este serverul nostru de discord : https://discord.gg/R7wWb6SZwD');
    }
    if (text.includes('!reguli')) {
        await msg.reply('1.Va rugam sa nu spamati \n2.Faceti glume cu bunul simt si cu cine va permite');
    }
});

client.initialize();


