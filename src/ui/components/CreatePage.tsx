import React, {FC, FormEventHandler, useCallback} from "react";
import VarHub from "@varhub-games/tools";

export const CreatePage: FC = () => {

    const onSubmit: FormEventHandler<HTMLFormElement> = useCallback((event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const host = formData.get("host");
        if (!(typeof host === "string")) return;
        const hub = new VarHub(host);
        hub.createRoom("", JSON.stringify({host}));
    }, []);

    return (
        <form onSubmit={onSubmit}>
            <input name="host" defaultValue="https://localhost/" />
            <button type="submit">Create room</button>
        </form>
    )
}