import './App.css'
import LandingPage from './LandingPage';
import CreateJoinRoom from "./CreateJoinRoom"; 
import JoinRoom from './JoinRoom'; 
import ChatRoom from './ChatRoom';
import { useState } from 'react';

function App() {
  const [page, setPage] = useState<"home" | "room" | "chatroom">("home");
  return (
    <>
    <LandingPage>
      {page === "home" && <CreateJoinRoom onClick={() => setPage("chatroom")}/>}
      {page === "room" && <JoinRoom onBack={() => setPage("home")}/>}
      {page === "chatroom" && <ChatRoom/>}
    </LandingPage>
    </>
  )
}

export default App
