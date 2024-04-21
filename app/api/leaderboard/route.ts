import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import heartToFindAbi from "../../assets/heartToFindAbi.json";

const HEART_TO_FIND_CONTRACT_ADDRESS =
    "0xdCB73D72E0513C713A2812C75EdE60CFe307E73b";
// "0x0d319abc6a3f6a5dEfb8a41F0359267e28DFE5f2"; // Gnosis Chain

export async function GET(
    req: NextRequest,
    res: NextResponse<{ message: string }>
) {
    const provider = new ethers.JsonRpcProvider(
        process.env.SEPOLIA_RPC_ENDPOINT ?? ""
    );

    const heartToFindContract = new ethers.Contract(
        HEART_TO_FIND_CONTRACT_ADDRESS,
        heartToFindAbi,
        provider
    ) as any;

    const fids = await heartToFindContract.getFids();

    let scores = [];

    for (const fid of fids) {
        const user = await heartToFindContract.getUser(fid);
        scores.push({
            fid: Number(fid),
            score: Number(user.score),
            username: user.username,
            userAddress: user.userAddress,
        });
    }

    return NextResponse.json(scores.sort((a, b) => b.score - a.score));
}
