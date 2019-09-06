// use `pm2 start app.js` to start node serve
// then, `pm2 show 0` to show runnng app
// `pm2 logs app` to show trailing logs
// TODO: See what I need to do to have pm2 auto-start node.js on server reboot
// TODO: Tutorial here: https://nodejs.org/zh-cn/knowledge/file-system/how-to-store-local-config-data/
// TODO: `pm2 monit` mentioned "watch & reload". It sounds useful

const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const base64Img = require('base64-img');

const app = express();

const SERVER_PORT = 21121;

app.use(bodyParser.json());

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}`);
});

app.post('/snapshot', function (req, res) {
  let command = req.body;
  console.log ("Received /command: " + JSON.stringify(command));
  res.json({ message: 'Command received' });
  base64Img.requestBase64(command.snapshotUrl,
      (error, res, body) => {
        console.log("Headers: " + JSON.stringify(res.headers));
        //console.log("Body: " + body.substring(0, 20));
        if (error) {
          console.error(error);
        }

		var img64 = body;

        request.post(command.apiServerUrl, {
              json: {
                "camera": command.camera,
                "snapshot": img64
              }
            }, (error, res, body) => {
              if (error) {
                console.error("Error sending response to ST: " + error);
              }
            }

        )
  });

});


function sendToSmartThings(jsonBody) {
  if (!("Service" in jsonBody))
    jsonBody["Service"] = "WebServerUpdate";
  request.post(API_SERVER_URL, {
    json: jsonBody
  }, (error, res, body) => {
    if (error) {
      console.error(error);
    }
  })
}

