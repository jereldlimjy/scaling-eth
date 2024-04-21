/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";
import { pressStart2PFont } from "../../fonts";
import { HeartSvg } from "../../components/HeartSvg";
import { HeartBitCore } from "@fileverse/heartbit-core";
import { tokenId } from "../../constants";

const { API_KEY } = process.env;

export const POST = frames(async (ctx: any) => {
    const { state } = ctx.message;
    const { username } = ctx.message.requesterUserData;
    const profileImage = ctx.message.requesterUserData?.profileImage ?? "";
    const walletAddress = ctx.message.requesterVerifiedAddresses[0];

    if (ctx.message?.transactionId) {
        return {
            image: (
                <div tw="flex flex-col w-full h-full bg-yellow-300 justify-center items-center">
                    <span tw="text-green-800 text-4xl text-center">
                        Successfully submitted your score!
                    </span>
                    <span tw="text-3xl mt-16 text-center">
                        Hope you enjoyed our game! {":)"}
                    </span>
                    <HeartSvg />
                </div>
            ),
            buttons: [
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
                <Button action="post" target="/game">
                    Play Again! 🎮
                </Button>,
                <Button action="link" target="https://fileverse.io/heartbit">
                    Learn More
                </Button>,
            ],
            imageOptions: {
                fonts: [pressStart2PFont],
            },
        };
    } else {
        const ws = JSON.parse(state);

        const currentTime = Date.now();
        const coreSDK = new HeartBitCore({
            chain: "0x64",
        });

        // Calculate from latest time
        if (ws.latestTime) {
            try {
                const response = await coreSDK.unSignedMintHeartBit({
                    account: walletAddress,
                    startTime: Math.floor(parseInt(ws.latestTime) / 1000),
                    endTime: Math.floor(currentTime / 1000),
                    hash: tokenId,
                    apiKey: API_KEY as string,
                });

                console.log(response);
            } catch (err) {
                console.error(err);
            }
        } else {
            // Calculate from start time
            try {
                const response = await coreSDK.unSignedMintHeartBit({
                    account: walletAddress,
                    startTime: Math.floor(parseInt(ws.startTime) / 1000),
                    endTime: Math.floor(currentTime / 1000),
                    hash: tokenId,
                    apiKey: API_KEY as string,
                });

                console.log(response);
            } catch (err) {
                console.error(err);
            }
        }

        const elapsedTime = Math.floor(
            (currentTime - parseInt(ws.startTime)) / 1000
        );

        const foundWords: any[] = Object.values(ws.words).filter(
            (word: any) => word.found === true
        );

        return {
            image: (
                <div tw="flex flex-col w-full h-full bg-yellow-300 items-center">
                    <div tw="flex absolute left-4">
                        <div tw="flex flex-col items-center mt-4">
                            <img
                                src={profileImage}
                                height="100px"
                                width="100px"
                                tw="rounded-full"
                            />
                            <span tw="mt-1 text-xl">{username}</span>
                        </div>
                    </div>

                    <span tw="mt-14 text-5xl text-gray-600">
                        Score: {foundWords.length}
                    </span>

                    <span tw="mt-12 text-2xl mb-6">Words found:</span>

                    <div
                        tw={`flex flex-wrap w-2/3 ${
                            foundWords.length <= 2 && "justify-center"
                        }`}
                    >
                        {foundWords.map((wordObj, index) => {
                            return (
                                <div
                                    key={index}
                                    tw="flex text-lg mt-2 p-2 w-1/3 justify-center"
                                >
                                    {index + 1}. {wordObj.word}
                                </div>
                            );
                        })}
                        {foundWords.length === 0 && (
                            <div tw="flex text-lg mt-2">-</div>
                        )}
                    </div>

                    <span tw="mt-12 text-2xl">
                        {elapsedTime * 10} HeartBits minted{" "}
                        <div tw="flex -mt-4">
                            <HeartSvg height={40} width={50} />
                        </div>
                    </span>
                </div>
            ),
            buttons: [
                <Button action="tx" target="/txdata/publish" post_url={"/end"}>
                    Publish to Leaderboard
                </Button>,
                <Button action="post" target="/game">
                    Try Again 🎮
                </Button>,
            ],
            state: {
                score: foundWords.length,
            },
            imageOptions: {
                fonts: [pressStart2PFont],
            },
        };
    }
});
