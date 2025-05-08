"use client";
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import ThemeSwitcher from "./ThemeSwitcher";

//create navbar component with logo, title, and login/logout button
export default function NavBar() {
  const { data: session } = useSession()

  return (
    <nav className={"flex justify-between items-center p-4 border-b"}>
      <div className="flex items-center">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.jpg-3bwoBW07eVo16olC2qW6v8UxtYYdUL.jpeg"
          alt="Flipcard Logo"
          width={40}
          height={40}
          className="dark:invert"
        />
        <span className="ml-2 text-xl font-bold">Flipcard Portal</span>
      </div>
      <div className="flex space-x-2">
        <Link href="/" passHref>
          <Button variant="ghost">Home</Button>
        </Link>
        {session ? (
          <>
            <Link href="/profile" passHref>
              <Button variant="ghost">Profile</Button>
            </Link>
            <Button variant="ghost" onClick={() => signOut()}>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/login" passHref>
            <Button variant="default">Login</Button>
          </Link>
        )}
      </div>
      
    </nav>
  )
}

