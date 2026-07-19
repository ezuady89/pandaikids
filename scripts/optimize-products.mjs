import sharp from "sharp";
import fs from "fs";
import path from "path";

const folder = "public/pandaikids/nota-kilat-v3/products";

const files = [
  "tahun-3.png",
  "tahun-4.png",
  "tahun-5.png",
  "bundle.png",
];

(async () => {
  for (const file of files) {
    const input = path.join(folder, file);
    const output = input.replace(".png", ".webp");

    const before = fs.statSync(input).size;

    await sharp(input)
      .resize(1200)
      .webp({
        quality: 82,
        effort: 6,
      })
      .toFile(output);

    const after = fs.statSync(output).size;

    console.log("");
    console.log(file);
    console.log(
      `${(before / 1024).toFixed(0)} KB  -->  ${(after / 1024).toFixed(0)} KB`
    );
  }
})();