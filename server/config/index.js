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
  }
};
