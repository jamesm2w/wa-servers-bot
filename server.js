const Discord = require('discord.js');
const http = require("http");
const https = require("https");

const capulca_client = new Discord.Client();
const tenrui_client = new Discord.Client();

var latestStatus = {};

function getJSON(options, onResult) {
    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, (res) => {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            output += chunk;
        });
        res.on('end', () => {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });
    req.on('error', (err) => {
        console.log(err.message);
    });
    req.end();
};

var statusOptions = {
    host: 'worldsadrift.api.bossagames.com',
    port: 443,
    path: "/deploymentStatus",
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
};

function getServersStatus() {
  latestStatus = getJSON(statusOptions, (resp, data) => {
    if (resp == 200) {
      return data;
    }
  });
}

function getServerStatus(serverID) {
  return latestStatus[serverID].status;
}

function getServerPopulation(serverID) {
  return latestStatus[serverID].population;
}

function getServerName(serverID) {
  return latestStatus[serverID].name;
}

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