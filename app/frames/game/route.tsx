/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";
import { pressStart2PFont } from "../../fonts";
import { HeartSvg } from "../../components/HeartSvg";

const getPuzzle = async () => {
    try {
        const response = await fetch(
            process.env.NODE_ENV === "production"
                ? "https://heart-to-find.vercel.app/api/puzzle"
                : process.env.NODE_ENV === "development"
                ? "https://heart-to-find-dev.vercel.app/api/puzzle"
                : "http://localhost:3000/api/puzzle",
            { cache: "no-cache" }
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

export const POST = frames(async (ctx: any) => {
    const ws = await getPuzzle();
    const { username } = ctx.message.requesterUserData;
    const profileImage = ctx.message.requesterUserData?.profileImage ?? "";

    // convert words array into map
    const wordsMap: any = {};

    for (const wordObj of ws.data.words) {
        wordsMap[wordObj.word] = {
            word: wordObj.word,
            path: wordObj.path,
            found: false,
        };
    }

    ws.data.words = wordsMap;

    const startTime = Date.now();

    return {
        image: (
            <div tw="flex h-full w-full bg-yellow-300 justify-center items-center relative">
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
                            <span tw="mt-2 text-base">-</span>
                        </div>

                        <div tw="flex flex-col items-center mt-5">
                            <span tw="mt-1 text-base">HeartBits minted:</span>
                            <div tw="flex mt-4 items-center">
                                <span tw="text-base">0</span>
                                <div tw="flex -mt-4 ml-2">
                                    <HeartSvg height={30} width={40} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div tw="flex w-2/3">
                    <div tw="flex bg-white rounded-lg p-8">
                        <div tw="flex flex-wrap" style={{ width: "520px" }}>
                            {ws.data.grid
                                .flat()
                                .map((cell: string, index: number) => (
                                    <div
                                        key={index}
                                        tw="flex justify-center items-center text-3xl pt-4"
                                        style={{
                                            width: "52px",
                                            height: "52px",
                                        }}
                                    >
                                        {cell}
                                    </div>
                                ))}
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
            startTime,
            ...ws.data,
        },
        textInput: " Enter word:",
        imageOptions: {
            fonts: [pressStart2PFont],
        },
    };
});
