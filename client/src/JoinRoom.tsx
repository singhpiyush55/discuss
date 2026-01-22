import { useRef, useState } from "react";
type Prop = {
    onBack: () => void
    onJoin: (pageRec : "home" | "joinroom" | "chatroom", roomIdRec: string, wsType: WebSocket) => void;
}
function handleJoin(
    onJoin: (pageRec : "home" | "joinroom" | "chatroom", roomIdRec: string, wsType: WebSocket) => void,
    inputRef: React.RefObject<HTMLInputElement | null>,
    setPopup: React.Dispatch<React.SetStateAction<"none" | "entervalid" | "noroomexist">>
){
    if(!inputRef.current){
        return;
    }

    const input = inputRef.current.value.trim();

    if(input === ""){
        setPopup("entervalid");
    }

    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
        ws.send(
            JSON.stringify({
                type: "join",
                payload: {
                    roomId: input
                }
            })
        )
    };

    ws.onmessage = (message) => {
        const parsedMessage = JSON.parse(message.data);

        if(
            parsedMessage.type === "ROOM_JOINED" &&
            parsedMessage.status === "OK"
        ){
            // Means room id is correct and let them join the room. 
            onJoin("chatroom", input, ws)
        }

        if(
            parsedMessage.type === "ROOM_NOT_JOINED" &&
            parsedMessage.status === "NOT_OK"
        ){
            setPopup("noroomexist")
        }
    }
}


function JoinRoom({onBack, onJoin   }: Prop){
    const inputRef = useRef<HTMLInputElement>(null)
    const [popup, setPopup] = useState<"none" | "entervalid" | "noroomexist">("none");


    return(
        <div className="border border-8 rounded-lg border-gray-400 flex flex-col justify-center ">
            <div>
                {popup === "none" && <None/>}
                {popup === "entervalid" && <EnterValid/>}
                {popup === "noroomexist" && <NoRoomExist/>}
            </div>
            <div>
                <div className="p-4 m-3 text-gray-300">
                    <button onClick={onBack}><img src="/assets/back.svg" alt="back" className="h-10 w-10"/></button>
                </div>
                <div>
                    <input
                        ref={inputRef} 
                        placeholder="Room ID" 
                        className="bg-gray-600 p-3 m-8 border-none rounded"
                    ></input>
                    <button
                        onClick={() => {handleJoin(onJoin, inputRef, setPopup)}} 
                        className="bg-gray-600 p-3 m-8 border rounded-lg border-gray-800 hover:bg-gray-800"
                    >Join</button>
                </div>
            </div>
        </div>
    )
}

function None(){
    return(
        <></>
    )
}
function EnterValid(){
    return(
        <>
            <p>Enter a room id</p>
        </>
    )
}
function NoRoomExist(){
    return(
        <>
            <p>No such room exist.</p>
        </>
    )
}

export default JoinRoom;