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
      if (client.user.avatarURL != "") {
        client.user.setAvatar("https://cdn.discordapp.com/avatars/450658123766562817/510dfa8d4b12135466e2343570fabd93.png?size=2048")
        .then(user => console.log("Online Avatar Set for " + serverID + " " + user.avatarURL))
        .catch(console.error);
      }
    } else if (latestStatus[serverID].status == "maintenance") {
      if (client.user.avatarURL != "") {
        client.user.setAvatar("https://cdn.discordapp.com/avatars/450658123766562817/510dfa8d4b12135466e2343570fabd93.png?size=2048")
        .then(user => console.log("Maintenance Avatar Set for " + serverID + " " + user.avatarURL))
        .catch(console.error);
      }
    } else if (latestStatus[serverID].status == "down") {
      if (client.user.avatarURL != "") {
        client.user.setAvatar("https://cdn.discordapp.com/avatars/450658123766562817/510dfa8d4b12135466e2343570fabd93.png?size=2048")
        .then(user => console.log("Down Avatar Set for " + serverID + " " + user.avatarURL))
        .catch(console.error);
      }
    }
    
  }
  
}

setTimeout(() => {
  console.log("Updating Data");
  statusHelper.getServersStatus((data) => {
    latestStatus = data;
    updateBots();
  });
}, 60000);

setTimeout(() => {
  updateAvatars();//
}, 600000);

for (let [serverID, client] of Object.entries(clients)) {
  client.login(process.env[serverID]);
}