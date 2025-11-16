"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { Menu, X, ShoppingCart, User, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cartApi } from "@/lib/api";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";


const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/reservations", label: "Reservations" },
  { href: "/reviews", label: "Reviews" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { getToken } = useAuth();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      const token = await getToken();
      const data = await cartApi.getCount(token);
      setCount(data.count || 0);
    }
    fetchCartCount();
  }, []);
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/95 backdrop-blur-xl shadow-sm"
    >
      <div className="container mx-auto flex items-center justify-between gap-4 px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-lg ring-2 ring-red-300"
          >
            <Image
              src="/logo.png"
              alt="The Pizza Unlimited"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          </motion.div>

          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              The Pizza Unlimited
            </span>
            <span className="text-xs text-muted-foreground">
            Unlimited Meals, Unbeatable Prices
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden flex-1 justify-center lg:flex">
          <NavigationMenuList className="gap-2">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className={`${navigationMenuTriggerStyle()} relative ${
                      pathname === link.href
                        ? "bg-accent text-accent-foreground font-semibold hover:bg-accent/80"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    } transition-all duration-300`}
                  >
                    {link.label}

                    {pathname === link.href && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Auth Area */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Dark Mode Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-accent transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-foreground" />
              )}
            </Button>
          )}
          
          {/* When SIGNED OUT */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
              >
                Sign In
              </Button>
            </SignInButton>

            <SignUpButton mode="modal">
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>

          {/* When SIGNED IN */}
          <SignedIn>
            <Link href="/myOrders">
              <Button variant="ghost" size="sm">
                My Orders
              </Button>
            </Link>

            <Link href="/myReservations">
              <Button variant="ghost" size="sm">
                My Reservations
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 flex  items-center justify-center text-xs rounded-full bg-primary text-primary-foreground font-semibold shadow-lg">
                  {count}
                </span>
              </Button>
            </Link>

            {/* Clerk Profile Button */}
            <UserButton
              appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden hover:bg-primary/10 transition-all duration-300"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </AnimatePresence>
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border/30 bg-background/95 backdrop-blur-xl shadow-lg lg:hidden"
          >
            <nav className="container mx-auto flex flex-col gap-2 px-6 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-lg px-4 py-3 text-base font-medium ${
                    pathname === link.href
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-4 flex flex-col gap-3 border-t border-border/30 pt-6">
                {/* Dark Mode Toggle - Mobile */}
                {mounted && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        Dark Mode
                      </>
                    )}
                  </Button>
                )}

                {/* Signed OUT */}
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <Button className="w-full bg-gradient-to-r from-primary to-accent text-white">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </SignedOut>

                {/* Signed IN */}
                <SignedIn>
                  <Link href="/myOrders">
                    <Button variant="ghost" className="w-full">
                      My Orders
                    </Button>
                  </Link>

                  <Link href="/myReservations">
                    <Button variant="ghost" className="w-full">
                      My Reservations
                    </Button>
                  </Link>

                  <Link href="/cart">
                    <Button variant="ghost" className="w-full flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" /> Cart
                      </span>
                      <span className="h-6 w-6 flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-xs text-white">
                        3
                      </span>
                    </Button>
                  </Link>

                  <div className="flex justify-end pt-2">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>

              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
