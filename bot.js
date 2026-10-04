const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Robotul functioneaza cu Pairing Code!'));
app.listen(PORT, () => console.log(`Server web pornit pe portul ${PORT}`));

// --- INTRODUCE NUMĂRUL TĂU DE TELEFON AICI ---
// Format: codul țării urmat de număr (ex pentru România: 40712345678), fără "+" sau spații
const NUMAR_TELEFON_BOT = "40741733271"; 

const sessionDir = path.join(__dirname, 'session');

async function pornesteBot() {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    
    console.log('Se initializeaza conexiunea directa la WhatsApp...');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false // Dezactivăm codul QR definitiv
    });

    // Dacă botul nu este conectat, cerem un Pairing Code în loc de QR
    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            try {
                let code = await sock.requestPairingCode(NUMAR_TELEFON_BOT);
                // Formatăm codul frumos cu o cratimă la mijloc: XXXX-XXXX
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log('\n==================================================');
                console.log(`CODUL TĂU DE CONECTARE ESTE: ${code}`);
                console.log('==================================================\n');
            } catch (error) {
                console.error('Eroare la generarea codului de conectare:', error);
            }
        }, 3000); // Așteptăm 3 secunde pentru siguranță
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

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

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg?.message || msg?.key?.fromMe) return;

        const jid = msg.key.remoteJid;
        const textulMesajului = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').toLowerCase();

        const trimiteMesaj = async (text) => {
            await sock.sendMessage(jid, { text: text }, { quoted: msg });
        };

        if (textulMesajului.includes('!tiktok')) await trimiteMesaj('TikTok: https://www.tiktok.com/@nesstywf');
        if (textulMesajului.includes('!discord')) await trimiteMesaj('Discord: https://discord.gg/R7wWb6SZwD');
        if (textulMesajului.includes('!reguli')) await trimiteMesaj('1.Va rugam sa nu spamati \n2.Faceti glume cu bunul simt.');
    });
}

pornesteBot();
