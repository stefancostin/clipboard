const keys = Object.freeze({

	linux: Object.freeze({
		cKey: 99,
		vKey: 118
	}),

	windows: Object.freeze({
		cKey: 67,
		vKey: 86
	})

});


// const keys = Object.freeze({
// 	linux: {
// 		cKey: 99,
// 		vKey: 118
// 	},
// 	windows: {
// 		cKey: 67,
// 		vKey: 86
// 	}
// });

module.exports = Object.freeze({ keys });