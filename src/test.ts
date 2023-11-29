import Draw from "./draw";
import { writeFileSync, mkdirSync } from 'fs';

(async () => {
    const draw = new Draw();
    const buffer = await draw.drawImage();
    mkdirSync("test", { recursive: true });
    writeFileSync("test/test.png", buffer);
})()