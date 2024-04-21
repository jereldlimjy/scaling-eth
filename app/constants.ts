import { keccak256, toUtf8Bytes } from "ethers";

export const dictionary = [
    "arb",
    "eth",
    "sign",
    "filecoin",
    "gnosis",
    "risc",
    "nillion",
    "avail",
    "neon",
    "powerloom",
    "morph",
    "witness",
    "curvegrid",
    "scaling",
];

export const colourMapping: any = {
    arb: "bg-red-200",
    eth: "bg-yellow-200",
    sign: "bg-purple-200",
    filecoin: "bg-pink-200",
    gnosis: "bg-indigo-200",
    risc: "bg-teal-200",
    nillion: "bg-orange-200",
    avail: "bg-lime-200",
    neon: "bg-amber-200",
    powerloom: "bg-cyan-200",
    morph: "bg-blue-200",
    witness: "bg-green-200",
    curvegrid: "bg-rose-200",
    scaling: "bg-violet-200",
};

export const tokenId = keccak256(toUtf8Bytes("hearttofind"));
