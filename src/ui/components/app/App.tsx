import React, {FC, useState} from "react";
import {Room} from "@varhub-games/tools/dist/Room";
import {RoomProvider} from "@varhub-games/tools-react";
import {RoomPage} from "../RoomPage";
import {CreatePage} from "../CreatePage";

export const App: FC = () => {
    const [room, setRoom] = useState<Room|null>(null);

    if (!room) {
        return <CreatePage setRoom={setRoom}/>
    }
    return (
        <RoomProvider room={room}>
            <RoomPage/>
        </RoomProvider>
    )
}