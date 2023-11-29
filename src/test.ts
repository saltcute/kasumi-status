import Draw from "./draw";
import { writeFileSync } from 'fs';

(async () => {
    const draw = new Draw();
    const buffer = await draw.drawImage();
    writeFileSync("test.png", buffer);
})()