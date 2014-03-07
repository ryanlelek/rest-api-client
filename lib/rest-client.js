
'use strict';

// Modules
var request	= require('request');
var _		= require('lodash');

module.exports = {

	new : function (global_settings) {

		var get_settings = function () {
			return JSON.parse(JSON.stringify(global_settings));
		};

		return {

			go : function (method, endpoint, parameters, callback) {

				// Grab a new copy of settings
				var settings = get_settings();

				var configuration = {
					url				: settings.host + endpoint,
					method			: method,
					headers			: settings.headers,
					qs				: parameters.qs,
					json			: parameters.json,
					// #####
					strictSSL		: settings.verifySSL || true,
					followRedirect	: false
				};

				if (parameters.headers) {
					_.forIn(parameters.headers, function (value, key) {
						if (value === null) {
							delete configuration.headers[key];
						} else {
							configuration.headers[key] = value;
						}
					});
				}

				// Overwrite
				if (parameters.authentication) {
					settings.authentication = parameters.authentication;
				}

				if (settings.authentication) {
					configuration.auth = {
						username		: settings.authentication.username,
						password		: settings.authentication.password,
						sendImmediately	: true
					};
				}

				// Execute
				request(configuration, function (error, response, body) {

					// Parse JSON body, if not done automatically
					if ((typeof body === 'string') && (body.substring(0, 1) === '{')) {
						body = JSON.parse(body);
					}

					// Return
					return callback(error, response, body);

				});

			}

		};

	}

};