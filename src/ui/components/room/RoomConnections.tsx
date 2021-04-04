import React, {FC, FormEventHandler, memo, useCallback, useState} from "react";
import {useRoom, useRoomConnections, useRoomData} from "@varhub-games/tools-react";

interface Message {
    from: string,
    message: string,
    incoming: boolean,
}
const RoomConnections: FC = () => {
    const connections = useRoomConnections();
    const room = useRoom();
    const roomData = useRoomData();

    return (
        <div>
            <div>connections ({connections.size})</div>
            {Array.from(connections.values()).map((connection) => (
                <div key={connection.id}>
                    {connection.name} ({connection.resource})
                    {connection.current ? (
                        <>&nbsp;current</>
                    ) : (
                        <>
                            &nbsp;
                            <button disabled={!roomData.owned} onClick={() => room.door.block(connection.accountId)}>
                                block account
                            </button>
                        </>
                    )}

                </div>
            ))}
        </div>
    );
};
export default memo(RoomConnections)