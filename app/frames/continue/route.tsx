/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";
import { colourMapping, tokenId } from "../../constants";
import { pressStart2PFont } from "../../fonts";
import { convertToSecondsOrMinutes } from "../../utils";
import { HeartSvg } from "../../components/HeartSvg";
import { HeartBitCore } from "@fileverse/heartbit-core";

const { API_KEY } = process.env;

export const POST = frames(async (ctx: any) => {
    const { inputText, state } = ctx.message;
    const { username } = ctx.message.requesterUserData;
    const profileImage = ctx.message.requesterUserData?.profileImage ?? "";
    const walletAddress = ctx.message.requesterVerifiedAddresses[0];

    const currentTime = Date.now();

    const ws = JSON.parse(state);
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
    const timeSpent = convertToSecondsOrMinutes(elapsedTime);

    const getCellColor = (x: number, y: number) => {
        for (const key of Object.keys(ws.words)) {
            if (ws.words[key].found) {
                for (let p of ws.words[key].path) {
                    if (p.x === x && p.y === y) {
                        return colourMapping[key];
                    }
                }
            }
        }
        return "bg-white";
    };

    // If input text in word list, mark as found
    if (inputText in ws.words) {
        ws.words[inputText].found = true;
    }

    return {
        image: (
            <div tw="flex w-full h-full bg-yellow-300 justify-center items-center relative">
                <div tw="flex flex-col w-1/3 h-full justify-center items-center">
                    <div tw="flex flex-col items-center -mt-12">
                        <img
                            src={profileImage}
                            height="80px"
                            width="80px"
                            tw="rounded-full"
                        />
                        <span tw="mt-1 text-base">{username}</span>

                        <div tw="flex flex-col items-center mt-5">
                            <span tw="mt-1 text-base">You have spent:</span>
                            <span tw="mt-2 text-base">{timeSpent}</span>
                        </div>

                        <div tw="flex flex-col items-center mt-5">
                            <span tw="mt-1 text-base">HeartBits minted:</span>
                            <div tw="flex mt-4 items-center">
                                <span tw="text-base">{elapsedTime * 10}</span>
                                <div tw="flex -mt-4">
                                    <HeartSvg height={40} width={50} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div tw="flex w-2/3">
                    <div tw="flex bg-white rounded-lg p-8">
                        <div tw="flex flex-wrap" style={{ width: "520px" }}>
                            {ws.grid.map((row: string[], y: number) =>
                                row.map((cell, x) => (
                                    <div
                                        key={`${x}-${y}`}
                                        tw={`flex justify-center items-center text-3xl pt-4 ${getCellColor(
                                            x,
                                            y
                                        )}`}
                                        style={{
                                            width: "52px",
                                            height: "52px",
                                        }}
                                    >
                                        {cell}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        ),
        buttons: [
            <Button action="post" target="/continue">
                Submit Word 🆕
            </Button>,
            <Button action="post" target="/end">
                End Game 🏁
            </Button>,
        ],
        state: {
            latestTime: currentTime,
            ...ws,
        },
        textInput: " Enter word:",
        imageOptions: {
            fonts: [pressStart2PFont],
        },
    };
});
