import { Client } from "discord.io";
import * as fs from "fs";
const config = require("./config.json");

interface IStatBotParams {
    autorun: boolean;
    token: string;
}

interface ICommand {
    name: string;
    run(user: string, userID: string, channelID: string, message: string): string;
    start(): undefined;
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

        fs.readdirSync("./commands").map((fileName: string) => {

            if (fileName.indexOf("interface") === -1 && fileName.indexOf("map") === -1) {
                this.commands.push(require("./commands/" + fileName));
            }

        });

        this.commands.map((command) => {
            command.start();
        }); // Runs the command init step, if needed

        const thing = this;

        this.client.on("message", (user: string, userID: string, channelID: string, message: string) => {

            if (user === "359469821575954462") { return; }

            // console.log("Message received!");
            // console.log(`User: ${user}\nUser ID: ${userID}\nChannel ID: ${channelID}\nMessage: ${message}\n\n`);
            // thing.client.sendMessage({ to: channelID,  message });

            thing.commands.map((command) => {
                if (message.startsWith(thing.triggerChar) &&
                    message.substring(thing.triggerChar.length).startsWith(command.name)) {
                    try {
                        const response = command.run(user, userID, channelID, message);
                        thing.client.sendMessage({ to: channelID, message: response });
                     } catch (e) {
                        thing.client.sendMessage({ to: config.tracebackChannel, message: e });
                    }
                }
            });
        });

    }
}
