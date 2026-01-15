type Prop = {
    onClick: () => void;
}

function CreateJoinRoom({onClick} : Prop){
    return(
        <div className="h-[80vh] flex justify-center items-center border-gray-300">
            <button className="mx-5 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800">Create Room</button>
            <button onClick={onClick} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800">Join Room</button>
        </div>
    )
}

export default CreateJoinRoom;