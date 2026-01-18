type ChatRoomProps = {
    roomId: string | number | null;
}

function ChatRoom({roomId} :ChatRoomProps) {
    return(
        <div>
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