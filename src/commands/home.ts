import * as arpscan from "arpscan/promise";
import { spawn } from "child_process";
const macAddresses = require('../config.json').macAddresses;

let home = {};

function doScan() {

    arpscan({sudo: true})
        .then((results) => {
            results.map((entry) => {
                if (Object.keys(macAddresses).indexOf(entry.mac)) {
                    home[macAddresses[entry.mac]] = new Date().getTime();
                }
            });
        })
        .catch((error) => {
            throw error;
        });

    setTimeout(doScan, 1 * 10 * 1000);

}

export = {

    name: "home",

    run: (user: string, userID: string, channelID: string, message: string): string => {
        const now: number = new Date().getTime();
        const atHome: string[] = [];
        for (const person in home) {
            if (now - home[person] < 1000 * 60 * 2) {
                atHome.push(person);
            }
        }

        return atHome.join(", ");
    },

    start() {
        doScan();
    },
};
