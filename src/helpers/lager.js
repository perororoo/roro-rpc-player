/* eslint-disable comma-dangle */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import * as VLC from 'vlc.js';
import * as config from '../../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vlc = config.vlc
const client = new VLC.VLCClient(vlc);
const destination = path.join(__dirname, '/../../logs/');
const logs = [{
  details: {
    arch: os.arch(),
    type: os.type()
  }
}];

export default (...args) => {
    const log = {
      msg: args,
      time: Date.now()
    };
    client.getStatus()
      .then((status) => {
        log.status = status;
        logs.push(log);
      })
      .catch((err) => {
        log.status = err.message;
        logs.push(log);
      });
  };
  
  process.on('exit', () => {
    if (!fs.existsSync(destination)) fs.mkdirSync(destination);
    fs.writeFileSync(`${destination}${Date.now()}.log`, JSON.stringify(logs));
  });
