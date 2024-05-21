import { TransactionTargetResponse } from "frames.js";
import { getFrameMessage } from "frames.js/next/server";
import { NextRequest, NextResponse } from "next/server";
import { Abi, encodeFunctionData } from "viem";
import heartToFindAbi from "../../../assets/heartToFindAbi.json";

const HEART_TO_FIND_CONTRACT_ADDRESS =
    "0xF6Fe53F8D23F4F5D50dF8777b616009be1AAbd84"; // Arb Mainnet
// "0x3fE5F489a87A4523956D1770a1571FaFB9915412"; // Base Mainnet
// "0x1D774b8560Fb4A7b9130B99c503D79D72ccb2953"; // Arb Sepolia
// "0xdCB73D72E0513C713A2812C75EdE60CFe307E73b"; // Sepolia
// "0x0d319abc6a3f6a5dEfb8a41F0359267e28DFE5f2"; // Gnosis Chain

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
    const userAddress = frameMessage.connectedAddress;

    // update score
    const calldata = encodeFunctionData({
        abi: heartToFindAbi,
        functionName: "setScore",
        args: [fid, score, username, userAddress],
    });

    // chainId: "eip155:11155111", // Sepolia
    // chainId: "eip155:100", // Gnosis Chain
    // chainId: "eip155:11155420", // Optimism Sepolia
    // chainId: "eip155:8453", // Base Mainnet

    return NextResponse.json({
        attribution: false,
        chainId: "eip155:42161", // Arb Mainnet
        // chainId: "eip155:8453", // Base Mainnet
        // chainId: "eip155:84532", // Base Sepolia
        // chainId: "eip155:421614", // Arb Sepolia
        method: "eth_sendTransaction",
        params: {
            abi: heartToFindAbi as Abi,
            to: HEART_TO_FIND_CONTRACT_ADDRESS,
            data: calldata,
            value: "0",
        },
    });
}
