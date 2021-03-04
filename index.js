import DrawerGCode from './src/DrawerGCode'

const size = 800

const scene = new Urpflanze.Scene({
	width: size,
	height: size,
	background: '#eee',
	color: '#000',
})

// scene.add(
// 	new Urpflanze.Rect({
// 		sideLength: [860, 910],
// 		translate: [0, 60],
// 	})
// )

const t = new Urpflanze.Rect({
	repetitions: [1, 50],
	sideLength: 350,
	scale: t => 1 - t.repetition.offset * 0.99,
	rotateZ: t => -Math.PI / 2 + t.repetition.offset * (Math.PI / 2),
	distance: 0,
})

scene.add(t)
const drawer = new Urpflanze.DrawerCanvas(
	scene,
	document.body,
	{
		simmetricLines: 0,
		// clear: false,
		// ghosts: 1000,
		// ghostSkipFunction: (i, time) => i.index ** 1.08,
		// // ghostSkipTime: 200,
		// ghostAlpha: false,
	},
	1,
	20000
)
drawer.getTimeline().setTime(14200)

drawer.draw()

document.forms.data.addEventListener('submit', e => e.preventDefault())
document.getElementById('generate').addEventListener('click', () => {
	const labels = ['startX', 'startY', 'maxX', 'maxY', 'velocity', 'pointDown', 'pointUp']

	const data = {}

	labels.forEach(label => {
		data[label] = parseFloat(document.querySelector(`input[name=${label}]`).value)
	})

	console.log(data)

	const drawerGCode = new DrawerGCode(scene, data)
	console.log(drawerGCode.generate().join('\r\n'))
})
