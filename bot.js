const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Robotul Baileys functioneaza in Cloud!'));
app.listen(PORT, () => console.log(`Server de monitorizare pornit pe portul ${PORT}`));

// --- CONFIGURARE SESIUNE ---
const sessionDir = path.join(__dirname, 'session');

if (process.env.SESSION_ID) {
    console.log('Se aplica SESSION_ID din variabilele de mediu...');
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
    }
    try {
        const decryptedData = Buffer.from(process.env.SESSION_ID, 'base64').toString('utf-8');
        fs.writeFileSync(path.join(sessionDir, 'creds.json'), decryptedData);
        console.log('Sesiunea TCT a fost scrisa cu succes.');
    } catch (e) {
        console.error('Eroare la procesarea SESSION_ID:', e);
    }
} else {
    console.log('Atentie: SESSION_ID lipseste din setari!');
}

async function pornesteBot() {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    
    console.log('Se initializeaza conexiunea la WhatsApp...');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if (connection === 'close') {
            console.log('Conexiune inchisa. Se incearca repornirea...');
            pornesteBot();
        } else if (connection === 'open') {
            console.log('Robotul tau de WhatsApp este ONLINE si functioneaza in fundal 24/7!');
        }
    });

    // Logica comenzi text
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const jid = msg.key.remoteJid;
        const textulMesajului = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').toLowerCase();

        const trimiteMesaj = async (text) => {
            await sock.sendMessage(jid, { text: text }, { quoted: msg });
        };

        if (textulMesajului.includes('!tiktok')) {
            await trimiteMesaj('Acesta este contul lui Adi de tiktok unde facem live-uri : https://www.tiktok.com/@nesstywf');
        }
        if (textulMesajului.includes('!discord')) {
            await trimiteMesaj('Acesta este serverul nostru de discord : https://discord.gg/R7wWb6SZwD');
        }
        if (textulMesajului.includes('!reguli')) {
            await trimiteMesaj('1.Va rugam sa nu spamati \n2.Faceti glume cu bunul simt si cu cine va permite');
        }
    });
}

pornesteBot();
