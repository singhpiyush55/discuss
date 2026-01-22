import './App.css'
import LandingPage from './LandingPage';
import CreateJoinRoom from "./CreateJoinRoom"; 
import JoinRoom from './JoinRoom'; 
import ChatRoom from './ChatRoom';
import { useState } from 'react';

function App() {
  const [page, setPage] = useState<"home" | "joinroom" | "chatroom">("home");
  const [roomId, setRoomId] = useState<string | number | null>(null);
  const [ws, setWs] = useState<WebSocket>();

  const navigate = (pageRec : "home" | "joinroom" | "chatroom", roomIdRec: string, wsType: WebSocket): void => {
    setPage(pageRec);
    setRoomId(roomIdRec);
    setWs(wsType);
  }

  return (
    <>
    <LandingPage>
      {page === "home" && <CreateJoinRoom onClickCreate={navigate} onClickJoin={() => {setPage("joinroom")}}/>}
      {page === "joinroom" && <JoinRoom onBack={() => setPage("home")} onJoin={navigate}/>}
      {page === "chatroom" && <ChatRoom roomId={roomId} socket={ws} onClickBack={()=>setPage("home")}/>}
    </LandingPage>
    </>
  )
}

export default App
