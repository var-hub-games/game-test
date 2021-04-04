import React, {FC, FormEventHandler, memo, useCallback} from "react";
import {useRoom, useRoomEvent, useRoomState, useRoomStateSelector} from "@varhub-games/tools-react";

const RoomState: FC = () => {
    const room = useRoom();
    const state = useRoomState();

    const onsubmit: FormEventHandler<HTMLFormElement> = useCallback(async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const path = String(formData.get("path"));
        const value = String(formData.get("value"));
        const ignoreHash = Boolean(formData.get("ignoreHash"));
        await room.changeState(value ? JSON.parse(value): undefined, path ? JSON.parse(path) : null, ignoreHash);
    }, [room]);

    return (
        <div>
            <div>State:</div>
            <textarea readOnly cols={60} rows={10} value={state !== undefined ? JSON.stringify(state, null, 2) : ""} />
            <hr/>
            <div>Modify state:</div>
            <form onSubmit={onsubmit}>
                <input name="path" type="text" placeholder="path (json)" defaultValue="[]"/><br/>
                <input name="value" type="text" placeholder="value (json)"  defaultValue={'{"x":1,"y": "text"}'}/><br/>
                <label>
                    <input name="ignoreHash" type="checkbox" value="on"/> ignore hash
                </label>
                <br/>
                <button type="submit">change state</button>
            </form>
            <hr/>
            <XYState/>
        </div>
    )
}
export default memo(RoomState);

const XYState: FC = memo(() => {
    const customState = useRoomStateSelector((state: any) => state?.x?.y);
    return (
        <div>
            <div>Watch for state.x.y</div>
            <div>
                <input type="text" readOnly value={customState ? JSON.stringify(customState) : ""} />
            </div>
            <div>Rendered at: {new Date().toLocaleTimeString(undefined, {
                hour12: false
            })}</div>
        </div>
    )
})