import { Outlet, Link, NavLink } from "react-router";
import { MainNavDrawer } from "./main-nav-drawer";
import { Footer } from "./footer";
import { cn } from "~/lib/utils";

export default function MainLayout() {
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
          </div>

          {/* Mobile Navigation Drawer */}
          <MainNavDrawer />
        </div>
      </nav>
      <main className="bg-background text-foreground flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
