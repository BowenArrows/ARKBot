# ARKBot--------------------------     Discord Features
--------------------------
   Testing Confirmation Commands -

1. !help - Ping test Command/ Help command
2. !say - String interpretation test
--------------------------
    Ark Integration Commands -
1. !arkcmd - Any text after this is sent directly through rcon Only the owner can use this Command
2. !arkbcast - This Broadcasts text after the command. EX: !arkbcast Server shutting down for maintenaence in 15 minutes. Make sure you're at your base!
3. !arkplayers - This shows who is online by steam name.
4. !arkmotd - Set's the Message of the Day

    ARK Chat Integration -
To enable this feature you must run the !arkchat command which just triggers the program to periodically run the getchat command printing chat to the channel it is run in.

--------------------------
          Config
--------------------------
The config.json file with this program is where most changes on your end will need to be made.
"config": {
    "token": "Your discord bot token", I will not be running the bot. You will have to run it yourself.
    "prefix": "!", Command Prefix
    "ip": "localhost",
    "port": 32330,
    "password": "Pass",
    "ownerRole": "Founder",
    "adminrole": "Admin",
    "modRole": "Mod",
    "arkchatchannel": "general",
    "serverchatname": "SERVER" If you do not change this, leave this the way it is
  },
"items": {
    "Item": "Name",
    "tekhelm": "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/TEK/PrimalItemArmor_TekHelmet.PrimalItemArmor_TekHelmet'"
    This is part of the !arkgiveitems command which does not work currently
  },
"users": {
    "Bowenarrows": "767680309",
    "Ar-Kane": "759952995"
    You must set this section up munually, if you wish to use any commands requiring playerid, you set a custom name and use showmyadminmenu in game to see playerids.
    However this us also part of the !arkgiveitems command.
    }

--------------------------
     Planned Features
--------------------------
    In ARK Commands (For general use not using console)
    Server manegment commands EX: Restart server in X amount of time