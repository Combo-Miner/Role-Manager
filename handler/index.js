//were gonna create a MessageContextMenu to handle the context menu for messages

const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const glob = require("glob");
const { Client } = require("discord.js");
const { promisify } = require("util");
const fs = require("fs");
const globPromise = promisify(glob);
/**
 *
 * @param {Client} client
 */
module.exports = async client => {
	//we gonna create an cmd handler 
	const commandfiles = await globPromise(`${process.cwd()}/cmds/**/*.js`);
  //we gonna explain this line by line
  commandfiles.map((value) => {
    //we gonna use the require method to require the command file
    const file = require(value);
    //we gonna use the split method to split the path of the file
    const splitted = value.split("/");
    //we gonna use the pop method to remove the last element of the array
    const directory = splitted[splitted.length - 2];
    //we gonna use the set method to set the command in the collection but first we gonna check if the command has a name or aliases


    if (file.name) {

      const properties = { directory, ...file };
      //we gonna use the set method to set the command in the collection
      client.cmds.set(file.name, properties);
    }
    if (file.aliases) {
    //
      const properties = { directory, ...file };
      //we gonna use the set method to set the command in the collection
      client.cmds.set(file.aliases, properties);
    }
  });
    //here client user id is null so we need to wait for the ready event
   client.on('ready', () => {
    console.log("Im ready!")
// Arrays in which to send all commands
const commandsToInteract = [];
// Get all the command files from their directory
const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));



 for (const file of commands) {
    // Get the command from the file
 	const command = require(`../commands/${file}`);
    

 	try { 
        commandsToInteract.push(command.data.toJSON());
        client.commands.set(command.data.name, command)
     }
 	catch(error) {  }
 }

const rest = new REST({ version: '9' }).setToken(client.token);
// Register all the commands

(async () => {
	try {
		 await rest.put(
		 	Routes.applicationCommands(client.user.id),
		 	{ body: commandsToInteract },
		);


       
        

	}
	catch (error) {
	
	}
})();

    })
    }

