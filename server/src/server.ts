import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({port: 8080});

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
            }else{
                console.log("Not found")
                socket.send(JSON.stringify({
                    type: "ROOM_NOT_JOINED",
                    status: "NOT_OK"
                }))
            }
        }

        if(parsedMessage.type === "chat"){
            console.log("Chat message received:", parsedMessage.payload.message);
        }
    })
})