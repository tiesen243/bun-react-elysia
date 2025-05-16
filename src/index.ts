import { serve } from 'bun'

import { server } from '@server/index'
import index from './index.html'

const app = serve({
  routes: {
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

console.log(
  `🚀 Server running at ${app.url.protocol}//${app.url.hostname}:${app.url.port}`,
)
