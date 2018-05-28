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
      
    } else if (latestStatus[serverID].status == "maintenance") {
      client.user.setPresence({"game": {"name": "Maintenance | " + toTitleCase(latestStatus[serverID].population) + " Population"}, "status": "idle"})
      
    } else if (latestStatus[serverID].status == "down") {
      client.user.setPresence({"game": {"name": "Down | " + toTitleCase(latestStatus[serverID].population) + " Population"}, "status": "dnd"})
      
    }
    
  }
}

setTimeout(() => {
  statusHelper.getServersStatus((data) => {
    latestStatus = data;
    updateBots();
  });
},28000);

for (let [serverID, client] of Object.entries(clients)) {
  client.login(process.env[serverID]);
}