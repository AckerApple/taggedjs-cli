import express, { Response } from 'express'
import fs from 'fs'
import path from 'path'
import { parseCommandLineArguments } from './argv.function.js'
import { fileURLToPath } from 'url'

import { WebSocketServer, WebSocket } from 'ws'
import webpack from 'webpack'
import { run as runBundler } from './bundle.script.js'
// import webpackConfig from './webpack.config.js'

export async function run(webpackConfig: webpack.Configuration) {
  // Create a compiler instance with the configuration
  const compiler = webpack(webpackConfig as any)
  
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  
  const app = express();
  const port = 3000;
  
  const baseRoot = process.cwd() // __dirname
  const rootPath = './' // '../'
  
  // const bundleScript = await import(rootPath + 'bundleScript.js')
  const servePath = path.join(baseRoot, rootPath)
  
  console.debug('📂 servePath',servePath)
  
  const index = path.join(baseRoot, rootPath, 'index.html')
  const indexString = fs.readFileSync(index).toString()
  
  const inject = path.join(baseRoot, 'hmr', 'hmr.bundle.js')
  const customScript = '<script type="module">'+ fs.readFileSync(inject).toString() +'</script>'
  const args = parseCommandLineArguments()
  
  // CLI dir here
  const watchPath = args.dir ? path.join(baseRoot, args.dir) : baseRoot
  
  const indexFilePath = path.join(baseRoot, rootPath, 'index.html')
  
  // Custom middleware for serving static files
  app.use((req, res, next) => {
    const correctedPath = req.url === '/' ? 'index.html' : req.url
    const filePath = path.join(baseRoot, rootPath, correctedPath)
  
    // Check if the requested file is an HTML file
    const customScriptInjection = path.extname(filePath) === '.html'
  
    // TODO: remove this
    const fileName = path.basename(filePath).toLowerCase()
    const isIndex = fileName === 'index.html'
  
    console.debug(`↖️ 📄 send file ${fileName}`)
  
    // Check if the flag is set for HTML modification
    if (isIndex && customScriptInjection) {
      // Read the HTML file
      sendFile(filePath, res)
    } else {
      // If it's not an HTML file, proceed with the regular static file serving
      // servePath
      express.static('.', {
        setHeaders: (res, path) => {
            // Set no-store only for HTML files
            res.setHeader('Cache-Control', 'no-store');
        }
      })(req, res, (err) => {
        if(err) {
          req.url = 'index.html'
          sendFile(indexFilePath, res)
          //express.static('.')(req, res, next)
          return
        }
        next()
      })
    }
  });
  
  const server = app.listen(port, () => {
    console.debug(`🏃 Server is running on http://localhost:${port}`);
    console.debug(`Serving path:${servePath}`);
  });
  
  
  if(watchPath) {
    console.debug('👀 Watching path', watchPath)
  }
  
  const wss = new WebSocketServer({ server })
  let promise = Promise.resolve()
  let running = false
  const connections: WebSocket[] = []
  
  wss.on('close', (ws: WebSocket) => {
    const index = connections.indexOf(ws)
    connections.splice(index, 1)
  })
  
  wss.on('connection', (ws: WebSocket) => {
    connections.push(ws)
    console.debug('wss connected')
    ws.send('Connected to the WebSocket endpoint');
  });
  
  let buildPromise = Promise.resolve()
  console.debug(`👀 Preparing to watch ${watchPath}...`)
  fs.watch(watchPath, { recursive: true }, async (eventType, filename) => {
    const ignore = running || !filename
    if(ignore) {
      return
    }
  
    if(filename) {
      const ignoreFile = filename.includes('bundle.js') || filename.search(/\.d\.ts(\.gz)?$/)>0
      if(ignoreFile) {
        // console.warn(`📄 Ignoring file changes to ${filename}`)
        return
      }
    }
  
    console.debug('📄 file changed', filename)
  
    await buildPromise.then(runBundle)
      .then(() => {
        const messageObject = {
          type:'file-change',
          filename:filename,
          changed: eventType,
        }
      
        connections.forEach(ws => {    
          ws.send(JSON.stringify(messageObject))
          console.debug('💬 sent bundle changed message')
        })
      })
      .catch((error: Error) => console.error(error))
  });
  
  
  function sendFile(
    filePath: string,
    res: Response,
  ) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        if(err.code === 'ENOENT') {
          data = indexString
        } else {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }
      }
  
      
      // Inject your custom script into the HTML
      // const modifiedHtml = data.replace('</body>', `${customScript}</body>`);
      const at = data.indexOf('</body>')
      const modifiedHtml = data.slice(0, at) + '</body>' + customScript + data.slice(at + 7, data.length)
      
      // console.log('modifiedHtml', modifiedHtml)
  
      // Send the modified HTML
      res.send(modifiedHtml);
    });
  }
  
  async function runBundle() {
    running = true
    promise = promise.then(async () => {
      console.debug('🏗️ making bundle...')
      // await bundleScript.run(compiler)
      runBundler(compiler)
      running = false
    }).catch(error =>
      console.error('Error bundling', error)
    )
  
    await promise
  
    console.debug('✅ 🏗️ bundle made')
  
  }
  
  console.debug('🏗️ making first bundle...')
  runBundle()
}