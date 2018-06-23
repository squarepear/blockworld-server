const dir = process.cwd()

const { URL } = require('url')
const fs = require('fs')
const path = require('path')
const jsonfile = require('jsonfile')
const http = require('http')

const texturesDir = path.join(dir, 'textures')
const configDir = path.join(dir, 'config.json')

const textureHost = fs.existsSync(texturesDir)

if (!fs.existsSync(configDir) || !jsonfile.readFileSync(configDir)) {
  console.log('No config file found...')
  createConfigFile()
}

const config = jsonfile.readFileSync(configDir)

const server = http.createServer(requestHandler)
const io = require('socket.io')(server)

io.on('connection', (socket) => {
  console.log('Player Joined')

  socket.on('say', console.log)
})

function requestHandler(req, res) {
  let url = new URL(path.join(`http://localhost:${config.port}`,req.url))
  let reqPath = url.pathname.substr(1)
  let reqOptions = url.searchParams

  if (textureHost && (reqPath === 'texturelist' || reqPath === 'textures')) {
    let fileList = fs.readdir(texturesDir, (err, fileList) => {
      if (err) throw err
      res.write(fileList.toString())
      res.end()
    })
  } else if (textureHost && reqPath === 'texture' && reqOptions.get('name')) {
    let filePath = path.join(texturesDir, reqOptions.get('name'))
    fs.stat(filePath, (err, stat) => {
      if (err == null) {
        fs.readFile(filePath, (err, file) => {
          if (err) throw err
          if (file) {
            res.write(file)
            res.end()
          }
        })
      } else {
        res.write('File not found')
        res.end()
      }
    })
  } else if (reqPath === 'info') {
    res.write(JSON.stringify(config))
    res.end()
  } else {
    res.end()
  }

}

function createConfigFile() {
  jsonfile.writeFileSync(configDir, {
    port: '8080'
  }, {spaces: 2, EOL: '\r\n'})

  console.log('Config created!')
}

server.listen(config.port)
