type Prop = {
    onBack: () => void
}

function JoinRoom({onBack}: Prop){
    return(
        <div className="border border-8 rounded-lg border-gray-400 flex flex-col justify-center ">
            <div className="p-4 m-3 text-gray-300">
                <button onClick={onBack}><img src="/assets/back.svg" alt="back" className="h-10 w-10"/></button>
            </div>
            <div>
                <input placeholder="Room ID" className="bg-gray-600 p-3 m-8 border-none rounded"></input>
                <button className="bg-gray-600 p-3 m-8 border rounded-lg border-gray-800 hover:bg-gray-800">Join</button>
            </div>
        </div>
    )
}

export default JoinRoom;