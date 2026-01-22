import { useEffect, useRef } from "react";

type ChatRoomProps = {
    roomId: string | number | null;
    socket: WebSocket | undefined;
    onClickBack: ()=>void;
}


function ChatRoom({roomId, onClickBack, socket} :ChatRoomProps) {
    const ws = socket;
    const inputRef = useRef<HTMLInputElement | null>(null);

    // add this handler inside ChatRoom
    const handleSend = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN || !inputRef.current) return;

    const message = inputRef.current.value.trim();
    if (message === "") return;

    ws.send(
        JSON.stringify({
        type: "chat",
        payload: {
            message
        }
        })
    );

    inputRef.current.value = "";
    };


    return(
        <div
            className="border-4 border-grey-900 rounded-lg p-1 w-1/3 h-96 flex flex-col"
        >
            <div
                className="border-3 border-grey-900 rounded-lg flex items-center gap-3 p-2"
            >
            <button onClick={()=>{onClickBack()}}>
                <img
                src="/assets/back.svg"
                className="h-10 w-10"
                />
            </button>
            <div
                className="p-4"
            >
                <p>Room ID: {roomId}</p>
            </div>
            </div>


            <div className="flex-1 overflow-y-auto p-2">
                {}
            </div>

            <div className="flex items-center gap-2 mt-2">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter text"
                    className="flex-1 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-black"
                />
                <button
                    type="button"
                    className="px-4 py-2 rounded-md bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 active:scale-95 transition-transform"
                    onClick={()=>{handleSend()}}
                >
                    Send
                </button>
            </div>
        </div>
    )
}

export default ChatRoom;