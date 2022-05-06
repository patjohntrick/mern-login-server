module.exports = {
  resolve: {
    fallback: {
      buffer: require.resolve("buffer/"),
      crypto: require.resolve("crypto-browserify"),
      util: require.resolve("util/"),
      process: require.resolve("process/browser"),
      stream: require.resolve("stream-browserify"),
    },
  },
};
