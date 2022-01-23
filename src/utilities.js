const SerialPort = require('serialport')

const getPorts = () => {
	return new Promise((resolve, reject) => {
		const portsList = []

		SerialPort.list()
			.then(ports => {
				ports.forEach(port => {
					if (Object.values(port).filter(e => e).length > 1) portsList.push(port.path)
				})

				resolve(portsList)
			})
			.catch(reject)
	})
}

module.exports = {
	getPorts,
}
