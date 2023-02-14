 
const config = require('../../config.json');
const { MessageEmbed } = require('discord.js');

 module.exports = {
    name: 'setlogs',
    description: 'Définir le salon de logs',
    helpname : 'setlogs <perm/role/check> <salon>',
   async execute(message, args, client) {

    let db = client.db;
    if( db.get(`owners_${message.guild.id}_${message.member.id}`) || message.member.id == config.ownerID  ) {

        if(!args[0]) return message.reply({content : "Veuillez préciser un type de logs", ephemeral : true})
        if(args[0] == "perm"){
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            if(!channel) return message.reply({content : "Veuillez préciser un salon", ephemeral : true})
            db.set(`logsperm_${message.guild.id}`, channel.id)
            return message.reply({content : `Le salon de logs est désormais ${channel}`, ephemeral : true})
        }else if(args[0] == "role"){
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            if(!channel) return message.reply({content : "Veuillez préciser un salon", ephemeral : true})
            db.set(`logsrole_${message.guild.id}`, channel.id)
            return message.reply({content : `Le salon de logs est désormais ${channel}`, ephemeral : true})

        }
        else if(args[0] == "check"){
            let permChannel = message.guild.channels.cache.get(db.get(`logsperm_${message.guild.id}`))
            let roleChannel = message.guild.channels.cache.get(db.get(`logsrole_${message.guild.id}`))
            let embed = new MessageEmbed()
            .setTitle("Logs")
            .setColor("2F3136")
            .addField("Logs des permissions", permChannel == null  ? "Aucun salon défini" : `${permChannel}`)
            .addField("Logs des rôles", roleChannel == null  ? "Aucun salon défini" : `${roleChannel}`)
            message.channel.send({embeds : [embed]})
        }
    }

    }
 }