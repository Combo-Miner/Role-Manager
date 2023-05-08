//get info about a specific user in youtube channel with his total views and total subscribers
const config = require("./config.json");
const discord = require("discord.js");
const client = new discord.Client({ intents: 32767 });
const db = require("quick.db");
//collection for the commands
client.commands = new discord.Collection();
client.cmds = new discord.Collection();
client.config = config;
client.db = db;
//requires the handler
module.exports = client;

require("./handler")(client);

//im lazy to do a fucking event handler so i just put it here
client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand() || interaction.targetType === "USER") {
  

    let command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      command.execute(interaction);
    } catch (error) {
      console.error(error);

      await interaction.reply({
        content: `Une erreure est survenue lors de l'éxecution de cette commande`,
        ephemeral: true,
      });
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "DM") return;
  let prefix = client.db.get(`prefix_${message.guild.id}`);
  if (prefix === null) prefix = config.prefix;
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  // we gonna use the shift method to remove the first element of the array
  const commandName = args.shift().toLowerCase();

  //we gonna use the get method to get the command from the collection that we created early in the index.js file
  const command = client.cmds.get(commandName) || client.cmds.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

   if(command){
  
      //we gonna use the execute method to execute the command or event the run method
  //    command.run(message, args, client);
  //we have three arguments the message, the args and the client so we can use it in the command file
      command.execute(message, args, client);
   };
  
});




client.on('guildMemberUpdate', async (oldMember, newMember) => {

    if(oldMember.roles.cache.size < newMember.roles.cache.size){

        let role = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id)).first();
        let logs = db.get("logsrole_" + newMember.guild.id);
        if(!logs) return;
        let channel = newMember.guild.channels.cache.get(logs);
        if(!channel) return;
      
        let executor = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first().executor);

        let embed = new discord.MessageEmbed()
        .setDescription(
          `\`\`\`Information de l'executeur\`\`\`\n${executor} (\`${
            executor.id
          }\`)\n\n\`\`\`Information de la victime\`\`\`\n${
            newMember 
           } (\`${newMember.id}\`)\n\n\`\`\`Information sur l'action \`\`\`\n> \`Add roles \`\n${role} (\`${role.id}\`)`
        ).setColor("GREEN")
        channel.send({embeds : [embed] })

    } else if(oldMember.roles.cache.size > newMember.roles.cache.size){
        
          let role = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id)).first();
          let logs = db.get("logsrole_" + newMember.guild.id);
          if(!logs) return;
          let channel = newMember.guild.channels.cache.get(logs);
          if(!channel) return;
        
          let executor = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first().executor);
  
          let embed = new discord.MessageEmbed()
          .setColor("RED")
          .setDescription(
            `\`\`\`Information de l'executeur\`\`\`\n${executor} (\`${
              executor.id
            }\`)\n\n\`\`\`Information de la victime\`\`\`\n${
              newMember 
            } (\`${newMember.id}\`)\n\n\`\`\`Information sur l'action \`\`\`\n> \`Remove roles\`\n${role} (\`${role.id}\`)`
          )
          channel.send({embeds : [embed] })
  
      }
  });

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "DM") return;
  let prefix = client.db.get(`prefix_${message.guild.id}`);
  if (prefix === null) prefix = config.prefix;
  //check for  a message with only one mentions the client  and nothing else
  if (message.content === `<@!${client.user.id}>` || message.content === `<@${client.user.id}>`) {
    //send a message with the prefix
    message.reply(`Mon prefix est \`${prefix}\``);
  }
});
//handle the errors
process.on("unhandledRejection", (error) => {
  console.log("[ERROR] Unhandled Rejection")
  console.log(error)
});

process.on("uncaughtException", (error) => {
  console.log("[ERROR] Uncaught Exception")
  console.log(error)
});


process.on("multipleResolves", (error) => {
  console.log("[ERROR] Multiple Resolves")
  console.log(error)
});

process.on("uncaughtExceptionMonitor", (error) => {
  console.log("[ERROR] Uncaught Exception Monitor")
  console.log(error)
});




client.login(config.token);
