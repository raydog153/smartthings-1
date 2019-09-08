// use `pm2 start dscam.js` to start node serve
// then, `pm2 show 0` to show runnng app
// `pm2 logs dscam` to show trailing logs
// ===== IMPORTANT!!!!! ========
// To auto-start pm2 on Synology reboot, use Control Panel -> Task Scheduler
// Add a simple shell script there with `pm2 start dscam.js` command
// =============================
// TODO: pm2 utorial here: https://nodejs.org/zh-cn/knowledge/file-system/how-to-store-local-config-data/
// TODO: `pm2 monit` mentioned "watch & reload". It sounds useful

const express = require('express');
const ajaxrequest = require('ajax-request');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();

const SERVER_PORT = 21121;
var API_SERVER_URL = '';

app.use(bodyParser.json());

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}`);
});

app.post('/snapshot', function (req, res) {
  let command = req.body;
  API_SERVER_URL = command.apiServerUrl;

  console.log ("Received /command: " + JSON.stringify(command));
  res.json({ message: 'Command received' });
  ajaxrequest({
      url: command.snapshotUrl,
      isBuffer: true}, (error, res, body) => {
      console.log("Headers: " + JSON.stringify(res.headers));
      if (res.headers["content-type"].includes("application/json")) {
         sendToSmartThings(JSON.parse(body));
     } else {
         let img64 = 'data:' + res.headers['content-type'] + ';base64,' + body.toString('base64');
         sendToSmartThings({
             "camera": command.camera,
             "snapshot": img64
         })
     }
  });

});

function sendToSmartThings(jsonBody) {
  console.log ("Sending to ST: " + JSON.stringify(jsonBody).substring(0,255));
  request.post(API_SERVER_URL, {
    json: jsonBody
  }, (error, res, body) => {
    if (error) {
      console.error("Error sending response to ST: " + error);
    }
  })
}

// ===== SEND MESSAGE TO SMARTTHINGS HUB BEFORE EXITING =====
function sendHailMary(callback) {
    console.log ("Sending Hail Mary");
    sendToSmartThings({
        "notification": "DS Cam web server is about to die."
    });
    console.log ("Sent Hail Mary to ST hub.");
    callback()
}

function killProcess() {
    sendHailMary(function() {
        console.log('Exit handler completed Hail Mary');
    });

    console.log('Process will exit in 5 seconds');
    setTimeout(function () {
        process.exit();
    }, 5000);
}

// https://nodejs.org/api/process.html#process_signal_events
process.on('SIGTERM', killProcess);
process.on('SIGINT', killProcess);

process.on('uncaughtException', function(e) {

    console.log('[uncaughtException] app will be terminated: ', e.stack);

    killProcess();
    /**
     * @https://nodejs.org/api/process.html#process_event_uncaughtexception
     *
     * 'uncaughtException' should be used to perform synchronous cleanup before shutting down the process.
     * It is not safe to resume normal operation after 'uncaughtException'.
     * If you do use it, restart your application after every unhandled exception!
     *
     * You have been warned.
     */
});