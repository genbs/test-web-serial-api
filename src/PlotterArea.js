class PlotterArea {
	constructor(serial) {
		this.serial = serial
		this.waitSetting()
	}

	waitSetting() {
		const settings = {
			maxAccX: 110,
			maxAccY: 111,
			xAcc: 120,
			yAcc: 121,
			maxY: 130,
			maxY: 131,
		}
		const settingsKeys = Object.keys(settings)

		const settingsCallback = line => {
			settingsKeys.forEach(settingsKey => {
				const reg = new RegExp(`^\$${settings[settingsKey]}=(\d*\.?\d*)`, 'ig')
				const match = reg.exec(line)
				console.log(line, match)
			})
		}

		this.serial.onMessage(settingsCallback)
	}
}

export default PlotterArea
