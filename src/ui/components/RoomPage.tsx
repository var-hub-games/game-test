import React, {FC, useEffect, useState} from "react";
import {useRoom, useRoomData, useRoomEvent} from "@varhub-games/tools-react";
import RoomInfo from "./room/RoomInfo";
import RoomMessages from "./room/RoomMessages";
import RoomDoor from "./room/RoomDoor";
import RoomConnections from "./room/RoomConnections";
import RoomState from "./room/RoomState";
import RoomTimer from "./room/RoomTimer";

export const RoomPage: FC = () => {

    const room = useRoom();
    const roomData = useRoomData();
    const [roomDisconnectReason, setRoomDisconnectReason] = useState("");
    useEffect(() => {
        void room.connect("main");
    }, []);

    useRoomEvent("disconnect", ({detail}) => {
        setRoomDisconnectReason(detail ?? "unknown reason");
    })

    const [tab, setTab] = useState("info")

    if (!roomData.connected && roomDisconnectReason) {
        return <>disconnected: {roomDisconnectReason}</>
    }

    if (!roomData.connected) {
        return <>connecting</>
    }

    if (!roomData.entered) {
        return <>
            <div>knock-knock to {roomData.id}</div>
            <hr/>
            <RoomInfo/>
        </>
    }

    return (
        <div>
            <div>
                <button type="button" disabled={tab==="info"} onClick={() => setTab("info")}>INFO</button>
                <button type="button" disabled={tab==="door"} onClick={() => setTab("door")}>DOOR</button>
                <button type="button" disabled={tab==="messages"} onClick={() => setTab("messages")}>MESSAGES</button>
                <button type="button" disabled={tab==="connections"} onClick={() => setTab("connections")}>CONNECTIONS</button>
                <button type="button" disabled={tab==="state"} onClick={() => setTab("state")}>STATE</button>
                <button type="button" disabled={tab==="timer"} onClick={() => setTab("timer")}>TIMER</button>
            </div>
            <hr/>
            {tab === "info" && (<RoomInfo/>)}
            {tab === "messages" && (<RoomMessages/>)}
            {tab === "door" && (<RoomDoor/>)}
            {tab === "connections" && (<RoomConnections/>)}
            {tab === "state" && (<RoomState/>)}
            {tab === "timer" && (<RoomTimer/>)}
        </div>
    )
}