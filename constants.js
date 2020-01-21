const Events = Object.freeze({
	BUFFER_UPDATE: 'buffer_update',
	KEYPRESS: 'keypress'
});

const Keys = Object.freeze({
	LINUX_C_KEY_LOWER: 99,
	LINUX_C_KEY_UPPER: 67,
	LINUX_X_KEY_UPPER: 88,
	LINUX_X_KEY_LOWER: 120,
	WIN_C_KEY: 67,
	WIN_X_KEY: 88
});

module.exports = Object.freeze({ Events, Keys });