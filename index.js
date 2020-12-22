import DrawerGCode from './src/DrawerGCode'

const scene = new Urpflanze.Scene({
	width: 1080,
	height: 1080 * 0.70707070707,
	background: '#eee',
	color: '#000'
})

const shape = new Urpflanze.ShapeLoop({
	repetitions: 50,
	sideLength: () => 100,
	distance: 200,
	loop: {
		start: 0,
		end: 50,
		inc: 1,
		vertex: (s) => [s.offset * 2 - 1, 0]
	},
	vertexCallback: (vertex, vertexRepetition, propArguments) => {
		const y = propArguments.context.noise(
			'seed',
			vertexRepetition.offset * 4,
			propArguments.repetition.offset * 30,
			propArguments.time / 1000
		)

		vertex[1] += y * 10
	},
	bClosed: false,
})

// scene.add(shape)
scene.add(new Urpflanze.Spiral({
	twists: 4,
	sideLength: 120,
	translate: [-3, 5],
	scale: .25
}))


const drawer = new Urpflanze.DrawerCanvas(scene, document.body)


drawer.draw()

document.forms.data.addEventListener('submit', e => e.preventDefault())
document.getElementById('generate').addEventListener('click', () => {
	const labels = [
		'startX',
		'startY',
		'maxX',
		'maxY',
		'velocity',
		'pointDown',
		'pointUp'
	]

	const data = {}

	labels.forEach(label => {
		data[label] = parseFloat(document.querySelector(`input[name=${label}]`).value)
	})

	console.log(data)

	const drawerGCode = new DrawerGCode(scene, data)
	console.log(drawerGCode.generate().join('\r\n'))
})