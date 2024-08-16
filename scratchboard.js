
//     ws.on("message", function incoming(data) {
//         let p = JSON.parse(data);
//         const { t, op, d, s } = p;

//         switch (op) {
//             case 10:
//                 const { heartbeat_interval } = d;
//                 interval = heartbeat(heartbeat_interval);
//                 wasReady = true;

//                 if (url === initialURL) ws.send(JSON.stringify(payload))
//             break;

//             case 0:
//                 seq = s;
//             break; 
//         };

//         switch (t) {
//             case "READY" :
//                 console.log("The gateway connection is ready!!")
//                 url = d.resume_gateway_url;
//                 sessionId = d.session_id;
//             break;

//             case "RESUMED":
//                 console.log("The gateway connection is resumed!! :D")
//             break;

//             case "MESSAGE_CREATE":
//                 let author = d.author.username;
//                 let disc = () => {if (d.author.discriminator != 0) {return '#' + d.author.discriminator} else return ''};
//                 let content = d.content;
//                 let msg_channel_id = d.channel_id;
//                 console.log(`${author}${disc()} : ${content}`);
//         };

//     });