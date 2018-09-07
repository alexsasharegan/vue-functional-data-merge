// @ts-nocheck
const path = require("path");
const typescript = require("rollup-plugin-typescript2");
const { terser } = require("rollup-plugin-terser");

const dist = path.join(__dirname, "dist");
const plugins = [typescript()];
if (process.env.NODE_ENV == "production") {
  plugins.push(terser());
}

module.exports = {
  input: path.resolve(__dirname, "src/index.ts"),
  plugins,
  output: [
    {
      format: "iife",
      name: "mergeData",
      file: path.resolve(dist, "lib.js"),
      sourcemap: true,
    },
    {
      format: "cjs",
      file: path.resolve(dist, "lib.common.js"),
      sourcemap: true,
    },
    {
      format: "es",
      file: path.resolve(dist, "lib.esm.js"),
      sourcemap: true,
    },
  ],
};
