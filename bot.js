const Discord = require('discord.js');
const config = require('./config.json');
const fs = require("fs");
const Rcon = require('modern-rcon');
const Bot = new Discord.Client();
const rcon = new Rcon(config.ip, port = config.port, config.password);

function commandIs(str, msg){
    return msg.content.toLowerCase().startsWith(config.prefix + str);
}

function pluck(array) {
    return array.map(function(item) { return item["name"]; });
}

function hasRole(mem, role) {
    if(pluck(mem.roles).includes(role)){
        return true;
    } else {
        return false;
    }
}

Bot.on('ready', () => {
    console.log('The Bot is dank.');
});
//Commands
Bot.on('message', message => {
    var args = message.content.split(/[ ]+/);
    if(commandIs('hello', message)){
        message.channel.sendMessage('Hello there ' + message.author.username)
    }
    if(commandIs('say', message)){
        if(hasRole(message.member, config.ownerRole) || hasRole(message.member, "Mod")){
            if(args.length === 1){
                message.channel.sendMessage('You did not enter enough arguments Usage: !say [thing to say]')
            } else {
                message.channel.sendMessage(args.join(" ").substring(5))
            } 
        } else {
            message.channel.sendMessage('You do not have permission to use that command')
        }
    }
    if(commandIs('arkbcast', message)){
        if(hasRole(message.member, config.ownerRole) || hasrole(message.member, config.modRole)){
            if(args.length === 1){
                message.channel.sendMessage('You did not enter enough arguments Usage: !bcast [thing to broadcast]')
            } else {
                rcon.send('Broadcast ' + args.join(" ").substring(6)).then((res) => {
                    console.log(res)
                })
            } 
        }else{
            message.channel.sendMessage('You do not have permission to use that command')
        }
    }
    if(commandIs('arkcmd', message)){
        if (hasRole(message.member, config.ownerRole)){
            rcon.send(args.join(" ").substring(7)).then((res) => {
                message.channel.sendMessage(res)
            })
        }
    }
    if(commandIs('arkplayers', message)){
        rcon.send("listplayers").then((res) => {
            message.channel.sendMessage(res)
        })
    }
});


rcon.connect();
Bot.on('message', message => {
    if(message.content.startsWith(config.prefix) || message.author.bot)return;
    else if (message.channel.name === config.arkchatchannel){
        return rcon.send('Serverchat ' + message.author.username + ': ' + message.content).then((res) => {
            console.log(res)
        })
    }
});
Bot.on('message', message => {
    if (commandIs('arkchat',message)) { // command to trigger
      setInterval (function (){
          rcon.send("GetChat").then((res) => {
              console.log(res)
              if (res.toString() === "Server received, But no response!! \n "){}
              else if (res.indexOf(config.serverchatname + ":") > -1) {}
              else{
                  message.channel.name = config.arkchatchannel
                  message.channel.sendMessage(res)
              }
        })
      }, 5000); // time between each interval in milliseconds
    }
});
process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

Bot.login(config.token)
