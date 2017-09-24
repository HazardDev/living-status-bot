import * as arp from "arp-a";
import { spawn } from "child_process";

const masks = [
    "100.64.0.",
    "100.64.1.",
    "100.64.2.",
    "100.64.3.",
    "100.64.4.",
    "100.64.5.",
    "100.64.6.",
    "100.64.7.",
    "100.64.8.",
    "100.64.9.",
    "100.64.10.",
    "100.64.11.",
    "100.64.12.",
    "100.64.13.",
    "100.64.14.",
    "100.64.15.",
];

const macAddresses = {
    "80:ed:2c:65:3e:12": "Joey",
    "90:b6:86:52:03:36": "Shane",
    "ac:37:43:77:57:e2": "Alex",
    "dc:2b:2a:57:94:90": "Logan",
};

let home: string[] = ["Scanning... Try again soon."];

function doScan() {
    const arpDelete = spawn("arp", ["-ad"]);

    arpDelete.stdout.on("data", (data) => { console.log(`stdout (arpdelete): ${data.toString()}`); });
    arpDelete.stderr.on("data", (data) => { console.error(`stderr (arpdelete): ${data.toString()}`); });

    arpDelete.on("close", (code) => {
        console.debug(`Arp delete finished with status code ${code}`);
        const ping = spawn("ping", ["-c", "4", "100.64.15.255"]);

        ping.stdout.on("data", (data) => {
            console.log(`stdout (ping): ${data.toString()}`);

            // if (data.toString().indexOf("stat") !== -1) {
            //     console.debug("Ping complete!");

            // }
        });
        ping.stderr.on("data", (data) => { console.error(`stderr (ping): ${data.toString()}`); });
        ping.on("close", (code) => {

            console.debug(`Ping finished with status code ${code}`);

            home = [];

            arp.table((err, entry) => {
                if (err) { console.log("Error occurred: " + err); }
                if (!entry) { return; }

                console.debug(`Checking arp entry ${entry.mac}`);
                if (Object.keys(macAddresses).indexOf(entry.mac) !== -1) {
                    home.push(macAddresses[entry.mac]);
                }

            });

            setTimeout(doScan, 1 * 60 * 1000);

        });

    });

}

export = {

    name: "home",

    run: (user: string, userID: string, channelID: string, message: string): string => {
        home.length !== 0 ? console.debug(home) : console.debug("Home has no entries in it.");
        return home.map((element) =>  element ).join(",");
    },

    start() {
        doScan();
    },
};
