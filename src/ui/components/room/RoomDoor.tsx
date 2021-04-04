import React, {FC, memo, useCallback} from "react";
import {useDoor, useDoorKnock, useRoomData} from "@varhub-games/tools-react";
import {Door} from "@varhub-games/tools/dist/Door";

const RoomDoor: FC = () => {
    const door: Door = useDoor();
    const knock: Door["knock"] = useDoorKnock();

    return (
        <div>
            <div>mode: {door.mode}</div>
            <hr/>

            <div>allowlist ({door.allowList.size})</div>
            {Array.from(door.allowList).map(value => (
                <div key={value}>
                    {value}
                    &nbsp;
                    <button onClick={() => door.block(value)}>block</button>
                </div>
            ))}
            <hr/>

            <div>blocklist ({door.blockList.size})</div>
            {Array.from(door.blockList).map(value => (
                <div key={value}>
                    {value}
                    &nbsp;
                    <button onClick={() => door.allow(value)}>allow</button>
                </div>
            ))}
            <hr/>

            <div>Knock ({knock.size})</div>
            {Array.from(knock.values()).map((account) => (
                <div key={account.id}>
                    <span>{account.name}</span>
                    &nbsp;
                    <button onClick={() => door.allow(account.id)}>allow</button>
                    <button onClick={() => door.block(account.id)}>block</button>
                </div>
            ))}

        </div>
    )
}
export default memo(RoomDoor)