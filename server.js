const Discord = require('discord.js');

const client = new Discord.Client();

client.on("message", message => {
  if (message.content.startsWith("!windwall")) {
    message.channel.send("Hello World").then(message => {console.log("[INFO] !windwall reply sent")}).error(console.error)
  }
});


client.on("ready", () => {
  console.log("[INFO] Bot account logged in");
});

client.login(process.env.TOKEN);