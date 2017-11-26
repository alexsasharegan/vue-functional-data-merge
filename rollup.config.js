const path = require("path")
const typescript = require("rollup-plugin-typescript2")
const uglify = require("rollup-plugin-uglify")
const { minify } = require("uglify-es")

const dist = path.resolve(__dirname, "dist")
const name = "lib"
const plugins = [typescript()]

if (process.env.NODE_ENV == "production") {
	plugins.push(uglify({}, minify))
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
}
