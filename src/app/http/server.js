import File from 'fs'
import Path from 'path'
import Fetch from 'glob'
import Async from 'async'
import Fastify from 'fastify'
import Static from 'fastify-static'
import Body from 'fastify-formbody'
import Session from './middleware/session'
import Configuration from '../config/options'
export default class Server {

  constructor (time) {
    Async.waterfall([ Server.configure, Server.routes], ((errors, http) => {

      http.get('/*', (req, reply) => {
        const stream = File.readFileSync(Path.join(__dirname, '..', '..', 'public', 'views', 'index.html'))
        reply.type('text/html').send(stream)
      })

      http.listen(80, (() => {
        console.log('   Web Server is running')
      }))

    }))
  }

  static configure (callback) {
    const http = Fastify()

    http.register(Static, {
      root: Path.join(__dirname, '..', '..', 'public', 'assets'),
      prefix: '/assets/',
    })

    http.register(Body)

    http.use('/api/auth', Session.check)

    callback(null, http)
  }


  static routes (http, callback) {
    Fetch.sync(`${__dirname}/routes/**/*.js`).forEach (file => {
      const route = require(file).default
      new route (http)
    })
    callback(null, http)
  }

}