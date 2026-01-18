type ChatRoomProps = {
    roomId: string | number | null;
    onClickBack: ()=>void;
}

function ChatRoom({roomId, onClickBack} :ChatRoomProps) {
    return(
        <div>
            <div>
                <button onClick={()=>{onClickBack()}}>
                    <img src="/assets/back.svg" className="h-10 w-10"></img>
                </button>
            </div>
            <div>
                <p>Room ID: {roomId}</p>
            </div>

            <div>
                <p>chats will be here.</p>
            </div>

            <div>
                <input placeholder="Enter Text"></input>
                <button>Send</button>
            </div>
        </div>
    )
}

export default ChatRoom;