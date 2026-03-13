const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 3000 });

console.log("Server running on port 3000");

server.on("connection", (socket) => {

    console.log("Client connected");

    socket.on("message", (message) => {

        // broadcast message to all clients
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });

    });

    socket.on("close", () => {
        console.log("Client disconnected");
    });

});