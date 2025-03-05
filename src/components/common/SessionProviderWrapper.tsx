"use client"; // Mark it as a Client Component

import { SessionProvider } from "next-auth/react";

/**
 * A wrapper around next-auth's SessionProvider that marks it as a Client Component
 * (i.e. a component that should only be rendered on the client side).
 *
 * @param children The children elements to be wrapped by the SessionProvider.
 */
export default function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
