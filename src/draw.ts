import can from 'canvas';
import Status, { PrettifiedSystemStatus } from './status';
class Draw {
    _width: number;
    _height: number;
    _fontSize = 14;

    scale: number;

    get width() { return this._width * this.scale; }
    get height() { return this._height * this.scale; }
    get fontSize() { return this._fontSize * this.scale; }

    constructor(scale: number = 2) {
        this._width = 500;
        this._height = 700;
        this.scale = scale;
    }

    async drawImage(status?: PrettifiedSystemStatus) {
        if (!status) status = await Status.getPrettified()

        const canvas = can.createCanvas(this.width, this.height)
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, this.width, this.height)

        ctx.textBaseline = "top";
        ctx.font = `semibold ${this.fontSize}px "Electrolux Sans"`;
        ctx.fillStyle = "#000000";
        ctx.fillText(status.description, 10 * this.scale, 20 * this.scale);
        ctx.fillText(status.cpu, 10 * this.scale, 40 * this.scale);
        ctx.fillText(status.mem, 10 * this.scale, 60 * this.scale);
        ctx.fillText(status.load, 10 * this.scale, 80 * this.scale);

        return canvas.toBuffer("image/png");
    }
}

export default Draw;