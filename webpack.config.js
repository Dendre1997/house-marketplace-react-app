const path = require('path');

module.exports = {
  // Other configurations...
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "crypto": require.resolve("crypto-browserify"),
      util: require.resolve("util/"),
      fs: require.resolve("browserify-fs"),
    }
  }
};
