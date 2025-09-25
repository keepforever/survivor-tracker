import { MenuIcon, XCircle } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { NavLink } from 'react-router'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from '~/components/ui/drawer'
import { useState } from 'react'
import { navigation } from '~/constants'
import { cn } from '~/lib/utils'

export function MainNavDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <MenuIcon className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="p-3">
            <DrawerTitle>
              <img
                src="https://picsum.photos/160/80"
                alt="EndRock CLE"
                className="h-full max-h-20 w-full object-contain"
              />
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col space-y-2 px-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  'hover:text-claw-red relative w-full rounded-lg px-4 py-2 text-center text-sm font-medium transition-all duration-200 hover:bg-red-50',
                  {
                    'text-claw-red border-claw-red border-l-4 bg-red-50 font-semibold': isActive,
                    'text-foreground': !isActive,
                  },
                )
              }
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                cn(
                  'relative w-full rounded-lg px-4 py-2 text-center text-sm font-medium transition-all duration-200',
                  'hover:text-claw-red hover:bg-red-50',
                  {
                    'text-claw-red border-claw-red border-l-4 bg-red-50 font-semibold': isActive,
                    'text-foreground': !isActive,
                  },
                )
              }
              onClick={() => setOpen(false)}
            >
              About
            </NavLink>

            <NavLink
              to="/reviews"
              className={({ isActive }) =>
                cn(
                  'relative w-full rounded-lg px-4 py-2 text-center text-sm font-medium transition-all duration-200',
                  'hover:text-claw-red hover:bg-red-50',
                  {
                    'text-claw-red border-claw-red border-l-4 bg-red-50 font-semibold': isActive,
                    'text-foreground': !isActive,
                  },
                )
              }
              onClick={() => setOpen(false)}
            >
              Reviews
            </NavLink>

            {/* Practice Areas Section */}
            <div className="border-border mt-1 border-t pt-2">
              <p className="text-muted-foreground mb-2 text-center text-xs font-semibold tracking-wider uppercase">
                Practice Areas
              </p>
              <div className="space-y-1">
                {navigation.solutions.map(item => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'block w-full rounded-lg px-4 py-2 text-center text-sm font-medium transition-all duration-200',
                        'hover:text-claw-red hover:bg-red-50',
                        {
                          'text-claw-red border-claw-red border-l-4 bg-red-50 font-semibold': isActive,
                          'text-foreground': !isActive,
                        },
                      )
                    }
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                cn(
                  'relative mt-3 rounded-lg border-2 px-4 py-3 text-center text-sm font-semibold transition-all duration-200',
                  {
                    'border-claw-red text-claw-red bg-white hover:bg-red-50': !isActive,
                    'border-red-700 bg-red-50 text-red-700': isActive,
                  },
                )
              }
              onClick={() => setOpen(false)}
            >
              Contact Now
            </NavLink>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="destructive" className="bg-claw-red flex items-center justify-center gap-2">
                <XCircle />
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
