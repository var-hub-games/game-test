import React, {FC} from "react";
import {useRoomData} from "@varhub-games/tools-react";

export const RoomPage: FC = () => {

    const roomData = useRoomData();

    return (
        <div>
            {JSON.stringify(roomData)}
        </div>
    )
}