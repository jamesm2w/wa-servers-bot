const Discord = require('discord.js');
const client = new Discord.Client();
const http = require("http");
const https = require("https");

var getJSON = function(options, onResult) {
    console.log("getjson called");
    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res)
    {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            output += chunk;
        });
        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });
    req.on('error', function(err) {
        //res.send('error: ' + err.message);
        throw err;
    });
    req.end();
};

var waoptions = {
    host: 'worldsadrift.api.bossagames.com',
    port: 80,
    path: "/deploymentStatus",
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

var latestData = {}

setTimeout(()=>{
  getJSON(waoptions, (status, result) => {
    if (status == 200) {
      latestData = result;
    }
  });
}, 56000);

var servers = Object.keys(latestData);

var getPresence = (server) => {
  let serverStatus = latestData[server], discordStatus;
  switch (serverStatus.status) {
    case "up":
      discordStatus = "online";
    case "maintenance":
      discordStatus = "dnd";
  }
  return {"game": {"name": "on " + serverStatus.name + " | " + serverStatus.status + " | " + serverStatus.population, "type": "PLAYING"}, "status": "online"}
};

client.on('ready', () => {
  console.log("Logged in");
  client.user.setPresence({"game": {"name": "the servers", "type": "PLAYING"}, "status": "online"});
});



client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login(process.env.TOKEN);