import {
    BaseCommand,
    BaseSession,
    CommandFunction,
    MessageType,
} from "kasumi.js";
import Draw from "./draw";

class StatusCommand extends BaseCommand {
    description = "展示服务器概况";

    draw: Draw | Promise<Draw> = Draw.builder();
    constructor(
        name: string = "status",
        private appName: string = "Kasumi.js"
    ) {
        super();
        this.name = name;
    }

    func: CommandFunction<BaseSession, any> = async (session) => {
        if (this.draw instanceof Promise) this.draw = await this.draw;
        const { data, err } = await session.client.API.asset.create(
            await this.draw.drawImage(undefined, this.appName)
        );
        if (err) return session.send("Failed to upload image.");
        const url = data.url;
        return await session.client.API.message.create(
            MessageType.ImageMessage,
            session.channelId,
            url
        );
    };
}

export default StatusCommand;
