const ROOT_PATH_SUFFIX = "./src";

module.exports = {
  presets: ["@babel/env"],
  plugins: [
    [
      "babel-plugin-root-import",
      {
        rootPathSuffix: ROOT_PATH_SUFFIX
      }
    ],
    "@babel/transform-typescript",
    "@babel/proposal-class-properties",
    "@babel/transform-runtime"
  ]
};
