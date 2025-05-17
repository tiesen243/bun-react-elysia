import { networkInterfaces } from 'os'
import { serve } from 'bun'

import index from './index.html'
import { server } from './server'

const app = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    '/*': index,
    '/api/*': {
      GET: server.handle,
      POST: server.handle,
      PUT: server.handle,
      DELETE: server.handle,
    },
  },

  development: process.env.NODE_ENV !== 'production' && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
})

const getNetworkIp = () => {
  const nets = networkInterfaces()
  for (const net of Object.values(nets)) {
    if (!net) continue

    for (const netInterface of net) {
      if (netInterface.family === 'IPv4' && !netInterface.internal) {
        return netInterface.address
      }
    }
  }

  return 'localhost'
}

console.log(`
   Bun (${app.development ? 'dev' : 'prod'})
  - Local:        ${app.url.origin}
  - Network:      ${app.url.protocol}//${getNetworkIp()}:${app.port}
`)
