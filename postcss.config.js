// postcss.config.js
module.exports = {
	plugins: {
		"postcss-easy-import": {},
		"postcss-nested": {},
		"postcss-custom-media": {
			"preserve": true,
		},
		"postcss-extend": {},
		"postcss-preset-env": {
			stage: 1,
			preserve: true
		}
	}
};
