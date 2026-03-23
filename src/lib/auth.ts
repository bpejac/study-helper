import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Import prisma only when needed (not at module level)
        const { prisma } = await import('@/lib/prisma');
        const bcrypt = await import('bcryptjs');

        const admin = await prisma.admin.findUnique({
          where: { username: credentials.username as string },
        });

        if (!admin) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          admin.password
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: admin.id,
          name: admin.username,
          email: `${admin.username}@admin`,
        };
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
