import React, {FC, memo} from "react";
import {useRoomData} from "@varhub-games/tools-react";

const RoomInfo: FC = () => {
    const data = useRoomData()
    return (
        <div>
            <div>id: {data.id}</div>
            <div>name: {data.name}</div>
            <div>connectionId: {data.connectionId}</div>
            <div>resource: {data.resource}</div>
            <div>connected: {String(data.connected)}</div>
            <div>entered: {String(data.entered)}</div>
            <div>owned: {String(data.owned)}</div>
            <div>destroyed: {String(data.destroyed)}</div>
            <div>roomStartDiffMs: {String(data.roomStartDiffMs)}</div>
            <div>roomStartDiffAccuracyMs: {String(data.roomStartDiffAccuracyMs)}</div>
        </div>
    )
}
export default memo(RoomInfo)