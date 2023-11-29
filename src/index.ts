import { BaseCommand, BaseSession, CommandFunction, MessageType } from "kasumi.js";
import Draw from "./draw";

class StatusCommand extends BaseCommand {
    name = "status";
    constructor(name: string) {
        super();
        this.name = name;
    }

    func: CommandFunction<BaseSession, any> = async (session) => {
        const { data, err } = await session.client.API.asset.create(await new Draw().drawImage());
        if (err) return session.send("Failed to upload image.");
        const url = data.url;
        return await session.client.API.message.create(MessageType.ImageMessage, session.channelId, url);
    }
}

export default StatusCommand;