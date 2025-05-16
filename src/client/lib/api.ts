import type { Server } from '@server/index'
import { treaty } from '@elysiajs/eden'

export const { api } = treaty<Server>('localhost:3000')
