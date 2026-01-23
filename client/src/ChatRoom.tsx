import { useEffect, useRef, useState, useLayoutEffect  } from "react";

type ChatRoomProps = {
    roomId: string | number | null;
    socket: WebSocket | undefined;
    onClickBack: ()=>void;
}


function ChatRoom({roomId, onClickBack, socket} :ChatRoomProps) {
    const ws = socket;
    const [message, setMessage] = useState<string[]>([]);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);


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

    useEffect(()=>{
        if(!ws) return; 
        ws.onmessage = (e) => {
            const parsedMessage = JSON.parse(e.data);
            setMessage(message => [...message, parsedMessage.payload.message]);
            console.log(message);
        }
    }, [ws])

    useLayoutEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);


    return(
        <div
            className="border-4 border-grey-900 rounded-lg p-1 w-1/3 h-96 flex flex-col"
        >
            <div
                className="border-3 border-grey-900 rounded-lg flex items-center gap-3 p-2"
            >
            <button onClick={()=>{
                ws?.close(1000, "User left the room")
                onClickBack()
            }}>
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


            <div className="flex-1 overflow-y-auto p-2 space-y-2 chat-scroll">
            {message.map((m, i) => (
                <div key={i} className="flex">
                    <div
                        className="
                        bg-gray-200
                        text-black
                        px-3
                        py-2
                        rounded-lg
                        max-w-[70%]
                        w-fit
                        break-words
                        text-sm
                        "
                    >
                        {m}
                    </div>
                </div>
            ))}
            <div ref={bottomRef} />
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