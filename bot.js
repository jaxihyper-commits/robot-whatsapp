const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
// Portul pe care Render îl va folosi automat
const PORT = process.env.PORT || 3000; 

app.get('/', (req, res) => res.send('Robotul functioneaza in Cloud cu TCT Session!'));
app.listen(PORT, () => console.log(`Server web pornit pe portul ${PORT}`));

// --- CONFIGURARE CORECTĂ A SESIUNII TCT ---
const sessionPath = path.join(__dirname, '.wwebjs_auth', 'session');

// Verificăm dacă ai adăugat SESSION_ID în variabilele de mediu din cloud
if (process.env.SESSION_ID) {
    console.log('S-a detectat SESSION_ID în setări. Se generează fișierele de autentificare...');
    try {
        // Creăm folderele necesare dacă nu există
        if (!fs.existsSync(sessionPath)) {
            fs.mkdirSync(sessionPath, { recursive: true });
        }
        
        // Decodificăm Session ID-ul text primit de pe site-ul TCT
        const sessionData = Buffer.from(process.env.SESSION_ID, 'base64').toString('utf-8');
        
        // Salvăm direct structura de credențiale cerută de whatsapp-web.js
        fs.writeFileSync(path.join(sessionPath, 'creds.json'), sessionData);
        console.log('Fișierul creds.json a fost creat cu succes.');
    } catch (error) {
        console.error('Eroare tehnică la procesarea noului Session ID:', error);
    }
} else {
    console.log('Atenție: Variabila SESSION_ID nu a fost găsită în setările cloud-ului!');
}

// Inițializare client WhatsApp optimizat pentru medii cloud (Render, Oracle, etc.)
const client = new Client({
    takeoverOnConflict: true,
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
        type: 'local',
        path: path.join(__dirname, '.wwebjs_cache')
    }
});

console.log('Se pornește robotul stabil folosind TCT Session...');

// Eveniment când botul s-a conectat cu succes
client.on('ready', () => {
    console.log('Robotul tău de WhatsApp este gata și rulează în Cloud 24/7!');
});

// Eveniment în caz că sesiunea a expirat sau a fost deconectată din telefon
client.on('auth_failure', (msg) => {
    console.error('Autentificarea a eșuat. Verifică dacă Session ID-ul mai este valabil în telefon:', msg);
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



