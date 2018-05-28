const statusHelper = require("./statusChecker.js");
const Discord = require('discord.js');

const clients = {
  "eu_01": new Discord.Client(),
  "eu_02": new Discord.Client(),
  "us_01": new Discord.Client(),
  "us_02": new Discord.Client(),
  "us_03": new Discord.Client()
}

function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

var latestStatus = {};

function update() {
  console.log("Updating Data");
  statusHelper.getServersStatus((data) => {
    latestStatus = data;
    updateBots();
  });
}

function updateBots() {
  for (let [serverID, client] of Object.entries(clients)) {
    let status, avatarURL, report;
    if (latestStatus[serverID].status == "up") {
      client.user.setPresence({"game": {"name": "Online | " + toTitleCase(latestStatus[serverID].population) + " Population"}, "status": "online"})
        .then(user => console.log("Online presence set for " + serverID))
        .catch(console.error);
    } else if (latestStatus[serverID].status == "maintenance") {
      client.user.setPresence({"game": {"name": "Maintenance | " + toTitleCase(latestStatus[serverID].population) + " Population"}, "status": "idle"})
      .then(user => console.log("Maintenance presence set for " + serverID))
      .catch(console.error);
    } else if (latestStatus[serverID].status == "down") {
      client.user.setPresence({"game": {"name": "Down | " + toTitleCase(latestStatus[serverID].population) + " Population"}, "status": "dnd"})
      .then(user => console.log("Down presence set for " + serverID))
      .catch(console.error);
    }
    
  }
}

function updateAvatars() {
  for (let [serverID, client] of Object.entries(clients)) {
    if (latestStatus[serverID].status == "up") {
      client.user.setAvatar("https://cdn.glitch.com/f39df7fd-58e7-4479-a67f-5e36c0639cd4%2FWALogoBig.png?1527516083658")
      .then(user => console.log("Online Avatar Set for " + serverID + " " + user.avatarURL))
      .catch(console.error);
    } else if (latestStatus[serverID].status == "maintenance") {
      client.user.setAvatar("https://cdn.glitch.com/f39df7fd-58e7-4479-a67f-5e36c0639cd4%2FWALogoBigOrange.png?1527516083888")
      .then(user => console.log("Maintenance Avatar Set for " + serverID + " " + user.avatarURL))
      .catch(console.error);
    } else if (latestStatus[serverID].status == "down") {
      client.user.setAvatar("https://cdn.glitch.com/f39df7fd-58e7-4479-a67f-5e36c0639cd4%2FWALogoBigRed.png?1527516083408")
      .then(user => console.log("Down Avatar Set for " + serverID + " " + user.avatarURL))
      .catch(console.error);
    }
    
  }
  
}

setTimeout(update, 60000);

setTimeout(updateAvatars, 600000);

for (let [serverID, client] of Object.entries(clients)) {
  client.login(process.env[serverID]);
}