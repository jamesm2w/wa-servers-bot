const statusHelper = require("./statusChecker.js");
const Discord = require('discord.js');

const capulca_client = new Discord.Client();
const tenrui_client = new Discord.Client();

var latestStatus = {};

function updateBots() {
  
}

setTimeout(() => {
  statusHelper.getServersStatus((data) => {
    latestStatus = data;
    updateBots();
  });
},28000);

tenrui_client.on("ready", () => {
  console.log("Ten-Rui Logged in");
});

capulca_client.on('ready', () => {
  console.log("Capulca Logged in");
});

capulca_client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

capulca_client.login(process.env.CAPULCA_TOKEN);
tenrui_client.login(process.env.TENRUI_TOKEN);