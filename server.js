const statusHelper = require("./statusChecker.js");
const Discord = require('discord.js');

const clients = {
  "eu_01": new Discord.Client(),
  "eu_02": new Discord.Client(),
  "us_01": new Discord.Client(),
  "us_02": new Discord.Client(),
  "us_03": new Discord.Client()
}

var latestStatus = {};

function updateBots() {
  for (let [serverID, client] of Object.entries(clients)) {
    console.log(client.guilds);
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