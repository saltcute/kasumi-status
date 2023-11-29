import { BaseCommand, BaseSession, CommandFunction, MessageType } from "kasumi.js";
import Draw from "./draw";

class StatusCommand extends BaseCommand {
    name = "status";

    draw: Draw | Promise<Draw> = Draw.builder();
    constructor(name: string) {
        super();
        this.name = name;
    }

    func: CommandFunction<BaseSession, any> = async (session) => {
        if (this.draw instanceof Promise) this.draw = await this.draw;
        const { data, err } = await session.client.API.asset.create(await this.draw.drawImage());
        if (err) return session.send("Failed to upload image.");
        const url = data.url;
        return await session.client.API.message.create(MessageType.ImageMessage, session.channelId, url);
    }
}

export default StatusCommand;