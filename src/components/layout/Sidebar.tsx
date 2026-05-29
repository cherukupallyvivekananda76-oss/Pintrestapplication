"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Settings, PlusCircle, History, LogOut, Pin, Sparkles } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Generate", href: "/generate", icon: PlusCircle },
    { name: "History", href: "/history", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="sticky top-0 z-30 flex w-full flex-col border-b border-[var(--border)] bg-[color:rgb(255_253_250_/_0.92)] shadow-sm backdrop-blur-xl md:h-screen md:w-72 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between gap-3 px-4 py-4 md:px-5 md:py-5">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[var(--accent)] text-white shadow-[0_10px_22px_rgb(15_118_110_/_22%)]">
            <Pin className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-extrabold tracking-normal text-[var(--foreground)]">
              PinAffiliate AI
            </span>
            <span className="hidden items-center gap-1 text-xs font-semibold text-[var(--muted)] sm:flex">
              <Sparkles className="h-3 w-3 text-[var(--accent)]" />
              Pinterest affiliate studio
            </span>
          </span>
        </Link>

        <button
          type="button"
          aria-label="Log out"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="app-icon-button md:hidden"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      <nav className="grid grid-cols-4 gap-2 px-4 pb-4 md:flex md:flex-1 md:flex-col md:px-5 md:py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex min-w-0 flex-col items-center gap-1 rounded-[10px] border px-2 py-2 text-[0.72rem] font-bold sm:text-sm md:w-full md:flex-row md:gap-2.5 md:px-3.5 md:py-2.5 ${
                isActive
                  ? "border-[color:rgb(15_118_110_/_20%)] bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-sm"
                  : "border-transparent text-[var(--muted-strong)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <item.icon className={`h-4 w-4 md:h-4.5 md:w-4.5 ${isActive ? "text-[var(--accent)]" : "text-[var(--muted)]"}`} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden border-t border-[var(--border)] p-5 md:block">
        <div className="mb-4 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--accent-strong)]">Demo ready</p>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            Generate, review, and export affiliate pin content from one focused workspace.
          </p>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="app-button-secondary w-full gap-2"
        >
          <LogOut className="h-4 w-4 text-[var(--muted)]" />
          Logout
        </button>
      </div>
    </aside>
  );
}
