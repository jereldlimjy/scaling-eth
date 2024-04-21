import { headers } from "next/headers";

export function currentURL(pathname: string): URL {
    const headersList = headers();
    const host = headersList.get("x-forwarded-host") || headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "http";

    try {
        return new URL(pathname, `${protocol}://${host}`);
    } catch (error) {
        return new URL("http://localhost:3000");
    }
}

export function vercelURL() {
    return process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : undefined;
}

export const convertToSecondsOrMinutes = (time: number) => {
    if (time < 60) return `${time} seconds`;
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return minutes === 1
        ? `${minutes} min ${seconds} s`
        : `${minutes} mins ${seconds} s`;
};
