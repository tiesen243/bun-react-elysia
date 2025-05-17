import { createBrowserRouter } from 'react-router'

import { RootLayout } from '@/app/root'
import { IndexPage } from '@/app/routes/index'

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { index: true, Component: IndexPage },
      {
        path: '/about',
        lazy: async () => {
          const [Component] = await Promise.all([
            import('./routes/about').then((mod) => mod.AboutPage),
          ])
          return { Component }
        },
      },
    ],
  },
])
