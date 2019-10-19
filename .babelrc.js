const ROOT_PATH_SUFFIX = "./src";

module.exports = {
  presets: ["@babel/env", "@babel/typescript", "dyne"],
  plugins: [
    [
      "babel-plugin-root-import",
      {
        rootPathSuffix: ROOT_PATH_SUFFIX
      }
    ],
    "@babel/proposal-class-properties",
    "@babel/transform-runtime"
  ]
};
