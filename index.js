import { Client } from "@xhayper/discord-rpc";

const client = new Client({
    clientId: "1273609314312917063"
});

client.on("ready", () => {
    client.user?.setActivity({
        state: "Hello, world!",
        type: 2
    });
});

client.login();