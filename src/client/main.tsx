import '@client/globals.css'

import { StrictMode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'

import { SessionProvider } from '@client/hooks/use-session'
import { createQueryClient } from '@client/lib/query-client'
import { IndexPage } from '@client/routes/index'

const queryClient = createQueryClient()

const elem = document.getElementById('root')
const app = (
  <StrictMode>
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <BrowserRouter>
            <Routes>
              <Route index element={<IndexPage />} />
            </Routes>
          </BrowserRouter>
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
)

// @ts-nocheck
// eslint-disable-next-line
if (import.meta.hot) {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  // eslint-disable-next-line
  const root = (import.meta.hot.data.root ??= createRoot(elem!))
  // eslint-disable-next-line
  root.render(app)
} else {
  // The hot module reloading API is not available in production.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  createRoot(elem!).render(app)
}
