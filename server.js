const express = require('express'); 
const app = express(); 

const Discord = require("discord.js");
//const Updater = require(__dirname + "/updatefiles.js");
const api = require(__dirname + "/apicheck.js");

const clients = {
  "eu_01": new Discord.Client(),
  "eu_02": new Discord.Client(),
  "us_01": new Discord.Client(),
  "us_02": new Discord.Client(),
  "us_03": new Discord.Client(),
  "pts": new Discord.Client()
}

var toTitleCase = str => {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var updateBots = () => {
  for (let [serverID, client] of Object.entries(clients)) {
    console.log("[INFO] [API] " + serverID +" is " + JSON.stringify(latestStatus[serverID]));
    console.log("[DEBUG] Updating presence");
    if (latestStatus[serverID][0] == "up") {
      client.user.setPresence({"game": {"name": "Online | " + toTitleCase(latestStatus[serverID][1]) + " Population"}, "status": "online"})
        .then(user => console.log("[INFO] [" + serverID +"] Set to Online, " + latestStatus[serverID][1]))
        .catch(err => console.log(err));
    } else if (latestStatus[serverID][0] == "maintenance") {
      client.user.setPresence({"game": {"name": "Maintenance | " + toTitleCase(latestStatus[serverID][1]) + " Population"}, "status": "idle"})
      .then(user => console.log("[INFO] [" + serverID +"] Set to Maintenance, " + latestStatus[serverID][1]))
      .catch(err => console.log(err));
    } else if (latestStatus[serverID][0] == "down") {
      client.user.setPresence({"game": {"name": "Down | " + toTitleCase(latestStatus[serverID][1]) + " Population"}, "status": "dnd"})
      .then(user => console.log("[INFO] [" + serverID +"] Set to Down, " + latestStatus[serverID][1]))
      .catch(err => console.log(err));
    }
  }
}

var updateAvatars = () => {
  for (let [serverID, client] of Object.entries(clients)) {
    console.log("[DEBUG] [" + serverID +"] is " + JSON.stringify(latestStatus[serverID]));
    console.log("[DEBUG] Setting Avatars this time")
    if (latestStatus[serverID][0] == "up") {
      client.user.setAvatar("https://cdn.discordapp.com/attachments/449903141471649792/468025695398789120/WALogoBig.png")
      .then(user => console.log("[INFO] [" + serverID +"] Online Avatar set to " + user.avatarURL))
      .catch(err => console.log(err));
    } else if (latestStatus[serverID][0] == "maintenance") {
      client.user.setAvatar("https://cdn.discordapp.com/attachments/449903141471649792/468025840748199946/WALogoBigOrange.png")
      .then(user => console.log("[INFO] [" + serverID +"] Maintenance Avatar set to " + user.avatarURL))
      .catch(err => console.log(err));
    } else if (latestStatus[serverID][0] == "down") {
      client.user.setAvatar("https://cdn.discordapp.com/attachments/449903141471649792/468025969765253120/WALogoBigRed.png")
      .then(user => console.log("[INFO] [" + serverID +"] Down Avatar set to " + user.avatarURL))
      .catch(err => console.log(err));
    }
  }
}

var latestStatus = {};

function update() {
  console.log("[INFO] [*] Updating Data");
  api.apicheck(data => {
    latestStatus = JSON.parse(data);
    api.ptscheck(data => {
      latestStatus.pts = data;
      
      updateBots();
    });
  });
}

var i = 1;
var whenReady = () => {
  if (i > 1) {return false;}
  update();
  setInterval(update, 60000);
  setInterval(updateAvatars, 600000);
  i++;
}

for (let [serverID, client] of Object.entries(clients)) {
  client.login(process.env[serverID]); //Login Bots
  console.log("[INFO] [" + serverID + "] Logged in");
  client.on("ready", () => {
    whenReady();
  });
}

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

var listener = app.listen(process.env.PORT, () => {
  console.log("[INFO] App Running");
});