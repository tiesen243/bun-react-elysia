import '@/app/globals.css'

import type { QueryClient } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'

import { router } from '@/app/router'
import { createQueryClient } from '@/lib/query-client'

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  else return (clientQueryClientSingleton ??= createQueryClient())
}

const elem = document.getElementById('root')
const app = (
  <StrictMode>
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <QueryClientProvider client={getQueryClient()}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
)

if (typeof import.meta.hot !== 'undefined') {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const root = (import.meta.hot.data.root ??= elem && createRoot(elem))
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  root.render(app)
} else {
  // The hot module reloading API is not available in production.
  if (elem) createRoot(elem).render(app)
}
