import Draw from "./draw";
import { writeFileSync, mkdirSync } from "fs";

(async () => {
    const draw = await Draw.builder();
    draw.setScale(2);
    const buffer = await draw.drawImage();
    mkdirSync("test", { recursive: true });
    writeFileSync("test/test.png", buffer);
})();
