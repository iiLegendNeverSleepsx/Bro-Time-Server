module.exports = {
	id: "tictactoe",
	shortDescription: "Play tictactoe.",
	longDescription: "Play tictactoe, where the goal is to get 3 of your X / O in a row.",
	instructions: "React with the emoji corresponding to the grid square you wish to put your X / O in.",
	minPlayers: 2,
	maxPlayers: 2,
	requiresInvite: true,
	allowLateJoin: false,
	load: () => {},
	start: (session) => {
		const author = session.host;
		const target = session.players.last();
		var turn = [author, "❌"];
		var turnOp = [target, "⭕"];
		var eA = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣"];
		session.context.
			channel.send(`${eA[0]} | ${eA[1]} | ${eA[2]}\n———————\n${eA[3]} | ${eA[4]} | ${eA[5]}\n———————\n${eA[6]} | ${eA[7]} | ${eA[8]}\n\n${turn[0]}'s turn.`).then(async function(msg) {
				session.tictactoe = msg;
				for (var orderLoop = 0; orderLoop !== eA.length; orderLoop++) {
					await msg.react(eA[orderLoop]);
				}
				const filter = (reaction, user) => (user.id === author.id || user.id === target.id) && eA.includes(reaction.emoji.name);
				const reactions = msg.createReactionCollector(filter, { time: 300000 });

				reactions.on("collect", reaction => {
					if (reaction.users.last().id === turn[0].id) {
						eA.forEach(emoji => {
							if (emoji === reaction.emoji.name) {
								eA.splice(eA.indexOf(emoji), 1, turn[1]);
							}
						});

						turn = (turn[0].id === target.id) ? [author, "❌"] : [target, "⭕"];
						turnOp = (turnOp[0].id === author.id) ? [target, "❌"] : [author, "⭕"];

						msg.edit(`${eA[0]} | ${eA[1]} | ${eA[2]}\n———————\n${eA[3]} | ${eA[4]} | ${eA[5]}\n———————\n${eA[6]} | ${eA[7]} | ${eA[8]}\n\n${turn[0]}'s turn.`).then(() => {
							if ((eA[0] === eA[1] && eA[1] === eA[2]) || (eA[3] === eA[4] && eA[4] === eA[5]) || (eA[6] === eA[7] && eA[7] === eA[8]) ||
								(eA[0] === eA[3] && eA[3] === eA[6]) || (eA[1] === eA[4] && eA[4] === eA[7]) || (eA[2] === eA[5] && eA[5] === eA[8]) ||
								(eA[0] === eA[4] && eA[4] === eA[8]) || (eA[2] === eA[4] && eA[4] === eA[6])) {
								reactions.stop(`${turnOp[1]} won the game.`);
							} else if (eA.every(value => value === "❌" || value === "⭕")) {
								reactions.stop("It was a tie.");
							}
						});
					} else reaction.remove(reaction.users.last());
				});

				reactions.on("end", (collected, reason) => {
					msg.edit(`Interactive command ended: ${reason}\n${eA[0]} | ${eA[1]} | ${eA[2]}\n———————\n${eA[3]} | ${eA[4]} | ${eA[5]}\n———————\n${eA[6]} | ${eA[7]} | ${eA[8]}`);
					collected.first().message.channel.send(reason).catch(function() {});
				});
			});
	},
	input: (input, session) => {
		return input.type === "reaction" && input.value.message.id === session.tictactoe.id;
	},
	end: () => {},
};
