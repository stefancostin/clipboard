const Events = Object.freeze({
	BUFFER_UPDATE: 'buffer_update',
	KEYPRESS: 'keypress'
});

const Keys = Object.freeze({
	RAWCODE_C_KEY_LOWER: 99,
	RAWCODE_C_KEY_UPPER: 67,
	RAWCODE_X_KEY_UPPER: 88,
	RAWCODE_X_KEY_LOWER: 120,
	KEYCODE_C_KEY: 67,
	KEYCODE_X_KEY: 88
});

module.exports = Object.freeze({ Events, Keys });