const path = require("path");
module.exports = {
  entry: [
    "./js/util.js",
    "./js/load.js",
    "./js/table.js",
    "./js/pagination.js",
    "./js/description.js",
    "./js/search.js",
    "./js/navbar-actions.js",
    "./js/error-message.js",
    "./js/main.js"
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
    iife: true
  },
  devtool: false
};
