import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({port: 8080});

interface User {
    socket: WebSocket;
    room: string | number;
}
let allSockets : User[] = [];

// {     ==> This is our schema.
//    "type": "join",
//    "payload": {
//      "roomId": "123"
//    }
// }


wss.on("connection", (socket)=>{
    socket.on("message", (message)=>{
        //@ts-ignore
        const parsedMessage = JSON.parse(message);

        if(parsedMessage.type === "create-join"){
            allSockets.push({
                socket: socket,
                room: parsedMessage.payload.roomId
            })

            socket.send(JSON.stringify({
                type: "ROOM_JOINED",
                status: "OK",
                payload:{
                    roomId: parsedMessage.payload.roomId
                }
            }));
        }

        if(parsedMessage.type === "join"){
            // get the roomId, look for it in all sockets, if found send ok response and add it into all sockets if not send an not ok response. 
            let found = false;
            for(let i = 0; i < allSockets.length; i++){
                if(allSockets[i]?.room === parsedMessage.payload.roomId){
                    found = true;
                    break;
                }
            }
            if(found){
                socket.send(JSON.stringify({
                    type: "ROOM_JOINED",
                    status: "OK",
                    payload: {
                        roomId: parsedMessage.payload.roomId
                    }
                }))
            }else{
                socket.send(JSON.stringify({
                    type: "ROOM_NOT_JOINED",
                    status: "NOT_OK"
                }))
            }
        }

        if(parsedMessage.type === "chat"){
            let currentRoom = null;
            for(let i = 0; i < allSockets.length; i++){
                if(allSockets[i]?.socket === socket){
                    currentRoom = allSockets[i]?.room;
                    console.log(currentRoom);
                }
            }

            for(let i = 0; i < allSockets.length; i++){
                if(allSockets[i]?.room === currentRoom){
                    allSockets[i]?.socket.send(parsedMessage.payload.message)
                }
            }
        }
    })
})