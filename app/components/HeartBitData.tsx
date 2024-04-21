"use client";

import { useHeartBit } from "@fileverse/heartbit-react";
import { tokenId } from "../constants";
import { useEffect, useState } from "react";
import { Press_Start_2P } from "next/font/google";

const pressStart2P = Press_Start_2P({
    weight: "400",
    style: "normal",
    subsets: ["latin"],
});

const HeartBitData = () => {
    const { getTotalHeartBitByHash } = useHeartBit();
    const [totalMintsByHash, setTotalMintsByHash] = useState<number>(0);

    useEffect(() => {
        const fetchBalances = async () => {
            const totalMintsByHash = await getTotalHeartBitByHash({
                hash: tokenId,
            }); // Total Supply for a hash

            setTotalMintsByHash(totalMintsByHash);
        };

        fetchBalances();
    }, []);

    return (
        <div className="mt-12">
            <span className={`${pressStart2P.className}`}>
                Total HeartBits minted: {totalMintsByHash}
            </span>
        </div>
    );
};

export default HeartBitData;
