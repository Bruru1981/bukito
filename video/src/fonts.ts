import { staticFile } from "remotion";

const kisrre = new FontFace("Kisrre", `url(${staticFile("/fonts/Kisrre.otf")})`);
kisrre.load().then(() => document.fonts.add(kisrre));
