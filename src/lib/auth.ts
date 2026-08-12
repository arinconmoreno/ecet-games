import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { isAuthorizedEmail, isAdminEmail, getContactByEmail } from '@/data/contacts';
import { getServiceSupabase } from '@/lib/supabase';

// Helper: find or create user (no .single(), no joins)
async function findOrCreateUser(email: string, name: string) {
  const sb = getServiceSupabase();

  // Try to find existing user
  const { data: users } = await sb
    .from('users')
    .select('id, name, email, is_admin')
    .ilike('email', email);

  if (users && users.length > 0) {
    return users[0];
  }

  // Create new user
  const { data: created } = await sb
    .from('users')
    .insert({
      name,
      email: email.toLowerCase(),
      is_admin: isAdminEmail(email),
    })
    .select('id, name, email, is_admin');

  return created && created.length > 0 ? created[0] : null;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          hd: 'sofka.com.co',
        },
      },
    }),
    CredentialsProvider({
      name: 'Email Sofka',
      credentials: {
        email: { label: 'Email corporativo', type: 'email', placeholder: 'tu.nombre@sofka.com.co' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        if (!email) return null;
        if (!email.endsWith('@sofka.com.co')) return null;
        if (!isAuthorizedEmail(email)) return null;

        const contact = getContactByEmail(email);
        if (!contact) return null;

        try {
          const user = await findOrCreateUser(email, contact.name);
          return {
            id: user?.id || email,
            name: contact.name,
            email: email,
            isAdmin: isAdminEmail(email),
          } as any;
        } catch {
          return {
            id: email,
            name: contact.name,
            email: email,
            isAdmin: isAdminEmail(email),
          } as any;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase() || '';
      if (!email.endsWith('@sofka.com.co')) return false;
      if (!isAuthorizedEmail(email)) return false;

      try {
        const contact = getContactByEmail(email);
        await findOrCreateUser(email, contact?.name || user.name || '');
      } catch {
        // Continue even if DB not ready
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = isAdminEmail(user.email || '');
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).isAdmin = token.isAdmin;
        (session.user as any).userId = token.userId;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
  },
};
