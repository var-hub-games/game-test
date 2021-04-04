import {useEffect, useState} from "react"


export default function useFuckingLocalCounter(time: number): number {
    const [value, setValue] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => setValue(v => v+1), time);
        return () => clearInterval(interval);
    }, [time]);

    return value;
}