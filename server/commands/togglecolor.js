module.exports = {
	multicolor: true,
	id: "togglecolor",
	load: () => {},
	execute: (call) => {
		if (call.message.member.hasPermission("MANAGE_ROLES")) {
			if (call.client.multicolor) {
				multicolor = false;
			} else {
				multicolor = true;
			}
			call.message.channel.send(`Toggled the multicolor role to \`${this.multicolor}\`.`);
		}
	}
};
