import { ICommand } from "./command.interface";

export class Command implements ICommand {

    public name: string = "hello";

    public run(from, to, text, message): string {
        return "Hello, World!";
    }

}
