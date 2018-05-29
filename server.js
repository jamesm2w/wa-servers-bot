const Discord = require('discord.js');

const client = new Discord.Client();

client.on("message", message => {
  if (message.content.startsWith("!windwall")) {
    message.channel
  }
});


client.on("ready", () => {
  console.log("[INFO] Bot account logged in");
});

client.login(process.env.TOKEN);