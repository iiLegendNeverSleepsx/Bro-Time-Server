var SPACE = "\\s,";
var QUOTES = "\"'";

class Paramaters {
	constructor(message) {
		this.sep = new RegExp(`[${SPACE}]`, "y");
		this.sepGreedy = new RegExp(`[${SPACE}]+`, "y");
		this.param = new RegExp(`([${QUOTES}]).*?\\1|[^${SPACE}]+`, "y");
		this.paramGreedy = new RegExp(`([${QUOTES}]).*?\\1|[^${QUOTES}]+`, "y");
		this.raw = message.content;
		// Store the client for user access.
		this.client = message.client;
		// Store the guild for role access.
		this.guild = message.guild;
		this.index = 0;
	}

	static normalizeParam(str) {
		if (str.length > 1)
			str.trim().replace(new RegExp(`^[${QUOTES}]|[${QUOTES}]$`), "");
		return str;
	}

	offset(offset) {
		this.index += offset;
	}

	readRaw() {
		return this.raw.substring(this.index);
	}

	readSeparator(greedy = true) {
		this.sep.lastIndex = this.index;
		this.sepGreedy.lastIndex = this.index;
		var match = this.raw.match(greedy ? this.sepGreedy : this.sep);
		var value;
		if (match !== null) {
			this.index += match[0].length;
			value = match[0];
		}
		return value || null;
	}

	readParameter(greedy = false) {
		var pattern = greedy ? this.paramGreedy : this.param;
		pattern.lastIndex = this.index;
		var match = this.raw.match(pattern);
		var value;
		if (match != null) {
			value = match[0];
			this.index += value.length;
			value = Paramaters.normalizeParam(value);
			this.readSeparator();
		}
		return value || null;
	}

	readWord(classes = "") {
		var pattern = new RegExp(`[${classes}a-zA-Z]+`, "y");
		pattern.lastIndex = this.index;
		var match = this.raw.match(pattern);
		var value;
		if (match !== null) {
			value = match[0];
			this.index += value.length;
		}
		return value || null;
	}

	readNumber() {
		var param = this.readParameter();
		var value;
		if (param !== null) {
			var number = parseFloat(param);
			if (!isNaN(number)) {
				value = number;
			}
		}
		return value || null;
	}

	readObject(objects, name = "name", mentions = /(.+)/, allowPartial = true, filter = () => { return true; }) {
		var param = (this.readParameter(true) || "").toLowerCase();
		var mention = param.match(mentions);
		var object;
		var gap = Infinity;
		if (mention !== null) {
			param = mention[1];
		}
		objects = objects.filter(filter);
		var id = parseFloat(param);

		if (!isNaN(id)) {
			object = object.get(id);
		} else {
			objects.forEach((candidate) => {
				if (candidate[name].toLowerCase().includes(param)) {
					// Calculate the gap between the match.
					var newGap = candidate[name].length - param.length;
					// Only allow smaller gaps or if partial results are allowed, no gap.
					if (newGap < gap && (allowPartial || gap === 0)) {
						object = candidate;
						gap = newGap;
					}
				}
			});
		}

		return object || null;
	}

	readUser(allowPartial = true, filter = () => { return true; }) {
		return this.readObject(this.client.users, "username", /<@!?(\d+)>/, allowPartial, filter);
	}

	readRole(allowPartial = true, filter = () => { return true; }) {
		return this.readObject(this.guild.roles, "name", /<@&(\d+)>/, allowPartial, filter);
	}

	readChannel(allowPartial = true, filter = () => { return true; }) {
		return this.readObject(this.guild.channels, "name", /<#(\d+)>/, allowPartial, filter);
	}
}

module.exports = Paramaters;
