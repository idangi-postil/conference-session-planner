import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AgendaProvider } from "@/lib/agenda-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Conference Sessions Planner",
  description: "Plan your conference schedule and manage your session agenda",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_geist.className} ${_geistMono.className}`}>
      <body>
        <AgendaProvider>{children}</AgendaProvider>
      </body>
    </html>
  )
}
