import { Outlet, Link, NavLink, useLocation } from "react-router";
import { MainNavDrawer } from "./main-nav-drawer";
import { Footer } from "./footer";
import { navigation } from "~/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ChevronDown, Phone } from "lucide-react";
import { cn } from "~/lib/utils";

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <nav className="bg-background sticky top-0 z-10 p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/">
            <img
              src="https://picsum.photos/128/32"
              alt="Survivor Tracker Logo"
              className="h-8"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-6 md:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                  "hover:bg-red-50 hover:text-red-600",
                  isActive
                    ? "bg-red-50 font-semibold text-red-600"
                    : "text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  Home
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-red-600" />
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                  "hover:bg-red-50 hover:text-red-600",
                  isActive
                    ? "bg-red-50 font-semibold text-red-600"
                    : "text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  About
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-red-600" />
                  )}
                </>
              )}
            </NavLink>

            {/* Practice Areas Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "relative flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                  "hover:bg-red-50 hover:text-red-600",
                  location.pathname.startsWith("/practice-areas")
                    ? "bg-red-50 font-semibold text-red-600"
                    : "text-foreground"
                )}
              >
                Practice Areas
                <ChevronDown className="h-4 w-4" />
                {location.pathname.startsWith("/practice-areas") && (
                  <div className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-red-600" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {navigation.solutions.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          "w-full transition-colors",
                          isActive ? "bg-red-50 font-medium text-red-600" : ""
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink
              to="/reviews"
              className={({ isActive }) =>
                cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                  "hover:bg-red-50 hover:text-red-600",
                  isActive
                    ? "bg-red-50 font-semibold text-red-600"
                    : "text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  Reviews
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-red-600" />
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                  "hover:bg-red-50 hover:text-red-600",
                  isActive
                    ? "bg-red-50 font-semibold text-red-600"
                    : "text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  Contact
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-red-600" />
                  )}
                </>
              )}
            </NavLink>
          </div>

          {/* Mobile Navigation Drawer */}
          <MainNavDrawer />
        </div>
      </nav>
      <main className="bg-background text-foreground flex-grow">
        <Outlet />
      </main>
      <Footer />

      {/* Floating Action Button - Hide on contact page */}
      {location.pathname !== "/contact" && (
        <Link
          to="/contact"
          className="bg-claw-red hover:bg-claw-red/80 group fixed right-6 bottom-6 z-50 flex h-14 w-32 items-center justify-center rounded-lg text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl md:right-8 md:bottom-8 md:h-20 md:w-20 md:rounded-full"
        >
          <div className="flex flex-wrap items-center gap-2 md:flex-col md:text-center">
            <Phone className="mx-auto h-5 w-5 md:h-6 md:w-6" />
            <span className="hidden text-xs leading-none font-semibold md:block">
              Contact
              <br />
              Now
            </span>
            <span className="text-xs leading-none font-semibold md:hidden">
              Contact Now
            </span>
          </div>
        </Link>
      )}
    </div>
  );
}
