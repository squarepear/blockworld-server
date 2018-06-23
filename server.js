const dir = process.cwd()

const fs = require('fs')
const path = require('path')
const jsonfile = require('jsonfile')

if (!fs.existsSync(path.join(dir, 'config.json')) || !jsonfile.readFileSync(path.join(dir, 'config.json'))) {
  console.log('No config file found...')
  createConfigFile()
}

const config = jsonfile.readFileSync(path.join(dir, 'config.json'))

const server = require('http').createServer((req, res) => {
  res.write(JSON.stringify(config))
  res.end()
})

const io = require('socket.io')(server)

server.listen(config.port)

io.on('connection', (socket) => {
  console.log('hi')

  socket.on('say', console.log)
})

function createConfigFile() {
  jsonfile.writeFileSync(path.join(dir, 'config.json'), {
    port: '8383'
  }, {spaces: 2, EOL: '\r\n'})

  console.log('Config created!')
}
