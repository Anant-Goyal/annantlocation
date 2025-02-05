import { Link, useLocation } from "wouter";
import { Home, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <Link href="/">
          <a className="text-lg sm:text-xl font-semibold">Message Generator</a>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/">
            <a className={cn(
              "p-3 rounded-md hover:bg-accent transition-colors",
              location === "/" && "bg-accent"
            )}>
              <Home className="h-6 w-6" />
              <span className="sr-only">Home</span>
            </a>
          </Link>

          <Link href="/settings">
            <a className={cn(
              "p-3 rounded-md hover:bg-accent transition-colors",
              location === "/settings" && "bg-accent"
            )}>
              <SettingsIcon className="h-6 w-6" />
              <span className="sr-only">Settings</span>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}