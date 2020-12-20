import 'regenerator-runtime/runtime'

import Plotter from './src/Plotter'

const plotter = new Plotter()
let initted = false

async function init() {
	if (initted) return

	initted = true

	await plotter.init()

	// const result = document.querySelector('#result')
	// let i = 1
	// plotter.serial.onMessage(line => {
	// 	line = line
	// 		.replace(/&/g, '&amp;')
	// 		.replace(/</g, '&lt;')
	// 		.replace(/>/g, '&gt;')
	// 		.replace(/"/g, '&quot;')
	// 		.replace(/'/g, '&#039;')
	// 	result.innerHTML = `<li><small>${++i}</small> ${line}</li>` + result.innerHTML
	// })

	const input = document.querySelector('#input')
	input.addEventListener('keydown', async e => {
		if (e.keyCode === 13) {
			plotter.serial.write(input.value)
			input.value = ''
		}
	})

	window.addEventListener('beforeunload', e => {
		e.preventDefault()
		plotter.home()
	})
	window.addEventListener('unload', e => {
		e.preventDefault()
		plotter.home()
	})

	document.getElementById('penup').addEventListener('click', () => {
		plotter.penUp()
	})
	document.getElementById('pendown').addEventListener('click', () => {
		plotter.penDown()
	})
	document.getElementById('home').addEventListener('click', () => {
		plotter.home()
	})

	// const rect = document.getElementById('rect')
	// const context = rect.getContext('2d')
	// rect.width = 200
	// rect.height = 200
	// rect.style.width = '200px'
	// rect.style.height = '200px'
	// rect.style.background = 'red'
	// rect.style.position = 'fixed'
	// rect.style.top = '20px'
	// rect.style.right = '20px'
	// const box = rect.getBoundingClientRect()

	// context.fillStyle = '#eee'
	// context.fillRect(0, 0, 200, 200)
	// rect.addEventListener('mousemove', e => {
	// 	const x = e.clientX - box.x
	// 	const y = e.clientY - box.y

	// 	plotter.lineTo(x / 5, y / 5)

	// 	context.fillStyle = '#000'
	// 	context.fillRect(x, y, 1, 1)
	// })

	setTimeout(() => draw(plotter), 2000)
}

function draw(plotter) {
	const scene = new Urpflanze.Scene({
		width: 110,
		height: 190,
	})

	const lines = new Urpflanze.Line({
		repetitions: [60, 1],
		sideLength: () => 50, // Add a function for dynamic generation
		distance: [1, 0],
		vertexCallback: (vertex, vertexRepetition, propArguments) => {
			const y = propArguments.context.noise(
				'seed',
				vertexRepetition.offset * 4,
				propArguments.repetition.row.offset * 3,
				propArguments.time / 1000
			)

			vertex[1] += y * 10
		},
	})

	scene.add(lines)

	// Subdivide lines for add points
	lines.subdivide(6)

	const { minX, maxX, minY, maxY } = calculateRect(scene)

	plotter.moveTo(minX, minY)
	plotter.moveTo(maxX, minY, 5000)
	plotter.moveTo(maxX, maxY, 5000)
	plotter.moveTo(minX, maxY, 5000)
	plotter.moveTo(minX, minY, 5000)

	scene.currentTime = 0
	const sceneChilds = scene.getChildren()

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

			plotter.moveTo(childBuffer[vertexIndex], childBuffer[vertexIndex + 1])

			vertexIndex += 2
			for (let len = vertexIndex + currentIndexing.frameLength - 2; vertexIndex < len; vertexIndex += 2) {
				// console.log('asdas', childBuffer[vertexIndex], childBuffer[vertexIndex + 1])
				plotter.lineTo(childBuffer[vertexIndex], childBuffer[vertexIndex + 1], 5000)
			}

			// if (currentIndexing.shape.isClosed())
			// plotter.lineTo(childBuffer[vertexIndex], childBuffer[vertexIndex + 1])
		}
	}

	plotter.home()
}

function calculateRect(scene) {
	let maxX = Number.MIN_VALUE
	let minX = Number.MAX_VALUE
	let maxY = Number.MIN_VALUE
	let minY = Number.MAX_VALUE

	const sceneChilds = scene.getChildren()

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

			// if (currentIndexing.shape.isClosed())
			// plotter.lineTo(childBuffer[vertexIndex], childBuffer[vertexIndex + 1])
		}
	}

	return {
		minX,
		maxX,
		minY,
		maxY,
	}
}

document.addEventListener('click', () => init())
