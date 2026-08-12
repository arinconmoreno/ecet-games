import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getServiceSupabase } from '@/lib/supabase';
import { GAMES, REGISTRATION_DEADLINE } from '@/data/games';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Helper: find user by email
async function findUser(email: string) {
  const sb = getServiceSupabase();
  const { data: users, error } = await sb
    .from('users')
    .select('id, email, name')
    .ilike('email', email);

  if (error) return null;
  return users && users.length > 0 ? users[0] : null;
}

// Helper: no-cache response
function jsonResponse(data: any, status = 200) {
  const response = NextResponse.json(data, { status });
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Surrogate-Control', 'no-store');
  return response;
}

// GET: Get current user's registration
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return jsonResponse({ registration: null });
  }

  const user = await findUser(session.user.email);
  if (!user) {
    return jsonResponse({ registration: null });
  }

  const sb = getServiceSupabase();
  const { data: registrations } = await sb
    .from('registrations')
    .select('id, user_id, game_id, registered_at')
    .eq('user_id', user.id);

  const registration = registrations && registrations.length > 0 ? registrations[0] : null;
  return jsonResponse({ registration });
}

// POST: Register for a game
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return jsonResponse({ error: 'No autorizado' }, 401);
  }

  if (new Date() > REGISTRATION_DEADLINE) {
    return jsonResponse({ error: 'El periodo de inscripciones ha finalizado' }, 400);
  }

  const { gameId } = await req.json();
  const game = GAMES.find((g) => g.id === gameId);
  if (!game) {
    return jsonResponse({ error: 'Juego no válido' }, 400);
  }

  const user = await findUser(session.user.email);
  if (!user) {
    return jsonResponse({ error: 'Usuario no encontrado' }, 404);
  }

  const sb = getServiceSupabase();

  // Check if already registered
  const { data: existing } = await sb
    .from('registrations')
    .select('id')
    .eq('user_id', user.id);

  if (existing && existing.length > 0) {
    return jsonResponse({ error: 'Ya estás inscrito en otro juego. Debes darte de baja primero.' }, 400);
  }

  // Check capacity
  const { data: gameRegs } = await sb
    .from('registrations')
    .select('id')
    .eq('game_id', gameId);

  if ((gameRegs?.length || 0) >= game.maxPlayers) {
    return jsonResponse({ error: 'Cupos agotados para este juego' }, 400);
  }

  // Register
  const { data: created, error } = await sb
    .from('registrations')
    .insert({ user_id: user.id, game_id: gameId })
    .select('id, user_id, game_id, registered_at');

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ registration: created?.[0] || null });
}

// DELETE: Unregister from a game
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return jsonResponse({ error: 'No autorizado' }, 401);
  }

  if (new Date() > REGISTRATION_DEADLINE) {
    return jsonResponse({ error: 'El periodo de inscripciones ha finalizado' }, 400);
  }

  const user = await findUser(session.user.email);
  if (!user) {
    return jsonResponse({ error: 'Usuario no encontrado' }, 404);
  }

  const sb = getServiceSupabase();

  // Delete scores first
  await sb.from('scores').delete().eq('user_id', user.id);

  // Then delete registration
  const { error } = await sb
    .from('registrations')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ success: true });
}
