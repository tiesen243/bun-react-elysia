import { ThemeProvider } from 'next-themes'
import { Link, Outlet } from 'react-router'

import { ToggleTheme } from '@/components/toggle-theme'
import Logo from '@/logo.svg'

export function RootLayout() {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <header className="bg-background/70 flex h-16 items-center border-b">
        <div className="container flex items-center justify-between gap-4">
          <img src={Logo} alt="Logo" className="size-8" />

          <nav className="flex flex-1 items-center gap-x-4">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>

          <ToggleTheme />
        </div>
      </header>
      <Outlet />
    </ThemeProvider>
  )
}
