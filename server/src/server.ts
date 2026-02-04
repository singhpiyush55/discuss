import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";
import http from "http";
import express from "express";

dotenv.config();
const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer( { noServer: true } );
server.on("upgrade", (req, socket, head) => {
  if (req.url === "/ws") {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  } else {
    socket.destroy();
  }
});
// HTTP routes
app.get('/', (req, res) => {
  res.send('Hello over HTTP!')
})
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});

// New data structure for efficient operations. 
const roomToSockets = new Map<string, Set<WebSocket>>();
const socketToRoom = new Map<WebSocket, string>();


wss.on("connection", (socket)=>{
    socket.on("message", (message)=>{
        //@ts-ignore
        const parsedMessage = JSON.parse(message);

        if(parsedMessage.type === "create-join"){
            // Adding the new socket to socket list with its room id. 
            const roomId = parsedMessage.payload.roomId;
            socketToRoom.set(socket, roomId);

            // Adding roomId to the rooms list with the socket connected to it. 
            // As only here we are creating the room so no need to check if it exist or not. 
            roomToSockets.set(roomId, new Set<WebSocket>);
            roomToSockets.get(roomId)?.add(socket);

            socket.send(JSON.stringify({
                type: "ROOM_JOINED",
                status: "OK",
                payload:{
                    roomId: parsedMessage.payload.roomId
                }
            }));


            // Debug logs.
            console.log("Room Id : ", roomId);
            console.log("Sockets : ", roomToSockets.get(roomId)?.size)
        }

        if(parsedMessage.type === "join"){
            let found = false;
            console.log(parsedMessage);
            // Checking in rooms map, does any such room exist?
            if(roomToSockets.has(parsedMessage.payload.roomId)){
                found=true;
                console.log("Found.")
            }

            // If yes, add the socket in the socket map (this-socket, this-room) and in the room map (this-room, these-sockets)
            if(found){
                socketToRoom.set(socket, parsedMessage.payload.roomId);
                roomToSockets.get(parsedMessage.payload.roomId)?.add(socket);

                socket.send(JSON.stringify({
                    type: "ROOM_JOINED",
                    status: "OK",
                    payload: {
                        roomId: parsedMessage.payload.roomId
                    }
                }))
            // Debug logs.
                console.log("Room Id : ", parsedMessage.payload.roomId);
                console.log("Sockets : ", roomToSockets.get(parsedMessage.payload.roomId)?.size)                
            }else{
                console.log("Not found")
                socket.send(JSON.stringify({
                    type: "ROOM_NOT_JOINED",
                    status: "NOT_OK"
                }))
            }
        }

        if(parsedMessage.type === "chat"){
            // Get the socket, look for its room id. Get all the sockets in that room. And broadcast the message to all those sockets. 
            const roomId = socketToRoom.get(socket);

            // @ts-ignore -> It says roomId can be undefined. 
            // here sockets variable contains SET of sockets in that room. 
            const sockets = roomToSockets.get(roomId);

            // Send the message to every socket. 
            // @ts-ignore
            for(const s of sockets){
                s.send(JSON.stringify({
                    type: "chat",
                    payload: {
                        message: parsedMessage.payload.message
                    }
                }))
            }
        }
    })

    socket.on("close", (close)=>{
        console.log("Socket closed", close)

        // Remove it room that room.
        const roomId = socketToRoom.get(socket);
        if(!roomId) return;

        socketToRoom.delete(socket);
        roomToSockets.get(roomId)?.delete(socket);

        // If that room has no other socket, delete the room also.
        if(roomToSockets.get(roomId)?.size === 0){
            roomToSockets.delete(roomId)
        }
        // Debug logs.
        console.log("Room Id : ", roomId);
        console.log("Sockets : ", roomToSockets.get(roomId)?.size)    
    })
})