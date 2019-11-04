import { join } from "path";
import typescript from "rollup-plugin-typescript2";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import { uglify } from "rollup-plugin-uglify";

import pkg from "./package.json";

const production = process.env.NODE_ENV === "production";

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
];

const plugins = [
  typescript({
    typescript: require("typescript")
  }),
  resolve(),
  commonjs({
    include: "node_modules/**",
    extensions: [".js"],
    ignoreGlobal: false,
    sourceMap: false,
    namedExports: {},
    ignore: ["conditional-runtime-dependency"]
  }),
  babel({ runtimeHelpers: true })
];

const sourcePath = "src";
const input = join(sourcePath, "index.ts");

export default [
  {
    input,
    output: {
      file: pkg.main,
      format: "cjs",
      exports: "named"
    },
    plugins: [...plugins, production && uglify()],
    external
  },
  {
    input,
    output: {
      file: pkg.module,
      format: "es",
      exports: "named"
    },
    plugins,
    external
  }
];
