import PlotterArea from './PlotterArea'
import Serial from './Serial'

const PEN_DOWN = 'PEN_DOWN'
const PEN_UP = 'PEN_UP'

class Plotter {
	constructor(settings) {
		this.settings = {
			Z_UP: 30,
			Z_DOWN: 0,
		}

		this.serial = new Serial()
		this.plotterArea = new PlotterArea(this.serial)
		this.penStatus = PEN_UP
	}

	async init() {
		await this.serial.init(115200)

		this.home()
	}

	useRelativePosition() {
		this.serial.write('G91')
	}

	useAbsolutePosition() {
		this.serial.write('G90')
	}

	home() {
		if (this.penStatus !== PEN_UP) this.penUp()

		this.serial.write('G28')
	}

	penUp() {
		if (this.penStatus !== PEN_UP) {
			this.penStatus = PEN_UP
			this.serial.write(`M3 S${this.settings.Z_UP}`)
		}
	}

	penDown() {
		if (this.penStatus !== PEN_DOWN) {
			this.penStatus = PEN_DOWN
			this.serial.write(`M3 S${this.settings.Z_DOWN}`)
		}
	}

	moveTo(x, y) {
		if (this.penStatus !== PEN_UP) this.penUp()
		this.serial.write(`X${x} Y${y}`)
		this.penUp()
	}

	lineTo(x, y, velocity = 1000) {
		if (this.penStatus !== PEN_DOWN) this.penDown()

		this.serial.write(`G1 X${x} Y${y} F${velocity}`)
	}
}

export default Plotter
