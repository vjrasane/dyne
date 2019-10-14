import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import { uglify } from "rollup-plugin-uglify";

const production = process.env.NODE_ENV === "production";

export default {
  input: "src/index.js",
  output: {
    file: "build/bundle.js",
    format: "cjs",
    exports: "named"
  },
  plugins: [
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
  ]
};
