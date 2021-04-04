import React, {FC, FormEventHandler, memo, useCallback, useState} from "react";
import {useRoom, useRoomConnections, useRoomData, useRoomEvent} from "@varhub-games/tools-react";
import {Connection} from "@varhub-games/tools/dist/Connection";

interface Message {
    from: string,
    message: any,
    incoming: boolean,
}
const RoomMessages: FC = () => {
    const room = useRoom();
    const roomData = useRoomData();
    const [messages, setMessages] = useState<Message[]>([]);

    const connections = useRoomConnections();

    const addMessage = useCallback((message: Message) => {
        setMessages(messages => [message, ...messages]);
    }, [])

    const onsubmit: FormEventHandler<HTMLFormElement> = useCallback(async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const message = String(formData.get("message"));
        const recipient = String(formData.get("recipient"));
        const service = Boolean(formData.get("service"));
        const binary = Boolean(formData.get("binary"));
        const messageToSend = binary ? new TextEncoder().encode(message) : message;
        event.currentTarget.reset();
        if (recipient) {
            const connection: Connection|null = room.getConnection(recipient);
            if (!connection) return;
            await connection.sendMessage(messageToSend, Boolean(service));
        } else {
            await room.broadcast(messageToSend, Boolean(service));
        }
        addMessage({
            from: `${room.name}/${room.resource}`,
            incoming: false,
            message: messageToSend
        });
    }, [room]);

    useRoomEvent("message", ({detail: {from, message}}) => {
        const fromName = from ? `${from.name}/${from.resource}` : 'SERVICE'
        if (message instanceof ArrayBuffer) message = new Uint8Array(message);
        addMessage({
            from: fromName,
            incoming: true,
            message: message
        });
    });

    const sendBinary = useCallback(async () => {
        const message = Uint8Array.of(Math.random()*64, Math.random()*64, Math.random()*64)
        await room.broadcast(message);
        addMessage({
            from: `${room.name}/${room.resource}`,
            incoming: false,
            message: message
        });
    }, [room]);

    const sendServiceBinary = useCallback(async () => {
        const message = Uint8Array.of(Math.random()*64, Math.random()*64, Math.random()*64)
        await room.broadcast(message, true);
        addMessage({
            from: `${room.name}/${room.resource}`,
            incoming: false,
            message: message
        });
    }, [room]);

    return (
        <div>
            <form onSubmit={onsubmit}>
                <input name="message" type="text" placeholder="message" />
                <select name="recipient">
                    <option defaultChecked value="">*BROADCAST*</option>
                    {Array.from(connections.values()).map((connection: Connection) => (
                        <option key={connection.id} value={connection.id}>
                            {connection.name} {connection.resource}
                        </option>
                    ))}
                </select>
                <button name="send" type="submit">send</button>
                <br/>
                <label>
                    <input name="service" type="checkbox" value="on" disabled={!roomData.owned}/> as service
                </label>
                <label>
                    <input name="binary" type="checkbox" value="on" disabled={!roomData.owned}/> as binary
                </label>
            </form>
            <button type="button" onClick={sendBinary}>send random binary</button>
            <button type="button" disabled={!roomData.owned} onClick={sendServiceBinary}>send random binary as service</button>
            <div style={{height: "200px", overflowY: "scroll", border: "1px solid blue"}}>
                {messages.map(({from, incoming, message}, index) => (
                    <div key={index}>
                        <span>{incoming ? '<' : '>'}</span>
                        <span>{from}</span>
                        :
                        <span>{String(message)}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default memo(RoomMessages)