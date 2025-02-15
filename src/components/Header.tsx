import Link from "next/link"

export function Header() {
  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-6 py-3">
        <ul className="flex space-x-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/feed">Feed</Link>
          </li>
          <li>
            <Link href="/profile">Profile</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

