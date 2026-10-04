const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Robotul functioneaza direct pe Render!'));
app.listen(PORT, () => console.log(`Server web pornit pe portul ${PORT}`));

// Folderul local unde se vor salva fișierele de autentificare pe serverul tău plătit
const sessionDir = path.join(__dirname, 'session');

async function pornesteBot() {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    
    console.log('Se initializeaza conexiunea directa la WhatsApp...');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false // Îl printăm manual mai jos pentru o formatare mai curată
    });

    sock.ev.on('creds.update', saveCreds);

    // Generare cod QR direct în panoul Render Logs dacă botul nu este conectat
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('\n==================================================');
            console.log('SCANEAZĂ CODUL QR DE MAI JOS CU TELEFONUL TĂU:');
            console.log('==================================================\n');
            qrcode.generate(qr, { small: true });
            console.log('\n==================================================\n');
        }

        if (connection === 'close') {
            const arTrebuieSaReporneasca = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Conexiune inchisa. Repornire automata:', arTrebuieSaReporneasca);
            if (arTrebuieSaReporneasca) {
                pornesteBot();
            }
        } else if (connection === 'open') {
            console.log('==================================================');
            console.log('Robotul tau de WhatsApp este ONLINE si ruleaza 24/7!');
            console.log('==================================================');
        }
    });

    // Logica comenzi text
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages;
        if (!msg[0]?.message || msg[0]?.key?.fromMe) return;

        const jid = msg[0].key.remoteJid;
        const textulMesajului = (msg[0].message.conversation || msg[0].message.extendedTextMessage?.text || '').toLowerCase();

        const trimiteMesaj = async (text) => {
            await sock.sendMessage(jid, { text: text }, { quoted: msg[0] });
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
