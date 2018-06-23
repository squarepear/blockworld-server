const dir = process.cwd()

const fs = require('fs')
const path = require('path')
const jsonfile = require('jsonfile')
const texturesDir = path.join(dir, 'textures')
const configDir = path.join(dir, 'config.json')

if (!fs.existsSync(configDir) || !jsonfile.readFileSync(configDir)) {
  console.log('No config file found...')
  createConfigFile()
}

const config = jsonfile.readFileSync(configDir)

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
  jsonfile.writeFileSync(configDir, {
    port: '8080'
  }, {spaces: 2, EOL: '\r\n'})

  console.log('Config created!')
}
