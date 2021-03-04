class DrawerGCode {
	constructor(scene, settings) {
		this.settings = {
			startX: settings.startX ?? 0,
			startY: settings.startY ?? 0,
			maxX: settings.maxX ?? 297,
			maxY: settings.maxY ?? 210,
			velocity: settings.velocity ?? 1000,
			pointUp: settings.pointUp ?? 30,
			pointDown: settings.pointDown ?? 0,
		}

		this.scene = scene
	}

	useRelativePosition() {
		return 'G91'
	}

	useAbsolutePosition() {
		return 'G90'
	}

	home() {
		return [this.penUp(), 'G28 X0 Y0']
	}

	round(value) {
		return Math.round(value * 100) / 100
	}

	setCurrentMachinePosition(x, y) {
		return `G28.1 X${this.round(x)} Y${this.round(y)}`
	}
	setCurrentWorkspacePosition(x, y) {
		return `G92 X${this.round(x)} Y${this.round(y)}`
	}

	penUp() {
		return `M3 S${this.settings.pointUp}`
	}

	penDown() {
		return `M3 S${this.settings.pointDown}`
	}

	moveTo(x, y) {
		return [this.penUp(), `G0 X${this.round(x)} Y${this.round(y)}`, this.penDown()]
	}

	lineTo(x, y) {
		return `G1 X${this.round(x)} Y${this.round(y)} F${this.settings.velocity}`
	}

	concat(result, data) {
		if (typeof data === 'string') result.push(data)
		else data.forEach(line => result.push(line))
	}

	generate() {
		const sceneBounding = this.getSceneBounding()

		const scale = Math.max(this.scene.width, this.scene.height) / Math.min(this.settings.maxX, this.settings.maxY)
		// const offset = [sceneBounding.minX / scale, sceneBounding.minY / scale]
		const offset = [0, 0]
		const gcode = []

		this.concat(gcode, this.useAbsolutePosition())

		this.concat(gcode, this.penUp())
		this.concat(gcode, this.setCurrentMachinePosition(0, 0))
		this.concat(gcode, this.setCurrentWorkspacePosition(0, 0))

		this.scene.update(0)
		const sceneChilds = this.scene.getChildren()

		for (let i = 0, len = sceneChilds.length; i < len; i++) {
			sceneChilds[i].generate(0, true)

			const childBuffer = sceneChilds[i].getBuffer()
			const childIndexedBuffer = sceneChilds[i].getIndexedBuffer()

			for (
				let currentBufferIndex = 0, vertexIndex = 0, len = childIndexedBuffer.length;
				currentBufferIndex < len;
				currentBufferIndex++
			) {
				const currentIndexing = childIndexedBuffer[i]

				const startX = Urpflanze.clamp(
					this.settings.minX,
					this.settings.maxX,
					childBuffer[vertexIndex] / scale + offset[0]
				)
				const startY = Urpflanze.clamp(
					this.settings.minY,
					this.settings.maxY,
					childBuffer[vertexIndex + 1] / scale + offset[1]
				)

				this.concat(gcode, this.moveTo(startX, startY))

				vertexIndex += 2
				for (let len = vertexIndex + currentIndexing.frameLength - 2; vertexIndex < len; vertexIndex += 2) {
					const currentX = Urpflanze.clamp(
						this.settings.minX,
						this.settings.maxX,
						childBuffer[vertexIndex] / scale + offset[0]
					)
					const currentY = Urpflanze.clamp(
						this.settings.minY,
						this.settings.maxY,
						childBuffer[vertexIndex + 1] / scale + offset[1]
					)

					this.concat(gcode, this.lineTo(currentX, currentY))
				}

				if (currentIndexing.shape.isClosed()) this.concat(gcode, this.lineTo(startX, startY))
			}
		}

		this.concat(gcode, this.home())

		return gcode
	}

	getSceneBounding() {
		let maxX = Number.MIN_VALUE
		let minX = Number.MAX_VALUE
		let maxY = Number.MIN_VALUE
		let minY = Number.MAX_VALUE

		const sceneChilds = this.scene.getChildren()

		for (let i = 0, len = sceneChilds.length; i < len; i++) {
			sceneChilds[i].generate(0, true)

			const childBuffer = sceneChilds[i].getBuffer()
			const childIndexedBuffer = sceneChilds[i].getIndexedBuffer()

			for (
				let currentBufferIndex = 0, vertexIndex = 0, len = childIndexedBuffer.length;
				currentBufferIndex < len;
				currentBufferIndex++
			) {
				const currentIndexing = childIndexedBuffer[i]

				if (minX > childBuffer[vertexIndex]) minX = childBuffer[vertexIndex]
				if (maxX < childBuffer[vertexIndex]) maxX = childBuffer[vertexIndex]
				if (minY > childBuffer[vertexIndex + 1]) minY = childBuffer[vertexIndex + 1]
				if (maxY < childBuffer[vertexIndex + 1]) maxY = childBuffer[vertexIndex + 1]

				vertexIndex += 2
				for (let len = vertexIndex + currentIndexing.frameLength - 2; vertexIndex < len; vertexIndex += 2) {
					if (minX > childBuffer[vertexIndex]) minX = childBuffer[vertexIndex]
					if (maxX < childBuffer[vertexIndex]) maxX = childBuffer[vertexIndex]
					if (minY > childBuffer[vertexIndex + 1]) minY = childBuffer[vertexIndex + 1]
					if (maxY < childBuffer[vertexIndex + 1]) maxY = childBuffer[vertexIndex + 1]
				}
			}
		}

		return {
			minX,
			maxX,
			minY,
			maxY,
		}
	}
}

export default DrawerGCode
