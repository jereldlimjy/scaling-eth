import { TransactionTargetResponse } from "frames.js";
import { getFrameMessage } from "frames.js/next/server";
import { NextRequest, NextResponse } from "next/server";
import { Abi, encodeFunctionData } from "viem";
import lionCitySearchAbi from "../../../assets/lionCitySearchAbi.json";

const LION_CITY_SEARCH_CONTRACT_ADDRESS =
    "0x6144E026C9FD451876676a5925EeD220dbC240e0";

export async function POST(
    req: NextRequest
): Promise<NextResponse<TransactionTargetResponse>> {
    const json = await req.json();

    const frameMessage = await getFrameMessage(json);

    if (!frameMessage) {
        throw new Error("No frame message");
    }

    const stateObj = JSON.parse(frameMessage.state || "");
    const score = stateObj.score;
    const fid = frameMessage.requesterFid;

    // update score
    const calldata = encodeFunctionData({
        abi: lionCitySearchAbi,
        functionName: "setScore",
        args: [fid, score],
    });

    return NextResponse.json({
        attribution: false,
        chainId: "eip155:11155420", // Optimism Sepolia
        // chainId: "eip155:8453", // Base Mainnet
        method: "eth_sendTransaction",
        params: {
            abi: lionCitySearchAbi as Abi,
            to: LION_CITY_SEARCH_CONTRACT_ADDRESS,
            data: calldata,
            value: "0",
        },
    });
}
