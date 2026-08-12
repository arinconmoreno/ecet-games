'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CONTACTS } from '@/data/contacts';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect if already logged in
  if (session) {
    router.push('/home');
    return null;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = email.trim().toLowerCase();

    if (!trimmed.endsWith('@sofka.com.co')) {
      setError('Solo se permiten correos @sofka.com.co');
      return;
    }

    const found = CONTACTS.find((c) => c.email.toLowerCase() === trimmed);
    if (!found) {
      setError('Tu correo no está en la lista de integrantes del equipo CET');
      return;
    }

    setLoading(true);
    const result = await signIn('credentials', {
      email: trimmed,
      redirect: false,
    });

    if (result?.error) {
      setError('Error al iniciar sesión. Intenta de nuevo.');
      setLoading(false);
    } else {
      router.push('/home');
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/home' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-radial-glow">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo Block */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-12 h-12 bg-sofka-orange rounded-lg flex items-center justify-center">
            <svg width="18" height="20" viewBox="0 0 14 16" fill="none">
              <path d="M13 8L1 15V1L13 8Z" fill="white" />
            </svg>
          </div>
          <div>
            <h1 className="font-clash font-bold text-3xl tracking-tight">E-CET GAMES</h1>
            <p className="text-text-secondary text-sm">Equipo CET · sofka_</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-bg-card border border-border-card rounded-card overflow-hidden">
          {/* Gradient bar */}
          <div className="gradient-bar" />

          <div className="px-8 py-10">
            <h2 className="font-clash font-semibold text-xl mb-1 text-center">
              Inicia sesión
            </h2>
            <p className="text-text-secondary text-sm mb-8 text-center">
              Usa tu correo corporativo @sofka.com.co
            </p>

            {/* Google SSO Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold rounded-btn py-3 px-4 mb-6 hover:bg-gray-100 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continuar con Google
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-border-card" />
              <span className="text-text-muted text-xs">o con tu email</span>
              <div className="flex-1 h-px bg-border-card" />
            </div>

            {/* Email Login */}
            <form onSubmit={handleEmailLogin}>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="tu.nombre@sofka.com.co"
                className="w-full bg-bg-input border border-border-input rounded-btn px-4 py-3 text-[15px] text-white placeholder:text-text-muted focus:border-sofka-orange focus:shadow-[0_0_0_3px_rgba(255,126,8,0.15)] transition-all outline-none mb-4"
              />

              {error && (
                <div className="bg-sofka-danger/10 border border-sofka-danger/30 text-sofka-danger text-sm rounded-btn px-4 py-3 mb-4">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sofka-orange hover:bg-sofka-orange-hover text-white font-clash font-semibold text-base rounded-btn py-3 transition-colors disabled:opacity-50"
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-text-muted text-xs text-center mt-6">
          Solo miembros autorizados del equipo CET
        </p>
      </div>
    </div>
  );
}
