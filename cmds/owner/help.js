//crée une cmd help

const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'help',
    description: 'Affiche la liste des commandes',
    helpname : 'help <cmd>',
    async execute(message, args, client) {
        let db = client.db;
        let prefix = db.get(`prefix_${message.guild.id}`) || config.prefix;
        if( db.get(`owners_${message.guild.id}_${message.member.id}`) || message.member.id == config.ownerID  ) {
            let embed = new MessageEmbed()
            .setTitle("Liste des commandes")
            .setColor("2F3136")
            .setFooter("Pour plus d'informations sur une commande, faites help <cmd>")
            let cmd = client.cmds
            cmd.map(cmd => {
                embed.addField(  prefix + `\`${cmd.helpname}\``, cmd.description)
            })
            message.channel.send({embeds : [embed]})
        }
    }
}