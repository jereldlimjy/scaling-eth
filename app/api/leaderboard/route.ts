import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import heartToFindAbi from "../../assets/heartToFindAbi.json";

const HEART_TO_FIND_CONTRACT_ADDRESS =
    "0x0d319abc6a3f6a5dEfb8a41F0359267e28DFE5f2";

export async function GET(
    req: NextRequest,
    res: NextResponse<{ message: string }>
) {
    const provider = new ethers.JsonRpcProvider(
        process.env.GNOSIS_RPC_ENDPOINT ?? ""
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
