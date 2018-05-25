module.exports = {
	id: "mentionable",
	aliases: ["mt", "mf", "togglementionable", "ment"],
	arguments: "(role)",
	requires: "Moderator permissions",
	execute: (call) => {
		const modRoles = ["436013049808420866", "436013613568884736", "402175094312665098", "330919872630358026"];
		const data = call.message.getData().get("data");
		const prefix = data != null ? data.prefix : "/";
		let role = call.params.readRole();
		if (call.message.member.roles.some(r => modRoles.includes(r.id))) {
			if (role) {
				var mentionToSet = (call.message.content.toLowerCase().startsWith(prefix + "mt")) ? true
					: (call.message.content.toLowerCase().startsWith(prefix + "mf")) ? false : !role.mentionable;
				role.setMentionable(mentionToSet).then(() => {
					call.message.delete().catch(function() {});
				}).catch(() => {
					call.message.reply(`There was an error changing the mentionability of the role \`${role.name}\` to \`${mentionToSet}\`.`).catch(() => {
						call.message.author.send(`You attempted to use the \`mt\` command in ${call.message.channel}, but I do not have permission to chat there.`)
							.catch(function() {});
					});
				});
			} else {
				call.message.reply("Invalid role. Please try again.").catch(() => {
					call.message.author.send(`You attempted to use the \`mt\` command in ${call.message.channel}, but I do not have permission to chat there.`)
						.catch(function() {});
				});
			}
		} else {
			call.message.reply("You do not have permission to use this command!").catch(() => {
				call.message.author.send(`You attempted to use the \`mt\` command in ${call.message.channel}, but I do not have permission to chat there.`)
					.catch(function() {});
			});
		}
	}
};
