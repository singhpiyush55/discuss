import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({port: 8080});

let allSockets : WebSocket[] = [];
let userCount = 0;
wss.on("connection", (socket)=>{
    allSockets.push(socket);
    userCount++;
    console.log("user connected = " +userCount);

    socket.on("message", (message)=>{
        console.log("Message received: " +message.toString() + "from user "+userCount);
        for(let i = 0; i < allSockets.length; i++){
            const s = allSockets[i];
            if (!s) continue; // Without this : 's' is possibly 'undefined'.
            s.send(message.toString());
        }
    })

    
})