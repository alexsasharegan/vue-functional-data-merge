const path = require("path")
const typescript = require("rollup-plugin-typescript2")
const uglify = require("rollup-plugin-uglify")
const { minify } = require("uglify-es")

const dist = path.resolve(__dirname, "dist")
const name = "lib"
const moduleName = "mergeData"

module.exports = {
    entry: path.resolve(__dirname, "src/index.ts"),
    plugins: [typescript(), uglify({}, minify)],
    targets: [
        {
            format: "iife",
            moduleName,
            dest: path.resolve(dist, name + ".js"),
            sourceMap: true
        },
        {
            format: "cjs",
            dest: path.resolve(dist, name + ".common.js"),
            sourceMap: true
        },
        {
            format: "es",
            dest: path.resolve(dist, name + ".esm.js"),
            sourceMap: true
        }
    ]
}
