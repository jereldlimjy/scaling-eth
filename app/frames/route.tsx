/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { pressStart2PFont } from "../fonts";
import { HeartSvg } from "../components/HeartSvg";
import { PuzzleBackground } from "../components/PuzzleBackground";

const handleRequest = frames(async (ctx: any) => {
    return {
        image: (
            <div tw="w-full h-full flex justify-center items-center bg-yellow-300 relative">
                <div tw="flex absolute w-full h-full">
                    <PuzzleBackground />
                </div>
                <div tw="flex absolute top-30 left-85">
                    <HeartSvg />
                </div>
                <div tw="flex bg-black justify-center items-center pb-2 pt-8 px-3">
                    <span tw="font-pressStart2P text-white text-5xl">
                        HeartToFind
                    </span>
                </div>
                <div tw="flex absolute top-130">
                    <span tw="font-pressStart2P text-xl">
                        created by @jereld for Scaling Ethereum 2024
                    </span>
                </div>
            </div>
        ),
        buttons: [
            <Button action="post" target="/game">
                Start Game 🎮
            </Button>,
            <Button action="post" target="/info">
                Game Info ❓
            </Button>,
            <Button
                action="link"
                target={
                    process.env.NODE_ENV === "production"
                        ? "https://heart-to-find.vercel.app"
                        : "http://localhost:3000"
                }
            >
                View Leaderboard
            </Button>,
        ],
        imageOptions: {
            fonts: [pressStart2PFont],
        },
    };
});

export const GET = handleRequest;
export const POST = handleRequest;
