import { treaty } from '@elysiajs/eden'

import type { Server } from '@/server/api'
import { getBaseUrl } from '@/lib/utils'

export const { api } = treaty<Server>(getBaseUrl(), {
  headers: {
    'x-elysia-source': 'treaty',
  },
})
