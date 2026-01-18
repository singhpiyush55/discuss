import './App.css'
import LandingPage from './LandingPage';
import CreateJoinRoom from "./CreateJoinRoom"; 
import JoinRoom from './JoinRoom'; 
import ChatRoom from './ChatRoom';
import { useState } from 'react';

function App() {
  const [page, setPage] = useState<"home" | "room" | "chatroom">("home");
  const [roomId, setRoomId] = useState<string | number | null>(null);

  const navigate = (pageRec : "home" | "room" | "chatroom", roomIdRec: string): void => {
    setPage(pageRec);
    setRoomId(roomIdRec);
  }

  return (
    <>
    <LandingPage>
      {page === "home" && <CreateJoinRoom onClick={navigate}/>}
      {page === "room" && <JoinRoom onBack={() => setPage("home")}/>}
      {page === "chatroom" && <ChatRoom roomId={roomId}/>}
    </LandingPage>
    </>
  )
}

export default App
