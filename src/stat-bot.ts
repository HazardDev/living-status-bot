import { Client, User } from "discord.io";
import * as fs from "fs";
import { ICommand } from "./commands/command.interface";

interface IStatBotParams {
    autorun: boolean;
    token: string;
}

export class StatBot {

    private client: Client;
    private commands: ICommand[] = [];
    private triggerChar: string = "!";

    constructor(params: IStatBotParams) {
        this.client = new Client({ autorun: params.autorun, token: params.token });

        this.client.on("ready", () => {
            console.log("Bot ready!");
        });

        fs.readdirSync("./commands").map(async (fileName: string) => {

            if (fileName.indexOf("interface") !== -1) {
                this.commands.push(await import("./command" + fileName));
            }

        });

        this.client.on("message", (user: User, userID: string, channelID: string, message: string) => {
            console.log("Message received!");

            this.commands.map((command: ICommand) => {
                if (message.startsWith(this.triggerChar) &&
                    message.substring(this.triggerChar.length).startsWith(command.name)) {

                    const response = command.run(user, userID, channelID, message);
                    this.client.sendMessage({ to: channelID, message: response });
                }
            });
        });

    }
}
