import { TransactionTargetResponse } from "frames.js";
import { getFrameMessage } from "frames.js/next/server";
import { NextRequest, NextResponse } from "next/server";
import { Abi, encodeFunctionData } from "viem";
import heartToFindAbi from "../../../assets/heartToFindAbi.json";

const HEART_TO_FIND_CONTRACT_ADDRESS =
    "0x0d319abc6a3f6a5dEfb8a41F0359267e28DFE5f2";

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
    const username = (frameMessage.requesterUserData as any).username;
    const userAddress = frameMessage.requesterVerifiedAddresses[0];

    // update score
    const calldata = encodeFunctionData({
        abi: heartToFindAbi,
        functionName: "setScore",
        args: [fid, score, username, userAddress],
    });

    return NextResponse.json({
        attribution: false,
        chainId: "eip155:100", // Gnosis Chain
        // chainId: "eip155:11155420", // Optimism Sepolia
        // chainId: "eip155:8453", // Base Mainnet
        method: "eth_sendTransaction",
        params: {
            abi: heartToFindAbi as Abi,
            to: HEART_TO_FIND_CONTRACT_ADDRESS,
            data: calldata,
            value: "0",
        },
    });
}
