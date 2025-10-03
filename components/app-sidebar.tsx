"use client"

import { Users, Utensils, Calendar, FileText, Settings, Home, Leaf } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Food Database", href: "/foods", icon: Utensils },
  { name: "Diet Plans", href: "/diet-plans", icon: FileText },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card shadow-sm">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Leaf className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold leading-tight text-foreground">AyurDiet</h1>
          <p className="text-xs text-muted-foreground">Cloud</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t bg-muted/30 p-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Ayurvedic Diet Management
          <br />
          <span className="font-medium">v1.0.0</span>
        </p>
      </div>
    </div>
  )
}
