module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ["prettier"],
  plugins: ["prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "no-undef": "error",
    "no-unused-vars": "warn"
  }
};
