class Serial {
	constructor() {
		this.bSupported = 'serial' in navigator
		this.started = false

		this.sending = false
		this.queue = []
		this.onMessageCallbacks = []

		if (!this.bSupported) {
			console.error('Serial API non supported')
		} else {
			console.log('Serial API supported')
		}
	}

	async init(baudRate, bufferSize = 2048) {
		if (this.bSupported) {
			this.port = await navigator.serial.requestPort()
			await this.port.open({ baudRate: baudRate, bufferSize, dataBits: 8 })

			const decoder = new TextDecoderStream()
			this.port.readable.pipeTo(decoder.writable)
			this.reader = decoder.readable.getReader()

			const encoder = new TextEncoderStream()
			encoder.readable.pipeTo(this.port.writable)
			this.writer = encoder.writable.getWriter()

			this.started = true

			this.listen()
		}
	}

	write(data) {
		if (!this.port) {
			console.warn(`Cannot write "${data}". Port not open`)
			return
		}

		data = typeof data === 'string' ? [data] : data

		for (let i = 0, len = data.length; i < len; i++) {
			this.queue.push(data[i] + '\r\n')
		}

		if (!this.sending) {
			this.dequeue()
		}
	}

	dequeue() {
		if (this.port && this.queue.length > 0) {
			const data = this.queue.shift()
			console.log('dequeue2', data)
			this.sending = true
			this.writer.write(data).then(() => {
				this.sending = false
			})
		}
	}

	listen() {
		if (!this.port) {
			console.warn('port not open')
			return
		}

		const whileRead = async () => {
			try {
				const { value, done } = await this.reader.read()
				if (done) return false
				if (value && value.length) {
					value.split('\r\n').forEach(line => {
						line = line.trim()
						if (line && line.length > 0) {
							this.onMessageCallbacks.forEach(callback => callback(line))
						}
					})
					this.dequeue()
					return true
				}
			} catch (error) {
				console.log('error', error)
				return false
			}
		}

		const whileReadable = () => {
			if (this.port.readable) {
				if (whileRead()) {
					return requestAnimationFrame(whileReadable)
				}
				this.reader.releaseLock()
			}
		}

		requestAnimationFrame(whileReadable)
	}

	onMessage(callback) {
		this.onMessageCallbacks.push(callback)
	}

	offMessage(callback) {
		const index = this.onMessageCallbacks.indexOf(callback)
		if (index >= 0) {
			this.onMessageCallbacks.splice(index, 1)
		}
	}
}

export default Serial
