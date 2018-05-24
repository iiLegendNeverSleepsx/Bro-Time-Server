const Discord = require("discord.js");
const fs = require("fs");
module.exports = {
	exec: (client) => {
		var roles = [
			"ANN", "Newbie Bro", "White"
		];
		const hangoutChannel = client.channels.find("id", "433831764105101332");
		client.on("guildMemberAdd", member => {
			if (client.user.id === "393532251398209536") {
				if (member.guild.id === "330913265573953536") {
					var rolestoadd = roles.map(r => member.guild.roles.find("name", r).id);
					if (!member.user.bot) {
						member.addRoles(rolestoadd).catch(function() {});
						const welcomeMessage = new Discord.RichEmbed()
							.setTitle("Welcome")
							.setColor("#FFA500")
							.setDescription(`Welcome to Bro Time ${member.user}! Have a good time here!`)
							.setFooter(`Bro Time is now at ${member.guild.memberCount} members!`);
						hangoutChannel.send({ embed: welcomeMessage }).then(() => {
							fs.readFile(__dirname + "/./../info/welcomemsg.md", (err, data) => {
								if (err) {
									throw err;
								} else {
									member.user.send(data.toString("utf8")).catch(function() {});
								}
							});
						}).catch(function() {});
					} else {
						var botrole = member.guild.roles.get("330966583214211072");
						member.addRole(botrole).catch(function() {});
					}
				}
			}
		});
		client.on("guildMemberRemove", member => {
			if (client.user.id === "393532251398209536") {
				if (member.guild.id === "330913265573953536") {
					if (!member.user.bot) {
						const goodbyeMessage = new Discord.RichEmbed()
							.setTitle("Goodbye")
							.setColor("#0000ff")
							.setDescription(`Sad to see you leave ${member.user}.`);
						hangoutChannel.send({ embed: goodbyeMessage }).catch(function() {});
					}
				}
			}
		});
	}
};
