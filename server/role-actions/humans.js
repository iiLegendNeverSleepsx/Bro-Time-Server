module.exports = {
	aliases: ["everyone"],
	run: (call) => {
		const greedyParam = call.params.readParameter(true), roles = (greedyParam != null) ? greedyParam.split(",") : [];
		var rolesToChange = { rolesToAdd: [], rolesToRemove: [] };
		roles.forEach(role => {
			const ammToSlice = (role.trim().startsWith("+") || role.trim().startsWith("-")) ? 1 : 0;
			var newRole = call.message.guild.roles
				.find(r => r.id === role.trim().slice(ammToSlice) || r.name.toLowerCase().startsWith(role.trim().slice(ammToSlice).toLowerCase()));
			if (newRole != null && newRole.position < call.message.member.highestRole.position && newRole.position < call.message.guild.me.highestRole.position) {
				if (role.trim().startsWith("-")) rolesToChange.rolesToRemove.push(newRole);
				else rolesToChange.rolesToAdd.push(newRole);
			}
		});
		if (rolesToChange.rolesToAdd.concat(rolesToChange.rolesToRemove).length !== 0) {
			call.message.channel.send("Changing roles for all humans in this guild.")
				.catch(() => call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {}));
			call.message.guild.members.filter(member => !member.user.bot).forEach(member => {
				rolesToChange.rolesToRemove.forEach((role) => {
					member.removeRole(role);
				});
				rolesToChange.rolesToAdd.forEach((role) => {
					member.addRole(role);
				});
			});
		} else {
			call.message.reply("No valid roles were specified. Roles that are above your or my hierarchy can not be changed.").catch(() => {
				call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		}
	}
}
