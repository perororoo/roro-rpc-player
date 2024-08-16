import WebSocket from "ws";
import ENV from "./config.json" with {type: "json"};

const RPC_WebsocketURL = "ws://127.0.0.1:PORT";
const RPCSetup = {
    "version": ENV.RPC_VERSION, 
    "clientId": ENV.CLIENT_ID,

};
let url = RPC_WebsocketURL,
    sessionId = "";
let ws;
let interval = 0,
    seq = -1;

let payload = {
    op: 2,
    d: {
        token: ENV.GATEWAY_TOKEN,
        intents: 33280,
        properties: {
            $os: "windows",
            $browser: "chrome",
            $device: "chrome"
        }
    }
};

const heartbeat = (ms) => {
    return setInterval(() => {
        ws.send(JSON.stringify({ op: 1, d: null}));
    }, ms);
};

const initializeWebsocket = () => {
    if (ws && ws.readyState !== 3) {
        ws.close();
    };

    let wasReady = false;

    ws = new WebSocket(url + `/?v=${RPCSetup.version}&client_id=${RPCSetup.clientId}&encoding=json`);

    ws.on("open", function open() {
        if (url !== RPC_WebsocketURL) {
            const resumePayload = {
                op: 6,
                d: {
                    token: ENV.GATEWAY_TOKEN,
                    sessionId,
                    seq,
                },
            };

            ws.send(JSON.stringify(resumePayload))
        };
    });



    ws.on("error", function error(e) {
        console.log(e);
    });

    ws.on("close", function close() {
        if (wasReady) console.log("The connection got interrupted!! D: ...Trying to reconnnect...")

        setTimeout(() => {
            initializeWebsocket();
        }, 2500)
    });

    ws.on("message", function incoming(data) {
        let p = JSON.parse(data);
        const { t, op, d, s } = p;

        switch (op) {
            case 10:
                const { heartbeat_interval } = d;
                interval = heartbeat(heartbeat_interval);
                wasReady = true;

                if (url === RPC_WebsocketURL) ws.send(JSON.stringify(payload))
            break;

            case 0:
                seq = s;
            break; 
        };

        switch (t) {
            case "READY" :
                console.log("The gateway connection is ready!!")
                url = d.resume_gateway_url;
                sessionId = d.session_id;
            break;

            case "RESUMED":
                console.log("The gateway connection is resumed!! :D")
            break;
        };

    });

    
    setInterval(() => {
        console.log("Websocket.Presence sent");
        ws.send(JSON.stringify({       
            "op": 3,
            "d": {
                token: ENV.GATEWAY_TOKEN,
                since: 91879201,
                activities: [{
                name: "aaaaaaaaaaaaa",
                type: 2
                }],
                status: "online",
                afk: false
            }
        }));
    }, 2500);

};


initializeWebsocket();