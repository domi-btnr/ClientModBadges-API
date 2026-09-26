module.exports = function (config) {
  config.resolve = {
    ...config.resolve,
    extensionAlias: {
      ".js": [".ts", ".js"]
    }
  };

  return config;
}
