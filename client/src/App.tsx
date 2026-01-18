import './App.css'
import LandingPage from './LandingPage';
import CreateJoinRoom from "./CreateJoinRoom"; 
import JoinRoom from './JoinRoom'; 
import ChatRoom from './ChatRoom';
import { useState } from 'react';

function App() {
  const [page, setPage] = useState<"home" | "joinroom" | "chatroom">("home");
  const [roomId, setRoomId] = useState<string | number | null>(null);

  const navigate = (pageRec : "home" | "joinroom" | "chatroom", roomIdRec: string): void => {
    setPage(pageRec);
    setRoomId(roomIdRec);
  }

  return (
    <>
    <LandingPage>
      {page === "home" && <CreateJoinRoom onClickCreate={navigate} onClickJoin={() => {setPage("joinroom")}}/>}
      {page === "joinroom" && <JoinRoom onBack={() => setPage("home")} onJoin={navigate}/>}
      {page === "chatroom" && <ChatRoom roomId={roomId} onClickBack={()=>setPage("home")}/>}
    </LandingPage>
    </>
  )
}

export default App
