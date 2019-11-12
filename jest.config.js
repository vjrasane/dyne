module.exports = {
  roots: ["<rootDir>/test"],
  coverageDirectory: "coverage",
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js|jsx)",
    "**/?(*.)+(spec|test).+(ts|tsx|js|jsx)"
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)?$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      // tsConfig: "tsconfig.test.json"
      tsConfig: {
        allowJs: true,
        esModuleInterop: true
      }
    }
  }
};
