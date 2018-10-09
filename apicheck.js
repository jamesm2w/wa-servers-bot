const http = require("http");
const https = require("https");
const fs = require('fs');

var exports = module.exports = {};

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

var ptsoptions = {
  host: 'worldsadrift-staging.api.bossagames.com',
  port: 80,
  path: "/deploymentStatus",
  method: 'GET',
  headers: {
      'Content-Type': 'application/json'
  }
}
exports.apicheck = function (onfinish) {
  getJSON(waoptions, function(status, data){
      
      let content = {
        "us_01": ["down", data.us_01.population, data.us_01.name],
        "eu_01": ["down", data.eu_01.population, data.eu_01.name],
        "us_02": ["down", data.us_02.population, data.us_02.name],
        "eu_02": ["down", data.eu_02.population, data.eu_02.name],
        "us_03": ["down", data.us_03.population, data.us_03.name]
      }
      
      content = JSON.stringify(content);

      //fs.writeFile(__dirname + "/latestapi.json", content, 'utf8', function (err) {
      //    if (err) {console.log(err);}
      //    console.log("[API] File Updated");
      //}); 
      onfinish(content);
    });
}

exports.ptscheck = function (onfinish) {
  getJSON(ptsoptions, function (status, data) {
    let content = [data.pts.status, data.pts.population, data.pts.name];
    
    //content = JSON.stringify(content);
    onfinish(content);
  });
}