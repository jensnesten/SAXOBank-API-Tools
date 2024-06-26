const WebSocket = require('ws');
const { TextDecoder } = require('util');
const express = require('express');
const http = require('http');
const fs = require('fs');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const accessToken = process.env.ACCESS_TOKEN;
const accountKey = process.env.ACCOUNT_KEY;
const clientKey = process.env.CLIENT_KEY;

const contextId = encodeURIComponent("MyApp42069" + Date.now());
const streamerUrl = "wss://streaming.saxobank.com/sim/openapi/streamingws/connect?authorization=" + encodeURIComponent("BEARER " + accessToken) + "&contextId=" + contextId;
const connection = new WebSocket(streamerUrl);
console.log("Connection created. Status: " + connection.readyState);

connection.onopen = function () {
    console.log("Streaming connected.");
};
connection.onclose = function () {
    console.log("Streaming disconnected.");
};
connection.onerror = function (evt) {
    console.error(evt);
};

function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
}

let messages = [];
connection.onmessage = function (event) {
    const utf8Decoder = new TextDecoder('utf-8');
    const decodedMessage = utf8Decoder.decode(event.data);

    // Strip the prefix ("price" or "priceU") to get the JSON string
    const jsonStr = decodedMessage.substring(decodedMessage.indexOf("{"));

    try {
        // Parse the JSON string to an object
        const messageObj = JSON.parse(jsonStr);
        
        // Extract the Ask price
        const date = messageObj.LastUpdated;
        const askPrice = messageObj.Quote?.Ask;
        const bidPrice = messageObj.Quote?.Bid;

        // Check if Ask price exists and log it
        if (askPrice !== undefined) {
            console.log(messageObj);
            broadcast(JSON.stringify({ value: askPrice }));

            // Save the askPrice to a JSON file if needed
            //const dataToSave = { time: date, askPrice: askPrice };
            //messages.push(dataToSave);
            //fs.writeFileSync('askPrices.json', JSON.stringify(messages, null, 2));
        } else {
            return;
        }
    } catch (error) {
        console.error("Error parsing JSON:", error);
    }
};

const data = {
    "ContextId": contextId,
    "RefreshRate": 1000,
    "ReferenceId": "price",
    "Arguments": {
        "ClientKey": clientKey,
        "AccountKey": accountKey,
        "AssetType": "CfdOnIndex",
        "Uic": 4913
    }
};

fetch("https://gateway.saxobank.com/sim/openapi/trade/v1/prices/subscriptions", {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken
    },
    "body": JSON.stringify(data)
});

function disconnect() {
    const NORMAL_CLOSURE = 1000;
    if (connection !== null) {
        connection.close(NORMAL_CLOSURE);  // This will trigger the onclose event
    } else {
        console.error("Connection not active.");
    }
}

// Clean up resources before exiting
function cleanUpAndExit() {
    disconnect(); // Ensure WebSocket is disconnected
    process.exit(); // Exit the process
}

// Handle normal exit
process.on('exit', cleanUpAndExit);

// Handle Ctrl+C
process.on('SIGTSTP', () => {
    console.log('Received SIGTSTP (Ctrl+Z). Performing cleanup...');
    cleanUpAndExit();
    // After cleanup, you might want to actually stop the process using process.kill
    process.kill(process.pid, 'SIGSTOP'); // This line is optional and actually stops the process
});

// Handle uncaught exceptions to prevent unexpected behavior
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    cleanUpAndExit(); // Cleanup before exit
});
