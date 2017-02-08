const Discord = require('discord.js');
const setting = require('./settings.json');
const Rcon = require('modern-rcon');
const Bot = new Discord.Client();
const rcon = new Rcon(setting.config.ip, port = setting.config.port, setting.config.password, timeout = 10000);

rcon.connect();

function commandIs(str, msg){
    return msg.content.toLowerCase().startsWith(setting.config.prefix + str);
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

/*function getUsers(name, msg, callback) {
    rcon.send("listplayers").then((res) => {
        if(res.indexOf(name) > -1){
            var nindex = res.indexOf(name);
            var cindex = res.indexOf(", ", nindex);
            var xsteamId = res.substr(cindex+2, cindex+14);
            var xindex = xsteamId.indexOf("\n");
            var steamId = xsteamId.substr(0, xindex);
            rcon.send("GetPlayerIDForSteamID " + steamId).then((res) => {
                playerid = res.split(/[ ]+/)
                return callback(playerid[3]);
            });
                
        } else {
            msg.channel.sendMessage("No Player with that name is online")
            return
        }
    })
}*/

Bot.on('ready', () => {
    console.log('The Bot is dank.');
});
//Commands
Bot.on('message', message => {
    rcon.connect();
    var args = message.content.split(/[ ]+/);
    if(commandIs('hello', message)){
        message.channel.sendMessage('Hello there ' + message.author.username)
    }
    if(commandIs('say', message)){
        if(hasRole(message.member, setting.config.ownerRole) || hasRole(message.member, "Mod")){
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
        if(hasRole(message.member, setting.config.ownerRole) || hasrole(message.member, setting.config.modRole)){
            if(args.length === 1){
                message.channel.sendMessage('You did not enter enough arguments Usage: !bcast [thing to broadcast]')
            } else {
                rcon.send('Broadcast ' + args.join(" ").substring(9)).then((res) => {
                    console.log(res)
                })
            } 
        }else{
            message.channel.sendMessage('You do not have permission to use that command')
        }
    }
    if(commandIs('arkcmd', message)){
        if (hasRole(message.member, setting.config.ownerRole)){
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
    if(commandIs('arkgiveitems', message)){
        if(hasRole(message.member, setting.config.ownerRole)){
            if(args.length === 6){
                pid = setting.users[args[1]]
                rcon.send("GiveItemToPlayer " + pid + ' "' + setting.items[args[2]] + '" ' + args[3] + ' ' + args[4] + " " + args[5]).then((res) => {
                    message.channel.sendMessage(res)
                })
                /*getUsers(args[1], message, function(response){
                    rcon.send("GiveItemToPlayer " + response + ' "' + setting.items[args[2]] + '" ' + args[3] + ' ' + args[4] + " " + args[5]).then((res) => {
                    console.log(res)
                    })
                })*/
            }else if(args.length <= 5){
                message.channel.sendMessage('Not enough arguments, Usage, !arkgiveitems [player] [item] [quantity] [quality] [is bluprint?]')
            }else{
                message.channel.sendMessage('Too many arguments, Usage, !arkgiveitems [player] [item] [quantity] [quality] [is bluprint?]')
            }
        }else{
            message.channel.sendMessage("You do not have permission to use this command")
        }
    }
});

Bot.on('message', message => {
    if(message.content.startsWith(setting.config.prefix) || message.author.bot)return;
    else if (message.channel.name === setting.config.arkchatchannel){
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
              else if (res.indexOf(setting.config.serverchatname + ":") > -1) {}
              else{
                  message.channel.name = setting.config.arkchatchannel
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

Bot.login(setting.config.token)