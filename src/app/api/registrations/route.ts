import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getServiceSupabase } from '@/lib/supabase';
import { GAMES, REGISTRATION_DEADLINE } from '@/data/games';

export const dynamic = 'force-dynamic';

// Helper: find user by email (case-insensitive)
async function findUser(email: string) {
  const sb = getServiceSupabase();
  const { data: users, error } = await sb
    .from('users')
    .select('id, email, name')
    .ilike('email', email);

  if (error) return { user: null, error: error.message };
  if (!users || users.length === 0) return { user: null, error: 'User not found in DB' };
  return { user: users[0], error: null };
}

// GET: Get current user's registration
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ registration: null, debug: 'no session' });
  }

  const { user, error: userError } = await findUser(session.user.email);
  if (!user) {
    return NextResponse.json({ registration: null, debug: userError });
  }

  const sb = getServiceSupabase();
  const { data: registrations, error: regError } = await sb
    .from('registrations')
    .select('*')
    .eq('user_id', user.id);

  if (regError) {
    return NextResponse.json({ registration: null, debug: regError.message });
  }

  const registration = registrations && registrations.length > 0 ? registrations[0] : null;

  const response = NextResponse.json({ registration });
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  return response;
}

// POST: Register for a game
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (new Date() > REGISTRATION_DEADLINE) {
    return NextResponse.json(
      { error: 'El periodo de inscripciones ha finalizado' },
      { status: 400 }
    );
  }

  const { gameId } = await req.json();
  const game = GAMES.find((g) => g.id === gameId);
  if (!game) {
    return NextResponse.json({ error: 'Juego no válido' }, { status: 400 });
  }

  const { user, error: userError } = await findUser(session.user.email);
  if (!user) {
    return NextResponse.json({ error: `Usuario no encontrado: ${userError}` }, { status: 404 });
  }

  const sb = getServiceSupabase();

  // Check if already registered
  const { data: existing } = await sb
    .from('registrations')
    .select('id')
    .eq('user_id', user.id);

  if (existing && existing.length > 0) {
    return NextResponse.json(
      { error: 'Ya estás inscrito en otro juego. Debes darte de baja primero.' },
      { status: 400 }
    );
  }

  // Check capacity
  const { data: gameRegs } = await sb
    .from('registrations')
    .select('id')
    .eq('game_id', gameId);

  if ((gameRegs?.length || 0) >= game.maxPlayers) {
    return NextResponse.json({ error: 'Cupos agotados para este juego' }, { status: 400 });
  }

  // Register
  const { data: registration, error } = await sb
    .from('registrations')
    .insert({ user_id: user.id, game_id: gameId })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ registration });
}

// DELETE: Unregister from a game
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (new Date() > REGISTRATION_DEADLINE) {
    return NextResponse.json(
      { error: 'El periodo de inscripciones ha finalizado' },
      { status: 400 }
    );
  }

  const { user, error: userError } = await findUser(session.user.email);
  if (!user) {
    return NextResponse.json({ error: `Usuario no encontrado: ${userError}` }, { status: 404 });
  }

  const sb = getServiceSupabase();
  const { error } = await sb
    .from('registrations')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
