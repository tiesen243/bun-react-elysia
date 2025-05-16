import { treaty } from '@elysiajs/eden'

import type { Server } from '@server/index'

export const { api } = treaty<Server>('localhost:3000')
