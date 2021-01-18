const { Module } = require("module");

exports.getDate = function () {
  const today = new Date();

  const dateFormat = {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  };

  return today.toLocaleDateString("en-us", dateFormat);
};
