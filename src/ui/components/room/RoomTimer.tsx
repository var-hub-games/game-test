import React, {FC, FormEventHandler, memo, useCallback, useEffect, useState} from "react";
import {useRoom, useRoomData, useRoomEvent, useRoomStateSelector} from "@varhub-games/tools-react";
import { useRoomInterval } from "@varhub-games/tools-react";

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
                timerValue === {String(timerValue)}
                <button onClick={syncTime}>Sync time: {roomData.roomStartDiffMs}</button>
            </div>
            <form onSubmit={onsubmit}>
                <input name="timer" type="number" defaultValue="10000" placeholder="timer, ms" />
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

const TimerWatcher: FC<{timerValue: number}> = memo(({timerValue}) => {
    const room = useRoom();

    const [timerInfo, setTimerInfo] = useState(() => ({
        left: 0,
        diff: 0,
        expired: false,
    }));

    useEffect(() => {
        const secLeft = Math.ceil(room.getTimeLeft(timerValue) / 1000);
        setTimerInfo((value) => ({
            ...value,
            left: secLeft
        }))
    }, [timerValue]);

    useRoomInterval(timerValue, 1000, (left, diff, expired) => {
        if (!expired) {
            beep(left ? 50 : 500, 2000);
        }
        setTimerInfo({left, diff, expired });
    }, {callOnExpired: true});

    return (
        <div>
            <div>Watch for state.timer</div>
            <div>
                timerState: <input type="text" readOnly value={String(timerValue)} />
            </div>
            <div>
                seconds left: <input type="text" readOnly value={timerInfo.left} />
            </div>
            <div>
                ms diff: <input type="text" readOnly value={timerInfo.diff} />
            </div>
            <div>
                expired on start: <input type="text" readOnly value={String(timerInfo.expired)} />
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

