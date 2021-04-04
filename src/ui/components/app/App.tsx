import React, {FC, useEffect, useState} from "react";
import {Room} from "@varhub-games/tools/dist/Room";
import VarHub from "@varhub-games/tools";
import {RoomProvider} from "@varhub-games/tools-react";
import {RoomPage} from "../RoomPage";
import {useQueryParam} from "../../use/useQueryParam";
import {CreatePage} from "../CreatePage";

export const App: FC = () => {
    const roomId = useQueryParam("roomId");
    const state = useQueryParam("state");

    const [room, setRoom] = useState<Room|null>(null);

    useEffect(() => {
        if (!roomId) return;
        if (typeof state != "string") return;
        const { host } = JSON.parse(state);
        const hub = new VarHub(host);
        hub.joinRoom(roomId, state).then(setRoom);

    }, [roomId, state]);

    if (!roomId) {
        return <CreatePage/>
    }
    if (!room) {
        return <>loading...</>
    }
    return (
        <RoomProvider room={room}>
            <RoomPage/>
        </RoomProvider>
    )
}