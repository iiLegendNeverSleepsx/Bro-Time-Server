module.exports = {
	id: "togglemulticolor",
	load: () => {},
	execute: (call) => {
		if (call.message.member.hasPermission("KICK_MEMBERS")) {
			const realGuild = call.client.guilds.get("330913265573953536");
			const multiColorRole = realGuild.roles.find("name", "Multicolored");
			const colors = ["Red", "Blue", "Orange", "Green", "Purple", "Pink", "Yellow", "HotPink",
				"Indigo", "Bronze", "Cyan", "LightGreen", "Silver", "BrightRed", "HotBrown",
				"DarkViolet", "Gold"
			];
			var loopNumber = 0;
			var offlineInRole;
			if (multiColorRole.hexColor === "#000001") {
				call.message.reply("The multicolored role is now in effect.").catch(() => {
					call.message.author
						.send(`You attempted to use the \`togglemulticolor\` role in ${call.message.channel}, but I can not chat there.`)
						.catch(function() {});
				});
				setInterval(function() {
					offlineInRole = multiColorRole.members.filter(member => member.presence.status === "offline");
					if (offlineInRole.size !== multiColorRole.members.size) {
						multiColorRole.setColor(realGuild.roles.find("name", colors[loopNumber]).hexColor).catch(function() {});
						loopNumber = loopNumber + 1;
						if (loopNumber === colors.length) loopNumber = 0;
					}
				}, 1000);
			} else {
				call.message.reply("The multicolored role is already in effect.").catch(() => {
					call.message.author
						.send(`You attempted to use the \`togglemulticolor\` role in ${call.message.channel}, but I can not chat there.`)
						.catch(function() {});
				});
			}
		} else {
			call.message.reply("You do not have permissions to run this command.").catch(() => {
				call.message.author
					.send(`You attempted to use the \`togglemulticolor\` role in ${call.message.channel}, but I can not chat there.`)
					.catch(function() {});
			});
		}
	}
};
