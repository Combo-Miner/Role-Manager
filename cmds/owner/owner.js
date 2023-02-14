const { log } = require("console");
const {
  MessageEmbed,
} = require("discord.js");
module.exports = {
    name: "owner",
    helpname : "owner <add/remove> <@user>",
    description : "Ajouter ou retirer un owner",
  
  async execute(message, args, client) {
    //check if the user is the owner of the bot

    if(message.member.id !== client.config.ownerID) return message.reply({content : "Vous n'êtes pas le propriétaire du bot", ephemeral : true})
    let db = client.db;
    let logs = client.channels.cache.get(db.get(`logsperm_${message.guild.id}`))
    //check for args
    if(!args[0]) return message.reply({content : "Veuillez préciser une action", ephemeral : true})
    if(!args[1] && args[0] !==  "list") return message.reply({content : "Veuillez préciser un utilisateur", ephemeral : true})

    
    
   
    if(args[0] == "remove"){

        let member =  await client.users.fetch( message.mentions?.members.first()?.id == null ? args[1] :  message.mentions?.members.first().id);
    if(!member) return message.reply({content : "Veuillez préciser un utilisateur", ephemeral : true})
  
        if(db.get(`owners_${message.guild.id}_${member.id}`) !== true) return message.reply({content : `${member} n'est pas owner`, ephemeral : true})
        db.delete(`owners_${message.guild.id}_${member.id}`)
        let emnbed = new MessageEmbed()
        .setTitle("Owner retiré").setColor("RED")
        .setDescription(`\`\`\` Owner Retiré \`\`\`\n ${member} (\`${member.id}\`) \n \`\`\`Information sur l'éxecuteur\`\`\`\n ${message.author}   (\`${message.author.id})\``)
        if(logs) logs.send({embeds : [emnbed]})
        //here the message is not send cause 
        return message.reply({content : `${member} n'est plus owner`, ephemeral : true})
    }
    if(args[0] == "add"){
        let member =  await client.users.fetch( message.mentions?.members.first()?.id == null ? args[1] :  message.mentions?.members.first().id);;
    if(!member) return message.reply({content : "Veuillez préciser un utilisateur", ephemeral : true})

        if(db.get(`owners_${message.guild.id}_${member.id}`) == true) return message.reply({content : `${member} est déjà owner`, ephemeral : true})
        db.set(`owners_${message.guild.id}_${member.id}`, true)
        let embed = new MessageEmbed()
        .setTitle("Owner ajouté").setColor("GREEN")
        .setDescription(`\`\`\` Owner ajouté \`\`\`\n ${member} (\`${member.id}\`) \n \`\`\`Information sur l'éxecuteur\`\`\`\n ${message.author}   (\`${message.author.id})\``)
       if(logs) logs.send({embeds : [embed]})
        return message.reply({content : `${member} est maintenant owner`, ephemeral : true})
    }
    if(args[0] == "list"){
        let currentIndex = 0;
 
        let owners = db.all().filter(data => data.ID.startsWith(`owners_${message.guild.id}`)).map(data => data.ID.split("_")[2])
       let embed = new MessageEmbed()
         .setTitle("Liste des owners")
           //we gonna set an invisible color for the embed
          .setColor("2F3136")
            nextTenOwners()
    async function nextTenOwners(){
        embed.description = "";
        for(let i = currentIndex; i < currentIndex + 10; i++){
            if(!owners[i]) break;
            let owner = await client.users.fetch(owners[i])
            embed.description += `${ owner}\n`;
        }
        currentIndex += 10;
        message.channel.send({embeds : [embed]})

    }
    }
 
  }
}