import { Link, href } from "react-router";
import { navigation } from "~/constants";

export function Footer() {
  return (
    <footer className="bg-background" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <img
              className="h-14"
              src="https://picsum.photos/112/56"
              alt="Tracker logo"
            />
            <p className="text-muted-foreground text-base">
              Lets see who wins.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                  Practice Areas
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.solutions.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-muted-foreground hover:text-foreground text-base transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                  Navigation
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.siteNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-muted-foreground hover:text-foreground text-base transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                  Company
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-muted-foreground hover:text-foreground text-base transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                  Contact
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.contact.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-muted-foreground hover:text-foreground text-base transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="border-border mt-12 border-t pt-8">
          <p className="text-muted-foreground text-base xl:text-center">
            <strong>
              &copy; {new Date().getFullYear()} Survivor Tracker LLC.
            </strong>{" "}
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
