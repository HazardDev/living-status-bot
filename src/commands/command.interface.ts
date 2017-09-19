export interface ICommand {
    name: string;
    run(from, to, text, message): string;
}
