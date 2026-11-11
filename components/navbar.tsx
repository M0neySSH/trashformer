"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetTitle, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut, Leaf, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { getEcoPoints, subscribeToEcoPoints } from "@/lib/points"
import { getAuthUser, logoutUser, subscribeToAuth, type UserSession } from "@/lib/auth"

const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
};

const useAuth = () => {
  const [user, setUser] = useState<UserSession | null>(null)

  useEffect(() => {
    setUser(getAuthUser())
    return subscribeToAuth(setUser)
  }, [])

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  return { isLoggedIn: Boolean(user), user, logout }
}

export default function Navbar() {
  const pathname = usePathname()
  const { isLoggedIn, user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const hasMounted = useHasMounted()
  const [ecoPoints, setEcoPoints] = useState(120)

  useEffect(() => {
    setEcoPoints(getEcoPoints())
    return subscribeToEcoPoints(setEcoPoints)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully", {
      description: "You have been logged out of your account.",
    })
  }

  const navItems = [
    { name: "About", href: "/about" },
    { name: "Carbon Tracker", href: "/carbon-tracker" },
    { name: "Ask-To-Answer", href: "/ask-to-answer" },
    { name: "Leaderboards", href: "/leaderboards" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <img src={"/logo.png"} alt="Trashformer Logo" width={32} height={32} />
          </div>
          <span className="font-bold text-xl">Trashformer</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6 ml-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/redeem"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/redeem" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Redeem
          </Link>
        </nav>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-4">
          {hasMounted && isLoggedIn && (
            <Link
              href="/redeem"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
              title="Your Eco Points Balance"
            >
              <Leaf className="h-3.5 w-3.5 text-leaf-light" />
              <span>{ecoPoints} pts</span>
            </Link>
          )}
          {/* Dark mode toggle */}
          {hasMounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="cursor-pointer"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}

          {hasMounted && isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                    <AvatarFallback>{user?.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <div className="text-sm font-medium">{user?.name}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Leaf className="h-3 w-3 text-leaf-light" />
                    <span>{ecoPoints} points</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/process">Process Waste</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/redeem">Redeem Points</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>

        {/* Mobile navigation */}
        <Sheet>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="ml-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-base font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/redeem"
                className={cn(
                  "text-base font-medium transition-colors hover:text-primary",
                  pathname === "/redeem" ? "text-foreground" : "text-muted-foreground",
                )}
              >
                Redeem
              </Link>

              <div className="flex items-center justify-between py-2 border-t mt-2">
                <span className="text-sm font-medium">Theme</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </div>

              {hasMounted && isLoggedIn ? (
                <>
                  <div className="flex items-center justify-between py-2 border-t mt-2">
                    <div className="text-sm font-medium">{user?.name}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Leaf className="h-3 w-3 text-leaf-light" />
                      <span>{ecoPoints} points</span>
                    </div>
                  </div>
                  <Link href="/process" className="text-base font-medium text-muted-foreground hover:text-primary">
                    Process Waste
                  </Link>
                  <Link href="/redeem" className="text-base font-medium text-muted-foreground hover:text-primary">
                    Redeem Points
                  </Link>
                  <Button variant="outline" onClick={handleLogout} className="mt-2">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button asChild className="mt-2">
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

