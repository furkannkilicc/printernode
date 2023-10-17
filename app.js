const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
app.use(cors());
app.use(bodyParser.json()); 


app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let printers = [];
let printRequest = null;

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'printers') {
            printers = data.printers;
        } else if (data.type === 'print') {
            printRequest = data;
        }
    });
});

app.post('/printers', (req, res) => {
    const receivedData = req.body;

    if (receivedData) {
        printers = receivedData.Printers;
        res.sendStatus(200); 
    } else {
        res.sendStatus(400); 
    }
});
app.get('/printers', (req, res) => {
    res.json(printers);
});

app.post('/print', (req, res) => {
    printRequest = req.body;
    res.sendStatus(200);
});

server.listen(8080, () => {
    console.log('Node.js sunucusu çalışıyor.');
});
