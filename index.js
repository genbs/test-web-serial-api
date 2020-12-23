import DrawerGCode from './src/DrawerGCode'


const size = 1080

const scene = new Urpflanze.Scene({
	width: size,
	height: size,
	background: '#eee',
	color: '#000',
})

const shapeloop = new Urpflanze.ShapeLoop({
	repetitions: [80, 1],
	sideLength: size / 3.6,
	translate: [80, -120],
	loop: {
		start: 0,
		end: 1000,
		inc: 1,
		vertex: (s, p) => {
			let x = 0,
				y = 0

			const time = p.time + p.repetition.index * 6
			const stime = time * Urpflanze.PI2

			const t = Math.sin(stime / 5000) + p.context.noise('seed', s.offset * 10, Math.sin(stime / 1000)) * 0.02

			const angle =
				s.offset * (Urpflanze.PI2 * 1.5 + t * Math.PI * 2) -
				Math.sin(stime / 10000) * Math.PI * 2 -
				Math.sin(stime / 20000) * Math.PI * 2

			// const at = Math.sin(stime / 10000) * Math.PI
			const at = 0
			const minC = 0.96
			const k =
				(1) +
				(0.5 + Math.sin(stime / 10000) * 0.5) * 0.5 +
				p.context.noise('seed', s.offset * 2, Math.sin(stime / 5000) * s.offset) * 0.2

			const radius = 0.5 + (1 - s.offset) * 1
			x += Math.cos(angle) * (1 - (s.offset * 0.5) ** 1 * minC) * radius * k
			y -= Math.sin(angle) * (1 - (s.offset * 0.5) ** 1 * minC) * radius * k

			const angle2 = angle * 60
			const g = p.context.noise('seed', s.offset * 2 * Math.sin(stime / 20000))
			x -= Math.cos(angle2 + at) * (0.01 * g)
			y -= Math.sin(angle2 + at) * (0.01 * g)

			y -=
				Math.cos(angle) *
				Math.sin(angle * 3) *
				(0.5 + p.context.noise('seed', s.offset * 5, Math.sin(stime / 10000)) * 0.5) *
				(1 - s.offset * 0.5) ** 10 *
				0.8

			return [x, y]
		},
	},
	loopDependencies: ['propArguments'],
	bClosed: false,
})

scene.add(shapeloop)

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