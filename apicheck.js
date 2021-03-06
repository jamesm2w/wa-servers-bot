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
          try{
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
          } catch (ex) {
            console.log(ex);
            onResult(res.statusCode, {
              us_pvp_01: {status: "custom", name: "down", population: "Status Page Errored"},
              us_pve_01: {status: "custom", name: "down", population: "Status Page Errored"},
              pts: {status: "custom", name: "down", population: "Status Page Errored"}
            });
          }
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
        "us_pvp_01": [data.us_pvp_01.status, data.us_pvp_01.population, data.us_pvp_01.name],
        "us_pve_01": [data.us_pve_01.status, data.us_pve_01.population, data.us_pve_01.name]
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
    //let content = [data.pts.status, data.pts.population, data.pts.name];
    let content = ["custom", "Awaiting Update 29", "down"]
    //content = JSON.stringify(content);
    onfinish(content);
  });
}