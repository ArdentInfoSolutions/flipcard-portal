import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import type React from "react"
import { ReduxProvider } from "../redux/provider"
import { SessionProvider } from "next-auth/react"
import NavBar from "../components/NavBar"
import SessionProviderWrapper from "@/components/SessionProviderWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flipcard Portal",
  description: "A social media platform for sharing websites and images",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <SessionProviderWrapper>
          <ReduxProvider>
            <div className="flex flex-col min-h-screen">
              <NavBar />
              <div className="flex-1 pb-[60px] md:pb-0">{children}</div>
            </div>
          </ReduxProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}

