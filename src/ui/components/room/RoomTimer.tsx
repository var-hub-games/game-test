import React, {FC, FormEventHandler, memo, useCallback, useEffect, useState} from "react";
import {useRoom, useRoomStateSelector} from "@varhub-games/tools-react";
import { useRoomInterval } from "@varhub-games/tools-react";

const RoomTimer: FC = () => {
    const room = useRoom();

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

    const timerValue = useRoomStateSelector((state: any) => state?.timer);
    const hasTimer = typeof timerValue === "number";

    return (
        <div>
            <div>timerValue === {String(timerValue)} ({typeof timerValue})</div>
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
})

