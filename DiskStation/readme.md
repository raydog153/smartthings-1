
## Features

Connect to Synology Diskstation / Surveillance Station on your local network and create camera devices for each camera in the Survellance Station application.

Camera devices support the following capabilities:
- Image Capture -- Image capture uses the standard take command
- Motion Detection -- Motion detection status lasts for a user specified number of minutes past the last motion sent by the Diskstation
- Record -- Using the device button or switch on/off commands to start and stop recording 
- Refresh -- Use the refresh button / command when you change presets or patrols

The follow commands are also supported from SmartApps:
- "left", "right", "up", and "down"
- "zoomIn" and "zoomOut"
- "home"
- "presetGoName", ["string"]
- "patrolGoName", ["string"]
- "autoTakeOn" and "autoTakeOff"

## Installation

To set up the your Synology Diskstation cameras from Surveillance Station as SmartThings devices, follow these steps:

Set up the SmartApp:
* Create a new SmartApp
* Enter any values in the required * fields
* Click the button "Enable OAuth in Smart App"
* Create the Smart App
* Copy the code from DiskstationConnect.groovy over the code of your SmartApp
* Save and Publish For Me

Set up the Device Type:
* Create a new Device Type
* Enter any values in the required * fields
* Create the Device Type
* Copy the code from DiskstationCamera.groovy over the code of your Device Type
* Save and Publish For Me

Connect to your DiskStation:
* Open your SmartThings application on your iPhone or Android device
* Go to My Apps and Choose Diskstation (Connect)
* If you don't see it in My Apps, kill the SmartThings application and restart it
* Follow the instructions in the App for the rest of the details

If you add new cameras to your system, go through the Diskstation (Connect) app again to add the new cameras. If you already set up motion detection, you do not need to do it again.


## Snapshots
- To get snapshots working, you will need to run a small web server app on your Synology server.
- If you don't have node installed yet, install [node](https://nodejs.org/en/download/) on your Diskstation. You can do so from the Control Panel.
- You may need to install some node modules. After node has been installed, run the following from the terminal:

`npm install express`
`npm install request`
`npm install base64-img`
- The JavaScript app can sometimes crash, so it is wise to run it under a monitoring app. I use `pm2`, but you can use whatever you want.

### On your Diskstation:
- Assuming you checked out the source code to `~/dscam`:
`cd ~/dscam`
`node dscam.js`
You should see something like `Server listening on port 21121` on the console
- If you have installed `pm2`, instead of starting `node dscam.js` directly, you can start the web server as follows:
`cd ~/dscam`
`pm2 start dscam`
