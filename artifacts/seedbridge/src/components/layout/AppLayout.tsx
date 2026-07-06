import * as React from "react"
import { Switch, Route, Link, useLocation } from "wouter"
import { useAuth } from "@/contexts/AuthContext"
import { Home, Sprout, ShoppingCart, Truck, User, LogOut, LayoutDashboard, ListPlus } from "lucide-react"
import { cn } from "@/components/ui/button"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const [location] = useLocation()

  const navItems = [
    { label: "Home", href: "/", icon: Home, show: true },
    { label: "Market", href: "/marketplace", icon: ShoppingCart, show: true },
    { label: "Dashboard", href: `/${user?.role}/dashboard`, icon: LayoutDashboard, show: !!user },
    { label: "My Listings", href: "/farmer/listings", icon: ListPlus, show: user?.role === "farmer" },
    { label: "Orders", href: "/orders", icon: Sprout, show: user?.role === "farmer" || user?.role === "buyer" },
    { label: "Routes", href: "/driver/routes", icon: Truck, show: user?.role === "driver" },
  ]

  return (
    <div className="flex min-h-[100dvh] flex-col bg-muted/30">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
              <Sprout className="h-5 w-5" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-foreground">SeedBridge</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.filter(i => i.show).map(item => (
              <Link key={item.href} href={item.href} className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location === item.href ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground"
              )}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                  <div className="h-8 w-8 rounded-full bg-accent/20 border border-accent flex items-center justify-center text-accent-foreground font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>
                <button onClick={logout} className="text-muted-foreground hover:text-destructive transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors px-3 py-2">Log In</Link>
                <Link href="/register" className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors shadow-sm">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background pb-safe z-50">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.filter(i => i.show).slice(0, 5).map(item => (
            <Link key={item.href} href={item.href} className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium transition-colors",
              location === item.href || (location.startsWith(item.href) && item.href !== '/') ? "text-primary" : "text-muted-foreground"
            )}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
