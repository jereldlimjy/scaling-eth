import { NextRequest, NextResponse } from "next/server";
import { dictionary } from "../../constants";
import { unstable_noStore as noStore } from "next/cache";

const wordSearch = require("@blex41/word-search");

export async function GET(
    req: NextRequest,
    res: NextResponse<{ message: string }>
) {
    noStore();
    const options = {
        cols: 10,
        rows: 10,
        disabledDirections: ["NW", "SW"],
        dictionary,
        maxWords: 10,
        backwardsProbability: 0.3,
        upperCase: false,
        diacritics: true,
    };

    const ws = new wordSearch(options);

    return NextResponse.json(ws);
}
