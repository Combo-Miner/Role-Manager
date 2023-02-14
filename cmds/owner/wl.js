const { log } = require("console");
const {
  MessageEmbed,
} = require("discord.js");
const config = require("../../config.json");
module.exports = {
    name: "wl",
    helpname : "wl <add/remove> <@user>",
    description : "Ajouter ou retirer un wl",
  
  async execute(message, args, client) {

    let db = client.db;
    let logs = client.channels.cache.get(db.get(`logsperm_${message.guild.id}`));

    if( db.get(`owners_${message.guild.id}_${message.member.id}`) || message.member.id == config.ownerID  ) {
        

   
  
   
    //check for args
    if(!args[0]) return message.reply({content : "Veuillez préciser une action", ephemeral : true})
    if(!args[1] && args[0] !==  "list") return message.reply({content : "Veuillez préciser un utilisateur", ephemeral : true})

    
    
   
    if(args[0] == "remove"){
        let member =  await client.users.fetch( message.mentions?.members.first()?.id == null ? args[1] :  message.mentions?.members.first().id);
    if(!member) return message.reply({content : "Veuillez préciser un utilisateur", ephemeral : true})
  
        if(db.get(`wl_${message.guild.id}_${member.id}`) !== true) return message.reply({content : `${member} n'est pas wl`, ephemeral : true})
        db.delete(`wl_${message.guild.id}_${member.id}`)
        //we gonna do the same embed as the one for the owners
        let embed = new MessageEmbed()
        .setTitle("Whitelist retirée").setColor("RED")
        .setDescription(`\`\`\` Whitelist Retiré \`\`\`\n ${member} (\`${member.id}\`) \n \`\`\`Information sur l'éxecuteur\`\`\`\n ${message.author}   (\`${message.author.id})\``)
        if(logs) logs.send({embeds : [embed]})

        return message.reply({content : `${member} n'est plus wl`, ephemeral : true})
    }
    if(args[0] == "add"){
        let member =  await client.users.fetch( message.mentions?.members.first()?.id == null ? args[1] :  message.mentions?.members.first().id);;
    if(!member) return message.reply({content : "Veuillez préciser un utilisateur", ephemeral : true})

        if(db.get(`wl_${message.guild.id}_${member.id}`) == true) return message.reply({content : `${member} est déjà wl`, ephemeral : true})
        db.set(`wl_${message.guild.id}_${member.id}`, true)
        let embed = new MessageEmbed()
        .setTitle("Whitelist ajoutée").setColor("GREEN")
        .setDescription(`\`\`\` Whitelist Ajouté \`\`\`\n ${member} (\`${member.id}\`) \n \`\`\`Information sur l'éxecuteur\`\`\`\n ${message.author}   (\`${message.author.id})\``)
        if(logs) logs.send({embeds : [embed]})
        return message.reply({content : `${member} est maintenant wl`, ephemeral : true})
    }
    if(args[0] == "list"){
        let currentIndex = 0;
 
        let owners = db.all().filter(data => data.ID.startsWith(`wl_${message.guild.id}`)).map(data => data.ID.split("_")[2])
       let embed = new MessageEmbed()
         .setTitle("Liste des wl")
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
}