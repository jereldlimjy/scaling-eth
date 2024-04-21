import { NextServerPageProps } from "frames.js/next/server";
import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
import { vercelURL } from "./utils";
import { HeartSvg } from "./components/HeartSvgWeb";
import HeartBitDataWrapper from "./components/HeartBitDataWrapper";
import { pressStart2P } from "./fonts";
import { unstable_noStore as noStore } from "next/cache";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "HeartToFind",
        description: "A word search game where players get to earn HeartBits.",
        other: {
            ...(await fetchMetadata(
                new URL("/frames", vercelURL() || "http://localhost:3000")
            )),
        },
    };
}

const getLeaderboard = async () => {
    try {
        const response = await fetch(
            process.env.NODE_ENV === "production"
                ? "https://heart-to-find.vercel.app/api/leaderboard"
                : "http://localhost:3000/api/leaderboard",
            {
                cache: "no-store",
                headers: {
                    "Cache-Control": "no-cache",
                },
            }
        );
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err);
        return [];
    }
};

// This is a react server component only
export default async function Home({ searchParams }: NextServerPageProps) {
    noStore();
    const leaderboard = await getLeaderboard();

    return (
        <div className="flex flex-col h-full w-full items-center bg-yellow-300">
            {/* Title */}
            <div>
                <div className="relative z-0">
                    <HeartSvg height={150} width={120} />
                </div>
                <div className="relative flex bg-black justify-center items-center py-1 px-2 z-1 -mt-10">
                    <span
                        className={`${pressStart2P.className} text-white text-xl`}
                    >
                        HeartToFind
                    </span>
                </div>
            </div>

            {/* Leaderboard */}
            <div className="container mt-24 flex flex-col items-center justify-center">
                <span className={`${pressStart2P.className} text-xl`}>
                    Leaderboard
                </span>

                <div className="mt-5 bg-white text-black text-lg shadow-lg rounded-lg overflow-hidden">
                    <div
                        className={`bg-gray-200 px-8 py-2 grid grid-cols-4 text-center ${pressStart2P.className}`}
                    >
                        <span>Rank</span>
                        <span>FID</span>
                        <span>Username</span>
                        <span>Score</span>
                    </div>
                    {leaderboard.map((obj: any, index: number) => (
                        <div
                            key={index}
                            className={`px-8 py-2 grid grid-cols-4 text-center ${
                                pressStart2P.className
                            } ${index % 2 === 0 ? "bg-gray-100" : ""}`}
                        >
                            <span>{index + 1}</span>
                            <span>{obj.fid}</span>
                            <span>{obj.username}</span>
                            <span>{obj.score}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* HeartBit data */}
            <HeartBitDataWrapper />
        </div>
    );
}
