//create a setprefix cmd

const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'setprefix',
    description: 'Définir le prefix du bot',
    helpname : 'setprefix <prefix>',
    async execute(message, args, client) {
        let db = client.db;
        if( db.get(`owners_${message.guild.id}_${message.member.id}`) || message.member.id == config.ownerID  ) {
            if(!args[0]) return message.reply({content : "Veuillez préciser un prefix", ephemeral : true})
            //check if the prefix is too long
            if(args[0].length > 5) return message.reply({content : "Le prefix ne peut pas dépasser 5 caractères", ephemeral : true})
            db.set(`prefix_${message.guild.id}`, args[0])
            return message.reply({content : `Le prefix est désormais ${args[0]}`, ephemeral : true})
        }
    }
}