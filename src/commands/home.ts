import * as arpscan from "arpscan/promise";
import { spawn } from "child_process";
const macAddresses = require('../config.json').macAddresses;

let home = {};

function doScan() {

    arpscan({sudo: true})
        .then((results) => {
            console.log("Finished arpscan.");
            results.map((entry) => {
                console.log(`Processing entry: ${entry.mac}`);
                if (Object.keys(macAddresses).indexOf(entry.mac.toLowerCase())) {
                    console.log(`Adding entry: ${entry.mac}`);
                    home[macAddresses[entry.mac.toLowerCase()]] = new Date().getTime();
                }
            });
        })
        .catch((error) => {
            console.log(`Arpscan error: ${error}`);
            throw error;
        });

    setTimeout(doScan, 1 * 10 * 1000);

}

export = {

    name: "home",

    run: (user: string, userID: string, channelID: string, message: string): string => {
        const now: number = new Date().getTime();
        const atHome: string[] = [];
        // tslint:disable-next-line:forin
        for (const person in home) {
            console.log(`Person entry - ${person} - ${home[person]}`);
            if ((now - home[person]) < (1000 * 60 * 2)) {
                console.log(`${person} is home!`);
                atHome.push(person);
            }
        }

        return atHome.join(", ");
    },

    start() {
        console.log(`Mac addressed loaded! ${macAddresses}`);
        doScan();
    },
};
