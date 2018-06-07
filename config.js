var config = {
	TOKEN: "NDExOTM0ODI1MTUxNDYzNDI0.DfoEUw.dhGjoT0AlXYDIUDDxTVukb5e8Fg",
	GOOGLE: process.env.GOOGLE_KEY,
	DB_CONNECTIONS: 20,
	DB: process.env.DB,
	CLIENT: {
		fetchAllMembers: true
	},
	NAMES: []
};
config.NAMES["330913265573953536"] = "Bro Bot (!help)";
config.NAMES["453694109819994114"] = "Test Bro Bot (!help)";
config.NAMES["398948242790023168"] = "Bro Time Kitchen";

try {
	var userConfig = require("./user_config");
	for (var [key, value] of Object.entries(userConfig))
		config[key] = value;
} catch (exc) {
	if (exc.code !== "MODULE_NOT_FOUND")
		throw exc;
}

module.exports = config;
