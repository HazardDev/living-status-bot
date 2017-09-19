const config = require("./config.json");
import { StatBot } from "./stat-bot";

const statBot = new StatBot({
    autorun: config.autorun,
    token: config.token,
});
