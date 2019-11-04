const rootPathSuffix = "./src";

module.exports = {
  presets: ["@babel/env", "@babel/typescript", "dyne"],
  plugins: [
    ["babel-plugin-root-import", { rootPathSuffix }],
    "@babel/proposal-class-properties",
    "@babel/transform-runtime"
  ]
};
