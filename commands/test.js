const { log } = require("console");
const {
  MessageActionRow,
  MessageSelectMenu,
  Message,
  MessageButton,
  Interaction,
  MessageEmbed,
} = require("discord.js");

module.exports = {
  data: {
    name: "edit role of user",
    type: 3, // Type 3 is for Message Context Menu
    /**
     * @param {Interaction} interaction
     * @returns
     */
    toJSON() {
      return this;
    },
  },
  async execute(interaction) {
    let client = require("../index")
    let config = client.config
    let db = client.db == null ? require("quick.db") : client.db;
    
    if( db.get(`wl_${interaction.guild.id}_${interaction.member.id}`) || db.get(`owners_${interaction.guild.id}_${interaction.member.id}`) || interaction.member.id == config.ownerID  ) {
    let message = interaction.channel.messages.cache.get(interaction.targetId);
    const pageSize = 6;
    let member = message.member;
    let currentIndex = 0;
    let embed = new MessageEmbed()
      .setTitle("Modificateur de rôles d'un membre")
      .setDescription(
        `\`\`\`Information du membre\`\`\`\n${member} (\`${
          member.id
        }\`)\n\n\`\`\`Rôles actuel\`\`\`\n${
          member.roles.cache
            .map((role) => `${role} (\`${role.id}\`)`)
            
            .join("\n") || "Aucun rôle"
        }`
      ) //we gonna map the roles and join them with a new line and we gonna add their id
      .setColor("2F3136") //invisible color hex is #2F3136
      .setFooter(
        `Page ${Math.ceil(currentIndex / pageSize) + 1}/${Math.ceil(
          message.guild.roles.cache
        .filter(r=> {
          if(r.managed || r.name == "@everyone") return false
          else return true
        }).size / 6
        )}`
      );
    //so we goona sort the roles by their actual position the lowest is the first and the highest is the last

    //if the message member doesnt have any roles we gonna send a message and return
    message.guild.roles.cache
        .filter(r=> {
          if(r.managed || r.name == "@everyone") return false
          else return true
        }).sort((a, b) => a.position - b.position)
        
    //gonna filter the managed roles and the everyone role
    if (message.guild.roles.cache
        .filter(r=> {
          if(r.managed || r.name == "@everyone") return false
          else return true
        }).filter(r=> {
      if(r.managed || r.name == "@everyone") return false
      else return true
    }) .size == 1)
      return interaction.reply({
        content: `Le serveur  n'a aucun rôle`,
        ephemeral: true,
      });
    let number = Math.random() * 100;

    let rowOfButtons = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("button3" + number)
        .setLabel("Back")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("button2" + number)
        .setLabel("Next")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("button1" + number)
        .setLabel("Remove All")
        .setStyle("DANGER")
    );
    let rowOfSelectMenu = new MessageActionRow();
    //we gonna create a select menu with user roles and we gonna add it to the row
    //the default placeholder is all the options of the select menu

    let menu = new MessageSelectMenu()
      .setCustomId("select" + number)
      .setMinValues(1)
      .setPlaceholder("Selectionne un role");
    //here we gonna cache the user roles and add them to the select menu
    //we gonna add all the roles in the guild so if the option is selected it add them
    menu.addOptions(
      message.guild.roles.cache
        .filter(r=> {
          if(r.managed || r.name == "@everyone") return false
          else return true
        }).sort((a, b) => a.position - b.position)
        

      .map((role)=> {
        return {
          label : role.name,
          value : role.id
        }
      }).slice(currentIndex, currentIndex + 6)
    )

    //make the options already selected if the user have already the roles we can use the map function
    menu.options = menu.options.map((option) => {
      if (member.roles.cache.has(option.value)) option.default = true;
      return option;
    });
    function update(i) {
      rowOfSelectMenu.components[0].options = message.guild.roles.cache
        .filter(r=> {
          if(r.managed || r.name == "@everyone") return false
          else return true
        }).sort((a, b) => a.position - b.position)
        .map((role) => {
          return {
            label: role.name,
            value: role.id,
          };
        })
        .slice(currentIndex, currentIndex + 6);
        //make the options already selected if the user have already the roles we can use the map function
      rowOfSelectMenu.components[0].options = rowOfSelectMenu.components[0].options.map((option) => {
        if (member.roles.cache.has(option.value)) option.default = true;
        return option;
      });
      rowOfButtons.components[0].setDisabled(currentIndex <= 0);
      i.update({
        ephemeral: true,
        embeds: [embed],
        components: [rowOfSelectMenu, rowOfButtons],
      }).then(() => {
        const collector = interaction.channel.createMessageComponentCollector({
          componentType: "SELECT_MENU",
          time: 60000,
        });
        const collector2 = interaction.channel.createMessageComponentCollector({
          componentType: "BUTTON",
          time: 60000,
        });
        collector2.on("collect", async (i) => {
          if (i.customId === "button1" + number) {
            //remove all member roles
            await member.roles.set([]).then(() => {
              

              embed.footer.text = `Page ${
                Math.ceil(currentIndex / pageSize) + 1
              }/${Math.ceil(message.guild.roles.cache
        .filter(r=> {
          if(r.managed || r.name == "@everyone") return false
          else return true
        }).size / 6)}`;
      
              embed.description = `\`\`\`Information du membre\`\`\`\n${member} (\`${
                member.id
              }\`)\n\n\`\`\`Rôles actuel\`\`\`\n${
                member.roles.cache
                  .map((role) => `${role} (\`${role.id}\`)`)
                  .join("\n") || "Aucun rôle"
              }`;
              i.update({
                ephemeral: true,
                embeds: [embed],
                components: [rowOfSelectMenu, rowOfButtons],
              });
            });
            //update the select menu
          }
          if (i.customId === "button2" + number) {
            currentIndex += 6;
            if (currentIndex > message.guild.roles.cache
        .filter(r=> {
          if(r.managed || r.name == "@everyone") return false
          else return true
        }).size - 1) currentIndex = 0;
            rowOfSelectMenu.components[0].options = message.guild.roles.cache
        .filter(r=> {
          if(r.managed || r.name == "@everyone") return false
          else return true
        })
            .map((role) => {
              return {
                label: role.name,
                value: role.id,
              };
            })
            .slice(currentIndex, currentIndex + 6);
            //make the options already selected if the user have already the roles we can use the map function
          rowOfSelectMenu.components[0].options = rowOfSelectMenu.components[0].options.map((option) => {
            if (member.roles.cache.has(option.value)) option.default = true;
            return option;
          });
            rowOfButtons.components[0].setDisabled(currentIndex <= 0);
            embed.description = `\`\`\`Information du membre\`\`\`\n${member} (\`${
              member.id
            }\`)\n\n\`\`\`Rôles actuel\`\`\`\n${
              member.roles.cache
                .map((role) => `${role} (\`${role.id}\`)`)
                .join("\n") || "Aucun rôle"
            }`;
            embed.footer.text = `Page ${
              Math.ceil(currentIndex / pageSize) + 1
            }/${Math.ceil(message.guild.roles.cache
        .filter(r=> {
          if(r.managed || r.name == "@everyone") return false
          else return true
        }).size / 6)}`;
            i.update({
              ephemeral: true,
              embeds: [embed],
              components: [rowOfSelectMenu, rowOfButtons],
            });
          }

          if (i.customId === "button3" + number) {
            currentIndex -= 6;
            if (currentIndex < 0) currentIndex = message.guild.roles.cache
        .filter(r=> {
          if(r.managed || r.name == "@everyone") return false
          else return true
        }).size - 1;
            rowOfSelectMenu.components[0].options = message.guild.roles.cache
        .filter(r=> {
          if(r.managed || r.name == "@everyone") return false
          else return true
        }).sort((a, b) => a.position - b.position)
            .map((role) => {
              return {
                label: role.name,
                value: role.id,
              };

            })
            .slice(currentIndex, currentIndex + 6);
            //make the options already selected if the user have already the roles we can use the map function
          rowOfSelectMenu.components[0].options = rowOfSelectMenu.components[0].options.map((option) => {
            if (member.roles.cache.has(option.value)) option.default = true;
            return option;
          });
            rowOfButtons.components[0].setDisabled(currentIndex <= 0);
            embed.description = `\`\`\`Information du membre\`\`\`\n${member} (\`${
              member.id
            }\`)\n\n\`\`\`Rôles actuel\`\`\`\n${
              member.roles.cache
                .map((role) => `${role} (\`${role.id}\`)`)
                .join("\n") 
            }`;
            embed.footer.text = `Page ${
              Math.ceil(currentIndex / pageSize) + 1
            }/${Math.ceil(message.guild.roles.cache
        .filter(r=> {
          if(r.managed || r.name == "@everyone") return false
          else return true
        }).size / 6)}`;

            i.update({
              ephemeral: true,
              embeds: [embed],
              components: [rowOfSelectMenu, rowOfButtons],
            });
          }
        });

        collector.on("collect", async (i) => {
          if (i.customId === "select" + number) {
        
            //gonna filter the new options selected options and the old options selected and then check for the difference
            const newOptions = i.values;
            const oldOptions = rowOfSelectMenu.components[0].options.filter((option) => option.default).map((option) => option.value);
            const optionsToAdd = newOptions.filter((option) => !oldOptions.includes(option));
            const optionsToRemove = oldOptions.filter((option) => !newOptions.includes(option));
            //then we gonna add the new roles and remove the old roles
            for (let value of optionsToAdd) {
              if (member.roles.highest.position < message.guild.roles.cache.get(value).position) {
                return   update(i);
                }
              await member.roles.add(value).catch((err) =>
                { }
              );
            }
            for (let value of optionsToRemove) {
              if (member.roles.highest.position < message.guild.roles.cache.get(value).position) {
                return   update(i);
                }
              await member.roles.remove(value).catch((err) =>
    
                { }
              );
            }
            embed.description = `\`\`\`Information du membre\`\`\`\n${member} (\`${
              member.id
            }\`)\n\n\`\`\`Rôles actuel\`\`\`\n${
              member.roles.cache
    
    
                .map((role) => `${role} (\`${role.id}\`)`)
                
                .join("\n") || "Aucun rôle"
            }`;
    
    
    
    
    
    
            update(i);
            collector.stop();
            collector2.stop();
          }
        });
      });
    }

    rowOfSelectMenu.addComponents(menu);

    rowOfButtons.components[0].setDisabled(currentIndex <= 0);
    await interaction.reply({
      ephemeral: true,
      embeds: [embed],
      components: [rowOfSelectMenu, rowOfButtons],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      componentType: "SELECT_MENU",
      time: 60000,
    });
    const collector2 = interaction.channel.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 60000,
    });
    collector2.on("collect", async (i) => {
        if (i.customId === "button1" + number) {
            //remove all member roles
            await member.roles.set([]).then(() => {
             // update(i);

              embed.footer.text = `Page ${
                Math.ceil(currentIndex / pageSize) + 1
              }/${Math.ceil(message.guild.roles.cache
        .filter(r=> {
          if(r.managed || r.name == "@everyone") return false
          else return true
        }).size / 6)}`;
      
              embed.description = `\`\`\`Information du membre\`\`\`\n${member} (\`${
                member.id
              }\`)\n\n\`\`\`Rôles actuel\`\`\`\n${
                member.roles.cache
                  .map((role) => `${role} (\`${role.id}\`)`)
                  .slice(currentIndex, currentIndex + 6)
                  .join("\n") || "Aucun rôle"
              }`;
              i.update({
                ephemeral: true,
                embeds: [embed],
                components: [rowOfSelectMenu, rowOfButtons],
              });
            });
            //update the select menu
          }
      if (i.customId === "button2" + number) {
        currentIndex += 6;
        if (currentIndex > message.guild.roles.cache
        .filter(r=> {
          if(r.managed || r.name == "@everyone") return false
          else return true
        }).size - 1) currentIndex = 0;
        rowOfSelectMenu.components[0].options = message.guild.roles.cache
        .filter(r=> {
          if(r.managed || r.name == "@everyone") return false
          else return true
        }).sort((a, b) => a.position - b.position)
        .map((role) => {
          return {
            label: role.name,
            value: role.id,
          };
        })
        .slice(currentIndex, currentIndex + 6);
        //make the options already selected if the user have already the roles we can use the map function
      rowOfSelectMenu.components[0].options = rowOfSelectMenu.components[0].options.map((option) => {
        if (member.roles.cache.has(option.value)) option.default = true;
        return option;
      });
        //and check if the back button is disabled or not
        rowOfButtons.components[0].setDisabled(currentIndex <= 0);
        embed.description = `\`\`\`Information du membre\`\`\`\n${member} (\`${
          member.id
        }\`)\n\n\`\`\`Rôles actuel\`\`\`\n${
          member.roles.cache
            .map((role) => `${role} (\`${role.id}\`)`)
          //  .slice(currentIndex, currentIndex + 6)
            .join("\n") || "Aucun rôle"
        }`;
        embed.footer.text = `Page ${
          Math.ceil(currentIndex / 6) + 1
        }/${Math.ceil(message.guild.roles.cache
        .filter(r=> {
          if(r.managed || r.name == "@everyone") return false
          else return true
        }).size / 6)}`;
        i.update({
          ephemeral: true,
          embeds: [embed],
          components: [rowOfSelectMenu, rowOfButtons],
        });
      }
      //we gonan do the back button is basicly the same thing as the next button
      if (i.customId === "button3" + number) {
        currentIndex -= 6;
        rowOfSelectMenu.components[0].options = message.guild.roles.cache
        .filter(r=> {
          if(r.managed || r.name == "@everyone") return false
          else return true
        }).sort((a, b) => a.position - b.position)
        .map((role) => {
          return {
            label: role.name,
            value: role.id,
          };
        })
        .slice(currentIndex, currentIndex + 6);
        //make the options already selected if the user have already the roles we can use the map function
      rowOfSelectMenu.components[0].options = rowOfSelectMenu.components[0].options.map((option) => {
        if (member.roles.cache.has(option.value)) option.default = true;
        return option;
      });
        rowOfButtons.components[0].setDisabled(currentIndex <= 0);
        embed.description = `\`\`\`Information du membre\`\`\`\n${member} (\`${
          member.id
        }\`)\n\n\`\`\`Rôles actuel\`\`\`\n${
          member.roles.cache
            .map((role) => `${role} (\`${role.id}\`)`)
         
            .join("\n") || "Aucun rôle"
        }`;
        embed.footer.text = `Page ${
          Math.ceil(currentIndex / pageSize) + 1
        }/${Math.ceil(message.guild.roles.cache
        .filter(r=> {
          if(r.managed || r.name == "@everyone") return false
          else return true
        }).size / 6)}`;
        i.update({
          ephemeral: true,
          embeds: [embed],
          components: [rowOfSelectMenu, rowOfButtons],
        });
      }
    });
    collector.on("collect", async (i) => {
      if (i.customId === "select" + number) {
        
        //gonna filter the new options selected options and the old options selected and then check for the difference
        const newOptions = i.values;
        const oldOptions = rowOfSelectMenu.components[0].options.filter((option) => option.default).map((option) => option.value);
        const optionsToAdd = newOptions.filter((option) => !oldOptions.includes(option));
        const optionsToRemove = oldOptions.filter((option) => !newOptions.includes(option));
        //then we gonna add the new roles and remove the old roles
        for (let value of optionsToAdd) {

          //checking for position of the member and the role
          if (member.roles.highest.position < message.guild.roles.cache.get(value).position) {
          return   update(i);
          }

          await member.roles.add(value).catch((err) =>
            { }
          );
        }
        for (let value of optionsToRemove) {
          //checking for position of the member and the role
          if (member.roles.highest.position < message.guild.roles.cache.get(value).position) {
          return   update(i);
          }

          
        
          await member.roles.remove(value).catch((err) =>

            { }
          );
        }
        //and update the message
        embed.description = `\`\`\`Information du membre\`\`\`\n${member} (\`${
          member.id
        }\`)\n\n\`\`\`Rôles actuel\`\`\`\n${
          member.roles.cache


            .map((role) => `${role} (\`${role.id}\`)`)
            
            .join("\n") || "Aucun rôle"
        }`;







        update(i);
        collector.stop();
        collector2.stop();
      }
    });
  }

}
};
