import * as fs from "fs";
import { join } from "path";
import { Press_Start_2P } from "next/font/google";

const pressStart2PFontPath = join(
    process.cwd(),
    "/fonts/PressStart2P-Regular.ttf"
);
const interFontPath = join(process.cwd(), "/fonts/Inter-Regular.ttf");

export const pressStart2P = Press_Start_2P({
    weight: "400",
    style: "normal",
    subsets: ["latin"],
});

export const pressStart2PFont = {
    data: fs.readFileSync(pressStart2PFontPath),
    name: "font-pressStart2P",
    fontStyle: "normal",
    weight: 400,
};

export const interFont = {
    data: fs.readFileSync(interFontPath),
    name: "font-inter",
    fontStyle: "normal",
    weight: 700,
};
