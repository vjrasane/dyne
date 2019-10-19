const { join } = require("path");
const copy = require("gently-copy");

const sources = [join(__dirname, "../build/*")];
const target = join(__dirname, "../");

copy(sources, target);
