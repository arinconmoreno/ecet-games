import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { isAuthorizedEmail, isAdminEmail, getContactByEmail } from '@/data/contacts';
import { getServiceSupabase } from '@/lib/supabase';

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
          const sb = getServiceSupabase();
          const { data: existing } = await sb
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

          if (!existing) {
            const { data: newUser } = await sb
              .from('users')
              .insert({
                name: contact.name,
                email: email,
                is_admin: isAdminEmail(email),
              })
              .select()
              .single();

            return {
              id: newUser?.id || email,
              name: contact.name,
              email: email,
              isAdmin: isAdminEmail(email),
            } as any;
          }

          return {
            id: existing.id,
            name: existing.name,
            email: existing.email,
            isAdmin: existing.is_admin,
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
        const sb = getServiceSupabase();
        await sb.from('users').upsert(
          {
            name: contact?.name || user.name || '',
            email: email,
            is_admin: isAdminEmail(email),
          },
          { onConflict: 'email' }
        );
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
