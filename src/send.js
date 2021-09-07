const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const readline = require('readline')

module.exports = (port, baudrate, gcodeCommands) => {
	const countCommands = gcodeCommands.length
	let completed = 0
	let sending = false
	let started = 0

	const serial = new SerialPort(port, {
		baudRate: baudrate,
	})

	const lineStream = serial.pipe(new Readline())

	lineStream.on('error', function (e) {
		console.log('error: ', e.message)
	})
	lineStream.on('data', function (data) {
		if (!started) {
			started = Date.now()
			setInterval(() => log(), 300)
		}

		dequeue()
	})

	serial.on('error', function (e) {
		console.log('error: ', e.message)
	})

	function timeToString(time) {
		if (isNaN(time)) return '∞'

		const hours = Math.floor(time / 3600)
		const minutes = Math.floor((time % 3600) / 60)
		const seconds = Math.floor(time % 60)

		return hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
	}

	function log() {
		const elapsed = (Date.now() - started) / 1000
		const remainings = countCommands - completed
		const enstimated = (elapsed / completed) * remainings
		const percentage = (completed / countCommands) * 100

		readline.clearLine(process.stdout, 0)
		readline.cursorTo(process.stdout, 0, null)

		process.stdout.write(
			`Send to ${port} ${baudrate}\tProgress: ${percentage.toFixed(
				2
			)}% (${completed}/${countCommands})\tElapsed: ${timeToString(elapsed)}\tEnstimated: ${timeToString(enstimated)}`
		)
	}

	function dequeue() {
		if (!sending && gcodeCommands.length > 0) {
			const command = gcodeCommands.shift()
			sending = true

			serial.write(command, () => {
				completed++
				sending = false
			})
		}

		if (gcodeCommands.length === 0) {
			process.exit(0)
		}
	}
}
