import {useEffect, useState} from "react";

function parsePathParam({pathname}: Location, reg: RegExp): {[key: string]: string} {
    if (!pathname) return {};
    const match = pathname.match(reg);
    const results = match?.groups ?? {};
    const entries = Object.entries(results).map(([key, value]) => [key, encodeURIComponent(value)]);
    return Object.fromEntries(entries);
}

export function usePathParam(reg: RegExp): {[key: string]: string}{
    const [value, setValue] = useState(() => parsePathParam(location, reg))
    useEffect(() => {
        const listener = () => {
            setValue(parsePathParam(location, reg));
        }
        window.addEventListener('popstate', listener);
        return () => window.removeEventListener('popstate', listener);
    }, [String(reg)]);
    return value;
}