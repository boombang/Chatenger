"use strict";

module.exports = {
  port: "3000",

  isDevMode() {
    return !process.env.NODE_ENV || process.env.NODE_ENV === "development";
  },

  isProductionMode() {
    return process.env.NODE_ENV === "production";
  },

  isTestMode() {
    return process.env.NODE_ENV === "test";
  },

  sessions: {
		cookie: {
			// session expiration is set by default to one week
			maxAge: 7 * 24 * (60 * 60 * 1000),

			// httpOnly flag makes sure the cookie is only accessed
			// through the HTTP protocol and not JS/browser
			httpOnly: true,

			// secure cookie should be turned to true to provide additional
			// layer of security so that the cookie is set only when working
			// in HTTPS mode.
      secure: false
		},

		// Cookie key name
		name: "sessionId",

		// Mongo store collection name
		collection: "sessions"
	},
};
