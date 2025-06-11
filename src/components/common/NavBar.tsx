"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusIcon } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";

export default function NavBar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleCreate = (type: string) => {
    if (type === "website") {
      router.push("/create/website");
    } else {
      router.push(`/create/${type}`);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 border-b">
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

      <div className="flex space-x-2 items-center">
        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="mr-2">
                <PlusIcon className="h-4 w-4 mr-1" />
                Create
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => handleCreate("website")}>
                Website
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreate("web")}>
                Web Post
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreate("images")}>
                Image Post
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreate("videos")}>
                Video Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

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
  );
}


// "use client";
// import Link from "next/link"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { useSession, signOut } from "next-auth/react"
// import ThemeSwitcher from "./ThemeSwitcher";

// //create navbar component with logo, title, and login/logout button
// export default function NavBar() {
//   const { data: session } = useSession()

//   return (
//     <nav className={"flex justify-between items-center p-4 border-b"}>
//       <div className="flex items-center">
//         <Image
//           src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.jpg-3bwoBW07eVo16olC2qW6v8UxtYYdUL.jpeg"
//           alt="Flipcard Logo"
//           width={40}
//           height={40}
//           className="dark:invert"
//         />
//         <span className="ml-2 text-xl font-bold">Flipcard Portal</span>
//       </div>
//       <div className="flex space-x-2">
//         <Link href="/" passHref>
//           <Button variant="ghost">Home</Button>
//         </Link>
//         {session ? (
//           <>
//             <Link href="/profile" passHref>
//               <Button variant="ghost">Profile</Button>
//             </Link>
//             <Button variant="ghost" onClick={() => signOut()}>
//               Logout
//             </Button>
//           </>
//         ) : (
//           <Link href="/login" passHref>
//             <Button variant="default">Login</Button>
//           </Link>
//         )}
//       </div>
      
//     </nav>
//   )
// }

