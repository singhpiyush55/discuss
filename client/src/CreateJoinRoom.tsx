

type Prop = {
    onClickCreate: (page: "home" | "joinroom" | "chatroom", roomId: string, wsType: WebSocket) => void;
    onClickJoin: () => void;
};

function createRoom(
  onClickCreate: (page: "home" | "joinroom" | "chatroom", roomId: string, wsType: WebSocket) => void
) {
  return () => { 
    const roomId = Date.now().toString(36);
    const ws = new WebSocket('wss://discuss-on28.onrender.com/ws');

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
    };

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "create-join",
          payload: { roomId },
        })
      );
    };

    ws.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data);

      if (
        parsedMessage.type === "ROOM_JOINED" &&
        parsedMessage.status === "OK"
      ) {
        console.log("Room created:", parsedMessage.payload.roomId);

        onClickCreate("chatroom", parsedMessage.payload.roomId, ws);
      }
    };
  };
}

function CreateJoinRoom({ onClickCreate, onClickJoin }: Prop) {
  return (
    <div className="h-[80vh] flex justify-center items-center border-gray-300">
      <button
        onClick={createRoom(onClickCreate)}
        className="mx-5 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800"
      >
        Create Room
      </button>

      <button
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800"
        onClick={() => {onClickJoin()}}
      >
        Join Room
      </button>
    </div>
  );
}

export default CreateJoinRoom;