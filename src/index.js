const fs = require('fs')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const send = require('./send')
const { getPorts } = require('./utilities')
const path = require('path')

const argv = yargs(hideBin(process.argv)).argv
const args = argv._

getPorts().then(ports => {
	if (args.length < 3) {
		console.error(`Usage: <port> <baudRate> <commands>\nPorts: ${ports.join(', ')}`)
		process.exit(1)
	}

	if (ports.length === 0) {
		console.error(`No device connecteds`)
		return
	}

	let port = args[0]

	if (args[0] === '*') port = ports[0]
	else if (!ports.includes(port)) {
		console.error(`Port '${port}' not found.\nPorts: ${ports.join(', ')}`)
		process.exit(1)
	}

	const baudrate = parseInt(args[1])
	if (baudrate === NaN) {
		console.error(`BaudRate '${args[1]}' not valid.`)
		process.exit(1)
	}

	const file = path.resolve(args[2])

	if (!fs.existsSync(file)) {
		console.error(`File '${args[2]}' not found.`)
		process.exit(1)
	}

	const gcode = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' })
	const commands = gcode.split('\n').map(command => command + '\r\n')

	send(port, baudrate, commands)
})
