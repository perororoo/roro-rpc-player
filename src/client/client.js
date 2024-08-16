import { Client } from "@xhayper/discord-rpc";
import config from '../../config/config.js';
import {default as diff} from '../vlc/diff.js';
import {default as RPCPayloadFormatter} from './RPCPayloadFormatter.js';
import log from '../helpers/lager.js';

export default () => {
    const client = new Client({
        clientId: `${config.rpc.id}`
    });
    
    let awake = true;
    let timeInactive = 0;

    function update() {
      diff((status, difference) => {
        if (difference) {
            client.user?.setActivity(RPCPayloadFormatter(status));
          log("Presence updated");
    
          if (!awake) {
            awake = true;
            timeInactive = 0;
          }
        } else if (awake) {
          if (status.state !== 'playing') {
            timeInactive += config.rpc.updateInterval;
            if ((timeInactive >= config.rpc.sleepTime) || (!config.rpc.showStopped && status.state === 'stopped')) {
              log('VLC not playing; going to sleep.', true);
              awake = false;
              client.user?.clearActivity();
            } else {
          console.log("Presence updated")
          client.user?.setActivity(RPCPayloadFormatter(status));
          awake = false;
        }
          }
        }
      });
    };
    
    client.on("ready", () => {
        console.log("RPC Connecion Successful!! :D");
        console.log('Logged in as', client.user?.username);
        setInterval(update, config.rpc.updateInterval);
    });

    client.login()
    .catch(err => {
        if (err.message == "Error: Could not connect") {
            console.log("Failed to connect to Discord. Is your Discord client open? Retrying in 20 seconds...");
            // Retry login
            setTimeout(client.login(), 20000)
          } else {
            console.log("An unknown error occurred when connecting to Discord");
            throw err;
        }
    })


};
