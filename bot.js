const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Robotul WhatsApp Baileys este Online!'));
app.listen(PORT, () => console.log(`Server web pornit pe portul ${PORT}`));

// --- INTRODUCE NUMĂRUL TĂU DE TELEFON AICI ---
const NUMAR_TELEFON_BOT = "40741733271"; 

const sessionDir = path.join(__dirname, 'session');

async function pornesteBot() {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    
    console.log('Se initializeaza conexiunea directa la WhatsApp...');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        syncFullHistory: false,      // Oprește complet istoricul vechi
        markOnlineOnConnect: true    // Arată botul online instant
    });

    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            try {
                let code = await sock.requestPairingCode(NUMAR_TELEFON_BOT);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log('\n==================================================');
                console.log(`CODUL TĂU NOU DE CONECTARE ESTE: ${code}`);
                console.log('==================================================\n');
            } catch (error) {
                console.error('Eroare la generarea codului de conectare:', error);
            }
        }, 4000);
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            console.log(`Conexiune inchisa cu codul: ${statusCode}`);
            
            // Dacă eroarea este de tip "Invalid buffer" sau sesiunea e coruptă, curățăm folderul local automat
            if (statusCode === 400 || statusCode === DisconnectReason.loggedOut) {
                console.log('Sesiune corupta detectata. Se curata folderul session...');
                try {
                    fs.rmSync(sessionDir, { recursive: true, force: true });
                } catch (e) {}
            }
            
            console.log('Se incearca repornirea automata...');
            pornesteBot();
        } else if (connection === 'open') {
            console.log('\n==================================================');
            console.log('Robotul tau de WhatsApp este ONLINE si ruleaza 24/7!');
            console.log('==================================================\n');
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

// Prindem eroarea de "Invalid buffer" la nivel global pentru a nu opri scriptul, ci a-l reporni curat
process.on('uncaughtException', (err) => {
    if (err.message.includes('Invalid buffer')) {
        console.log('S-a prins eroarea "Invalid buffer". Se forțează resetarea sesiunii...');
        try {
            fs.rmSync(sessionDir, { recursive: true, force: true });
        } catch (e) {}
        process.exit(1); // Render va restarta serviciul instant, pornind de la zero curat
    } else {
        console.error('Alta eroare neasteptata:', err);
    }
});

pornesteBot();
