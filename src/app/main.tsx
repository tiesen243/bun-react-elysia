import '@/app/globals.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'

import { router } from '@/app/router'

const elem = document.getElementById('root')
const app = (
  <StrictMode>
    <RouterProvider router={router} />
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
