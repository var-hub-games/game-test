import React, {FC, FormEventHandler, memo, useCallback, useEffect, useState} from "react";
import {useRoom, useRoomData, useRoomEvent, useRoomStateSelector} from "@varhub-games/tools-react";
import { useRoomTimeCounter } from "@varhub-games/tools-react";

const RoomTimer: FC = () => {
    const room = useRoom();
    const roomData = useRoomData();

    const onsubmit: FormEventHandler<HTMLFormElement> = useCallback(async (event) => {
        event.preventDefault();
        const diffMs = room.roomStartDiffMs;
        if (diffMs == null) return;
        const formData = new FormData(event.currentTarget);
        const timer = Number(formData.get("timer"));
        const time = room.createTimer(timer);
        if (room.state && typeof room.state === "object") {
            await room.changeState(time, ["timer"]);
        } else {
            await room.changeState({timer: time}, null);
        }
    }, [room]);

    const deleteTimer = useCallback(async () => {
        if (room.state) {
            await room.changeState(undefined, ["timer"]);
        }
    }, [room]);

    const syncTime = useCallback(async () => {
        await room.syncTime();
    }, [room]);

    const timerValue = useRoomStateSelector((state: any) => state?.timer);
    const hasTimer = typeof timerValue === "number";

    useRoomEvent("syncTime", console.warn);

    return (
        <div>
            <div>
                <div>roomStartDiffMs = {roomData.roomStartDiffMs}</div>
                <div>roomStartDiffAccuracyMs = {roomData.roomStartDiffAccuracyMs}</div>
                <button onClick={syncTime}>Sync time</button>
            </div>
            <form onSubmit={onsubmit}>
                <input name="timer" type="number" defaultValue="1200" placeholder="timer diff" />
                <button type="submit">set timer</button>
                <button type="button" onClick={deleteTimer} disabled={!hasTimer}>delete timer</button>
                <hr/>
            </form>
            <hr/>
            {hasTimer && (
                <TimerWatcher timerValue={timerValue}/>
            )}
        </div>
    )
}
export default memo(RoomTimer);

const STEP = 1000;
const COUNT_MAX = 10;
const TimerWatcher: FC<{timerValue: number}> = memo(({timerValue}) => {
    const room = useRoom();
    const [expired, setExpired] = useState(() => {
        return room.getTimePassed(timerValue) >= STEP * COUNT_MAX;
    })

    useEffect(() => {
        setExpired(room.getTimePassed(timerValue) >= STEP * COUNT_MAX);
    }, [timerValue])

    const roomCounter = useRoomTimeCounter(timerValue, STEP, {min: 0, max: COUNT_MAX});
    const countDown = COUNT_MAX - (roomCounter??0);

    useEffect(() => {
        if (expired) return;
        console.log("COUNTER", countDown);
        beep(countDown > 0 ? 50 : 500, 2000);
    }, [countDown]);

    return (
        <div>
            <div>Watch for state.timer</div>
            <div>
                timerState: <input type="text" readOnly value={String(timerValue)} />
            </div>
            <div>expired on set: {String(expired)}</div>
            <div>
                seconds left: <input type="text" readOnly value={countDown} />
            </div>
            <div>
                Rendered at:&nbsp;
                {
                    new Date().toLocaleTimeString(undefined, {
                        hour12: false
                    })
                }
            </div>
        </div>
    )
});

const audioCtx = new AudioContext();
function beep(duration: number, frequency?: number, volume?: number, type?: OscillatorType) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (volume){gainNode.gain.value = volume;}
    if (frequency){oscillator.frequency.value = frequency;}
    if (type){oscillator.type = type;}

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + ((duration || 500) / 1000));
}

