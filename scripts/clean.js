#!/usr/bin/env node
const { promisify } = require("util")
const { resolve } = require("path")
const rimraf = require("rimraf")

const ToDelete = [resolve(__dirname, "../dist")]

function rimraf_promise(...args) {
	return new Promise((resolve, reject) => {
		rimraf(...args, err => {
			if (err) {
				return reject(err)
			}
			resolve()
		})
	})
}

async function rmDir(dirPath) {
	console.info(`Cleaning directory: ${dirPath}`)
	try {
		return await rimraf_promise(dirPath)
	} catch (err) {
		console.error(err)
	}
}

async function main(dirs) {
	try {
		return await Promise.all(dirs.map(rmDir))
	} catch (err) {
		console.error(err)
	}
}

main(ToDelete)
