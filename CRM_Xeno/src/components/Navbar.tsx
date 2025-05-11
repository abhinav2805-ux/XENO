"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import {
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  ShoppingCart,
  Home,
  User,
  Coins,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function Navbar() {
  const { data: session, status } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white shadow"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center mr-2">
                <span className="text-white font-bold">X</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                Xeno CRM
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Search Bar - Only show when logged in */}
            {session && (
              <div className="relative mr-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 w-64 bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>
            )}

            {session ? (
              <>
                {/* Main Navigation Links */}
                <div className="flex items-center space-x-1 mr-4">
                  <Button variant="ghost" asChild className="text-slate-600 hover:text-slate-900">
                    <Link href="/dashboard">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="text-slate-600 hover:text-slate-900">
                    <Link href="/Pricing">
                      <Coins className="h-4 w-4 mr-2" />
                      Pricing
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="text-slate-600 hover:text-slate-900">
                    <Link href="/orders">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Orders
                    </Link>
                  </Button>
                </div>

                {/* Notification Icon */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5 text-slate-600" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-emerald-500">
                        3
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-y-auto">
                      {[1, 2, 3].map((item) => (
                        <DropdownMenuItem key={item} className="py-3 cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-slate-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">New customer signed up</p>
                              <p className="text-xs text-slate-500">2 hours ago</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center">
                      <Link href="/notifications" className="text-sm text-slate-500 hover:text-slate-900">
                        View all notifications
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="ml-2 flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                        <AvatarFallback className="bg-slate-200 text-slate-600">
                          {session.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-slate-700 hidden lg:inline-block">
                        {session.user?.name || "User"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help & Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-slate-600 hover:text-slate-900">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="text-slate-600 hover:text-slate-900">
                  <Link href="/Pricing">Pricing</Link>
                </Button>
                
                <Button variant="outline" asChild className="ml-2">
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button asChild className="ml-2 bg-slate-900 hover:bg-slate-800">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-slate-700" />
              ) : (
                <Menu className="h-6 w-6 text-slate-700" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 py-4 px-4 space-y-3">
          {session ? (
            <>
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                  <AvatarFallback className="bg-slate-200 text-slate-600">
                    {session.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-slate-900">{session.user?.name || "User"}</p>
                  <p className="text-xs text-slate-500">{session.user?.email || ""}</p>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input type="search" placeholder="Search..." className="pl-10 w-full bg-slate-50 border-slate-200" />
              </div>

              <div className="space-y-1 pt-2">
                <Button variant="ghost" asChild className="w-full justify-start text-slate-600">
                  <Link href="/dashboard">
                    <BarChart3 className="h-4 w-4 mr-3" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="w-full justify-start text-slate-600">
                  <Link href="/customers">
                    <Users className="h-4 w-4 mr-3" />
                    Customers
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="w-full justify-start text-slate-600">
                  <Link href="/orders">
                    <ShoppingCart className="h-4 w-4 mr-3" />
                    Orders
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="w-full justify-start text-slate-600">
                  <Link href="/settings">
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="w-full justify-start text-slate-600">
                  <Link href="/help">
                    <HelpCircle className="h-4 w-4 mr-3" />
                    Help & Support
                  </Link>
                </Button>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <Button
                  variant="destructive"
                  className="w-full justify-start bg-red-600 hover:bg-red-700"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <Button variant="ghost" asChild className="w-full justify-start text-slate-600">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-3" />
                    Home
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="w-full justify-start text-slate-600">
                  <Link href="/features">Features</Link>
                </Button>
                <Button variant="ghost" asChild className="w-full justify-start text-slate-600">
                  <Link href="/pricing">Pricing</Link>
                </Button>
                <Button variant="ghost" asChild className="w-full justify-start text-slate-600">
                  <Link href="/contact">Contact</Link>
                </Button>
              </div>

              <div className="pt-3 space-y-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button asChild className="w-full bg-slate-900 hover:bg-slate-800">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
