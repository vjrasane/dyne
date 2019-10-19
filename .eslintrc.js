module.exports = {
  env: {
    node: true,
    jest: true
  },
  extends: ["prettier", "dyne"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "no-undef": "error",
    "no-unused-vars": "warn"
  }
};
