import type React from "react"
import Link from "next/link"
import { Bell, ChevronDown, Leaf, LogOut, Menu, Settings, ShoppingCart, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardNav } from "@/components/farmer/dashboard-nav"
import LogoutBtn from "@/components/LogoutBtn"
import { getCurrentUser, getUserRole } from "../actions/auth-actions"
import { redirect } from "next/navigation"
// import { CartProvider } from "@/components/cart-provider"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

  const role = await getUserRole();

  const currentUser = await getCurrentUser();

    // 🔹 **Redirect if the user is not authenticated or has no role**
    if (!currentUser || !role) {
      redirect("/login");
    }
  
  

  return (
    // <CartProvider userId={user.id}>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                  <Leaf className="h-6 w-6 text-green-600" />
                  <span>PureFarm Market</span>
                </Link>
                <DashboardNav userRole={role || ''} />
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Leaf className="h-6 w-6 text-green-600" />
            <span>PureFarm Market</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            {/* {user.role === "customer" && ( */}
              <Link href="/dashboard/cart">
                <Button variant="outline" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">View cart</span>
                </Button>
              </Link>
            {/* )} */}
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline-flex">{`${currentUser?.first_name} ${currentUser?.last_name}`}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form>
                    <div className="flex w-full items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      <LogoutBtn />
                    </div>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1">
          <aside className="hidden w-64 border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex-1 overflow-auto py-2">
                <DashboardNav userRole={role || ''} />
              </div>
            </div>
          </aside>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    // </CartProvider>
  )
}

