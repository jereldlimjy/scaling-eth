"use client";

import { HeartBitProvider, SupportedChain } from "@fileverse/heartbit-react";
import HeartBitData from "./HeartBitData";

const HeartBitDataWrapper = () => {
    const coreOptions = {
        chain: "0xaa36a7" as SupportedChain,
    };

    return (
        <HeartBitProvider coreOptions={coreOptions}>
            <HeartBitData />
        </HeartBitProvider>
    );
};

export default HeartBitDataWrapper;
