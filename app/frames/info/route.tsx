/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";
import { pressStart2PFont } from "../../fonts";
import { HeartSvg } from "../../components/HeartSvg";

export const POST = frames(async (ctx: any) => {
    return {
        image: (
            <div tw="flex flex-col w-full h-full bg-yellow-300 justify-center items-center">
                <span tw="flex text-4xl items-center">
                    Game Info{" "}
                    <div tw="flex -mt-10 ml-4">
                        <HeartSvg height={80} width={100} />
                    </div>
                </span>
                <span tw="text-2xl mt-16 text-center text-gray-700">
                    HeartToFind is a word search game with HeartBits
                    integration.
                </span>
                <span tw="text-2xl mt-8 text-center text-gray-700">
                    Earn HeartBits while finding the hidden words!
                </span>

                <span tw="text-2xl mt-8 text-center text-gray-700">
                    In the future, we will have more interesting mechanisms for
                    earning HeartBits, so stay tuned!
                </span>

                <span tw="text-2xl mt-16 text-center text-green-700">
                    Hint: the words are linked to the Scaling Eth hackathon
                    prize sponsors {":)"}
                </span>
            </div>
        ),
        buttons: [
            <Button action="post" target="/">
                Back to Home 🏠
            </Button>,
        ],
        imageOptions: {
            fonts: [pressStart2PFont],
        },
    };
});
