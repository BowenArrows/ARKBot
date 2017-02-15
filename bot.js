const Discord = require('discord.js');
const setting = require('./settings.json');
const Rcon = require('modern-rcon');
const Bot = new Discord.Client();
const fs = require('fs');
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
//Geting player ID is not possible through rcon at the moment, it always returns the same number.
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
    var args = message.content.split(/[ ]+/);
    if(commandIs('help', message)){
        if(hasRole(message.member, setting.config.ownerRole)){
            message.channel.sendMessage('The available commands for ' + setting.config.ownerRole + ' are: \n   help \n   say <Message to say>\n   arkcmd <Text to send to ark rcon server>\n   arkbcast <Message to broadcast to ARK>\n   arkplayers \n   arkmotd <Message motd gets set to\n   config <Config to change> <What to change it to>')
        } else if(hasRole(message.member, setting.config.adminRole)){
            message.channel.sendMessage('The available commands for ' + setting.config.adminRole + ' are: \n   help \n   say <Message to say>\n   arkbcast <Message to broadcast to ARK>\n   arkplayers \n   arkmotd <Message motd gets set to>')
        } else {
            message.channel.sendMessage('The available commands for Everyone are: \n   help \n   arkplayers')
        }
    }
    if(commandIs('say', message)){
        if(hasRole(message.member, setting.config.ownerRole) || hasRole(message.member, setting.config.adminRole)){
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
        if(hasRole(message.member, setting.config.ownerRole) || hasrole(message.member, setting.config.adminRole)){
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
      if(commandIs('arkmotd', message)){
          if(hasRole(message.member, setting.config.ownerRole) || hasRole(message.member, setting.config.adminRole)){
            rcon.send('SetMessageOfTheDay ' + args.join(" ").substring(9)).then((res) => {
                console.log(res)
            })
          }
    }
    //Doesn't work
    /*if(commandIs('arkexp', message)){
        if(args.length === 3){
            rcon.send('giveexptoplayer ' + setting.users[args[1]] + " " + args[2] + " 1 0").then((res) => {
            console.log(res)
            console.log('giveexptoplayer ' + setting.users[args[1]] + " " + args[2] + " 1 0")
            })
        }else if(args.length === 4){
            rcon.send('giveexptoplayer ' + setting.users[args[1]] + " " + args[2] + " " + args[3] + " 0")
        }else if(args.length === 5){
            rcon.send('giveexptoplayer ' + setting.users[args[1]] + " " + args[2] + " " + args[3] + " " + args[4])
        }else if(args.length > 5){
            message.channel.sendMessage('Too many ArgumentsUsage: !arkexp [player] [amount] [tribe share(optional)] [Prevent Sharing(optional)]')
        }else if(args.length < 3){
            message.channel.sendMessage('Not Enough Arguments Usage: !arkexp [player] [amount] [tribe share(optional)] [Prevent Sharing(optional)]')
        }
    }*/
    //does not work if you would like to mess with this and try to make it work. and are successful I would apreciate it if you sent me the working code - will crash server if run.
    /*if(commandIs('arkgiveitems', message)){
        if(hasRole(message.member, setting.config.ownerRole)){
            if(args.length === 6){
                //Using No function
                pid = setting.users[args[1]]
                rcon.send("GiveItemToPlayer " + pid + ' "' + setting.items[args[2]] + '" ' + args[3] + ' ' + args[4] + " " + args[5]).then((res) => {
                    message.channel.sendMessage(res)
                })
                //Using Function
                /*getUsers(args[1], message, function(response){
                    rcon.send("GiveItemToPlayer " + response + ' "' + setting.items[args[2]] + '" ' + args[3] + ' ' + args[4] + " " + args[5]).then((res) => {
                    console.log(res)
                    })
                })
            }else if(args.length <= 5){
                message.channel.sendMessage('Not enough arguments, Usage, !arkgiveitems [player] [item] [quantity] [quality] [is bluprint?]')
            }else{
                message.channel.sendMessage('Too many arguments, Usage, !arkgiveitems [player] [item] [quantity] [quality] [is bluprint?]')
            }
        }else{
            message.channel.sendMessage("You do not have permission to use this command")
        }
    }*/
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

Bot.on('message', message => {
    var args = message.content.split(/[ ]+/);
    if (hasRole(message.member, setting.config.ownerRole)) {
        if(commandIs('config', message)){
            if(args.length === 3){
                fs.readFile('settings.json', 'utf8', function readFileCallback(err, data){
                    if (err){
                        console.log(err);
                    } else {
                        obj = JSON.parse(data); //now it's an object
                        if(obj.config[args[1]] != undefined || args[1] != "port" || args[1] != "token"){
                            obj.config[args[1]] = args[2].toString() //add some data
                            json = JSON.stringify(obj); //convert it back to json
                            fs.writeFile('settings.json', json, 'utf8'); // write it back 
                        }else if(args[1] === "port"){
                            obj.config[args[1]] = parseInt(args[2]) //add some data
                            json = JSON.stringify(obj); //convert it back to json
                            fs.writeFile('settings.json', json, 'utf8'); // write it back 
                        } else {
                            message.channel.sendMessage('That is not a config you can change')
                        }
                    }});
            } else if(args[1] === "list"){
                message.channel.sendMessage("The available configs are:\nprefix \nip \nport \npassword \nownerRole \nadminRole \narkchatchannel \nserverchatname \n   Caps do matter")
            } else {
                message.channel.sendMessage('that is not the proper syntax for that command, Usage: !config <Config to change> <New value>')
            }
        }
    }
})

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

Bot.login(setting.config.token)
