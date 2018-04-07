var config = require("../config");
var fs = require("fs");
var discord = require("discord.js");
var report = require("app/report");

var loaders = [];
var areaLoaders = [];
var chatHandlers = [];

fs.readdirSync(__dirname + "/chat").forEach(file => {
	var match = file.match(/^(.*)\.js$/);
	if (match !== null) {
		new Promise((resolve, reject) => {
			try {
				resolve(require("./chat/" + match[1]));
			} catch (exc) {
				reject(exc);
			}
		}).then(handler => {
			chatHandlers.push(handler);
		}, exc => {
			report(exc, {tags: {category: "chat", action: "load", item: match[1]}});
		});
	}
});
fs.readdirSync(__dirname + "/load").forEach(file => {
	var match = file.match(/^(.*)\.js$/);
	if (match !== null)
		loaders.push(require("./load/" + match[1]));
});
fs.readdirSync(__dirname + "/areaLoad").forEach(file => {
	var match = file.match(/^(.*)\.js$/);
	if (match !== null)
		areaLoaders.push(require("./areaLoad/" + match[1]));
});
for (let token in config.BOTS) {
	if (token !== "undefined") {
		let settings = config.BOTS[token];
		let client = new discord.Client();
		let loadedAreas = new discord.Collection();

		client.on("ready", () => {
			console.log("Loading " + client.user.username);
			loaders.forEach(loader => {
				loader.exec(client, settings);
			});
			console.log("Finished loading " + client.user.username);
		});

		client.on("message", message => {
			if (!message.author.bot) {
				var area = message.channel.guild || message.channel;
				var isServer = !(area instanceof discord.Channel);
				var task = () => {
					if (isServer)
						loadedAreas.set(area.id, true);
					message.data = area.data;
					// Process the message.
					for (var i = 0; i < chatHandlers.length; i++) {
						try {
							if (chatHandlers[i].exec(message, client))
								break;
						} catch (exc) {
							report(exc, {tags: {category: "chat", action: "execute", item: chatHandlers[i].id}});
						}
					}
				};
				// Load area data.
				if (!isServer || !loadedAreas.has(area.id)) {
					let promises = [];
					for (var i = 0; i < areaLoaders.length; i++)
						promises.push(areaLoaders[i].exec(area, client));
					Promise.all(promises).then(task).catch((exc) => {
						report(exc, {tags: {category: "areaLoad", action: "load"}});
						message.reply("Unable to load. Retry in a few seconds.");
						if (isServer)
							loadedAreas.delete(area.id);
					});
				} else {
					task();
				}
			}
		});

		client.login(token);

		process.on("SIGTERM", async () => {
			await client.destroy();
		});
	} else {
		console.log("Skipped missing token.");
	}
}
