"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Settings, PlusCircle, History, LogOut, Pin } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Generate", href: "/generate", icon: PlusCircle },
    { name: "History", href: "/history", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col w-64 bg-white border-r h-full">
      <div className="flex items-center justify-center h-16 border-b px-4">
        <Pin className="w-6 h-6 text-blue-600 mr-2" />
        <span className="text-xl font-bold text-gray-900">PinAffiliate AI</span>
      </div>
      <div className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-blue-700" : "text-gray-400"}`} />
              {item.name}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut className="w-5 h-5 mr-3 text-gray-400" />
          Logout
        </button>
      </div>
    </div>
  );
}
