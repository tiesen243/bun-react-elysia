import { treaty } from '@elysiajs/eden'

import type { Server } from '@/server'
import { getBaseUrl } from './utils'

export const { api } = treaty<Server>(getBaseUrl())
