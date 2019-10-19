import { join } from "path";
import typescript from "rollup-plugin-typescript";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import { uglify } from "rollup-plugin-uglify";

const production = process.env.NODE_ENV === "production";

const plugins = [
  typescript(),
  resolve(),
  commonjs({
    include: "node_modules/**",
    extensions: [".js"],
    ignoreGlobal: false,
    sourceMap: false,
    namedExports: {},
    ignore: ["conditional-runtime-dependency"]
  }),
  babel({ runtimeHelpers: true }),
  production && uglify()
];

const sourcePath = "src";
const targetPath = "build";

const bundle = ([input, output]) => ({
  input: join(sourcePath, input),
  output: {
    file: join(targetPath, output),
    format: "cjs",
    exports: "named"
  },
  plugins,
  external: ["dyne-internals"]
});

export default [
  // main bundle
  ["index.js", "index.js"],
  // engine bundle
  ["engine/index.js", "engine.js"]
].map(bundle);
