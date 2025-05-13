// lib/pdf-server-font.ts
import { readFileSync } from "fs";
import path from "path";
import { Font } from "@react-pdf/renderer";

export const registerPDFonts = () => {
  Font.register({
    family: "DejaVu",
    src: readFileSync(path.join(process.cwd(), "public", "fonts", "DejaVuSans.ttf")),
  });
};
