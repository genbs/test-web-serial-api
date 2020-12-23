const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const fs = require('fs')
   
const gcode = fs.readFileSync('./data.gcode', { encoding:'utf8', flag:'r' })

const commands = gcode.split('\n').map(command => command + '\r\n')

const port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 115200
})

let sending = false
const lineStream = port.pipe(new Readline())


lineStream.on('data', function (data) {
    console.log('data:', data)

    dequeue()
})  

function dequeue() {
    if (!sending && commands.length > 0) {
        const command = commands.shift()
        sending = true
        port.write(command, () => {
            sending = false
        })
    }
}
  
port.on('error', function(e) {
    console.log('error: ', e.message)
})
