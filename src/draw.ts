import { Canvas, loadImage, CanvasRenderingContext2D, Image } from 'skia-canvas';
import Status, { PrettifiedSystemStatus } from './status';
class Draw {
    readonly characterUrl = "https://cdn.discordapp.com/attachments/1008088968635625523/1179477265839558726/F-tAva0a8AAPUZ6.png";

    get characterWidth() { return 376; }

    _width: number;
    _height: number;
    _fontSize = 20;

    scale: number;

    get width() { return this._width; }
    get height() { return this._height; }
    get widthScaled() { return this._width * this.scale; }
    get heightScaled() { return this._height * this.scale; }
    get fontSize() { return this._fontSize; }
    get smallerFontSize() { return this._fontSize * 0.8; }

    get backgroundCircleBaseRadius() { return 128; }
    get blurFilterBaseRadius() { return 64 * this.scale; }

    characterImage!: Image;

    private constructor(scale: number = 2) {
        this._width = 500;
        this._height = 700;
        this.scale = scale;
    }

    static async builder() {
        const instance = new this();
        instance.characterImage = await loadImage(instance.characterUrl);
        return instance;
    }

    setScale(scale: number) {
        this.scale = scale;
    }

    async drawImage(status?: PrettifiedSystemStatus) {
        if (!status) status = await Status.getPrettified()
        const canvas = new Canvas(this.widthScaled, this.heightScaled)
        const ctx = canvas.getContext('2d')
        ctx.scale(this.scale, this.scale);

        this.drawBackGround(ctx);
        this.drawCloud(ctx, -20, 270);
        this.drawText(ctx, 10, 450, status);

        return canvas.toBuffer("png");
    }

    drawBackGroundCircle(ctx: CanvasRenderingContext2D, color: string) {
        ctx.fillStyle = color
        for (let i = 0; i < 7; ++i) {
            ctx.filter = `blur(${this.blurFilterBaseRadius}px)`;
            const radius = Math.random() * this.backgroundCircleBaseRadius;
            ctx.beginPath();
            ctx.ellipse(
                Math.random() * this.width,
                Math.random() * this.height,
                radius,
                radius * (1 - Math.random() * 0.4),
                Math.random() * 2 * Math.PI,
                0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.filter = "none";
    }

    drawBackGround(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, this.width, this.height)

        this.drawBackGroundCircle(ctx, "#f78383");
        this.drawBackGroundCircle(ctx, "#f7c383");

        const aspectRatio = this.characterImage.height / this.characterImage.width;
        ctx.drawImage(this.characterImage, this.width - this.characterWidth, this.height - this.characterWidth * aspectRatio, this.characterWidth, this.characterWidth * aspectRatio);
    }

    /**
     * Reference: https://www.victoriakirst.com/beziertool/
     */
    drawCloud(ctx: CanvasRenderingContext2D, xoff: number, yoff: number) {
        ctx.beginPath();
        ctx.moveTo(2 + xoff, 93 + yoff);
        ctx.bezierCurveTo(-13 + xoff, 93 + yoff, 104 + xoff, 90 + yoff, 169 + xoff, 125 + yoff);
        ctx.bezierCurveTo(204 + xoff, 144 + yoff, 228 + xoff, 162 + yoff, 277 + xoff, 166 + yoff);
        ctx.bezierCurveTo(357 + xoff, 173 + yoff, 400 + xoff, 199 + yoff, 441 + xoff, 239 + yoff);
        ctx.bezierCurveTo(518 + xoff, 314 + yoff, 543 + xoff, 263 + yoff, 583 + xoff, 316 + yoff);
        ctx.bezierCurveTo(618 + xoff, 362 + yoff, 596 + xoff, 500 + yoff, 596 + xoff, 499 + yoff);
        ctx.bezierCurveTo(596 + xoff, 498 + yoff, 13 + xoff, 491 + yoff, -1 + xoff, 497 + yoff);

        ctx.filter = `blur(${this.blurFilterBaseRadius * 0.8}px)`;
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.filter = "none";
    }

    drawText(ctx: CanvasRenderingContext2D, left: number, top: number, status: PrettifiedSystemStatus, titleGapAdjustment = 4, lineGapAdjustment = 8) {
        const smallerLineGap = (this.smallerFontSize + titleGapAdjustment);
        const lineGap = (this.fontSize + lineGapAdjustment);

        ctx.font = `600 ${this.smallerFontSize}px "Electrolux Sans"`;
        ctx.fillStyle = "#5f5f5f";

        ctx.fillText("App:", left, top);
        ctx.fillText("Host:", left, top + (smallerLineGap + lineGap));
        ctx.fillText("CPU:", left, top + (smallerLineGap * 2 + lineGap * 3));
        ctx.fillText("Memory:", left, top + (smallerLineGap * 3 + lineGap * 4));
        ctx.fillText("Sys Load:", left, top + (smallerLineGap * 4 + lineGap * 5));

        ctx.font = `600 ${this.fontSize}px "Electrolux Sans"`;
        ctx.fillStyle = "#000000";
        ctx.fillText(status.name, left, top + (smallerLineGap * 1));
        ctx.fillText(status.hostname, left, top + (smallerLineGap * 2 + lineGap));
        ctx.fillText(`(${status.runtime})`, left, top + (smallerLineGap * 2 + lineGap * 2 - lineGapAdjustment));
        ctx.fillText(status.cpu, left, top + (smallerLineGap * 3 + lineGap * 3));
        ctx.fillText(status.mem, left, top + (smallerLineGap * 4 + lineGap * 4));
        ctx.fillText(status.load, left, top + (smallerLineGap * 5 + lineGap * 5));
    }
}

export default Draw;