import NextAuth, { type DefaultSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// ✅ Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      image?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    image?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // ✅ Runs when JWT token is created/updated
    async jwt({ token, account, profile }) {
      if (account && profile) {
        console.log("🔥 JWT callback profile:", profile); // Debug profile from provider
        token.picture = (profile as { picture?: string }).picture ?? "";
        token.sub = profile.sub;
      }
      return token;
    },

    // ✅ Runs when session is created from JWT
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.image = token.picture as string;
      }
      console.log("🔍 Session callback result:", session); // Debug session with image
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// ✅ Export the handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


// import NextAuth, { type DefaultSession } from "next-auth"
// import GoogleProvider from "next-auth/providers/google"

// // Extend the built-in session type to include id
// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string
//     } & DefaultSession["user"]
//   }
// }

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,  // Loaded from env
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,  // Loaded from env

// }),


// ],
//   callbacks: {
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.sub!;
//         session.user.image = (token.picture as string | undefined) || (token.image as string | undefined);  // Ensure image is set
//       }
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,  // Loaded from env
// })

// export { handler as GET, handler as POST };
