import { Link, Outlet } from 'react-router'

import { ToggleTheme } from '@/components/toggle-theme'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSession } from '@/hooks/use-session'
import Logo from '@/logo.svg'

export function RootLayout() {
  const { status, session, signIn, signOut } = useSession()

  return (
    <>
      <header className="bg-background/70 flex h-16 items-center border-b shadow-sm">
        <div className="container flex items-center justify-between gap-4">
          <img src={Logo} alt="Logo" className="size-8" />

          <nav className="flex flex-1 items-center gap-x-4">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>

          <div className="flex items-center gap-x-4">
            <ToggleTheme />

            {status === 'loading' ? (
              <div className="size-9 animate-pulse rounded-full bg-current" />
            ) : status === 'unauthenticated' ? (
              <Button onClick={async () => signIn('google')}>Sign In</Button>
            ) : (
              <Avatar
                onClick={async () => {
                  const isConfirmed = confirm(
                    'Are you sure you want to sign out?',
                  )
                  if (isConfirmed) await signOut()
                }}
              >
                <AvatarImage src={session.user.image} alt={session.user.name} />
                <AvatarFallback>
                  {session.user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </header>
      <Outlet />
    </>
  )
}
