const http = require("http");
const https = require("https");

var exports = module.exports = {};

var getJSON = (options, onResult) => {
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

exports.getServersStatus = (onFinish) => {
  getJSON(statusOptions, (resp, data) => {
    if (resp == 200) {
      onFinish(data);
    }
  });
}

exports.getServerStatus = (serverID) => {
  return latestStatus[serverID].status;
}

exports.getServerPopulation = (serverID) => {
  return latestStatus[serverID].population;
}

exports.getServerName = (serverID) => {
  return latestStatus[serverID].name;
}
