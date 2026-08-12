import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getServiceSupabase } from '@/lib/supabase';
import { GAMES, REGISTRATION_DEADLINE } from '@/data/games';

export const dynamic = 'force-dynamic';

// GET: Get current user's registration
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const sb = getServiceSupabase();
    const { data: user } = await sb
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!user) return NextResponse.json({ registration: null });

    const { data: registration } = await sb
      .from('registrations')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({ registration });
  } catch {
    return NextResponse.json({ registration: null });
  }
}

// POST: Register for a game
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Check deadline
  if (new Date() > REGISTRATION_DEADLINE) {
    return NextResponse.json(
      { error: 'El periodo de inscripciones ha finalizado' },
      { status: 400 }
    );
  }

  const { gameId } = await req.json();

  // Validate game
  const game = GAMES.find((g) => g.id === gameId);
  if (!game) {
    return NextResponse.json({ error: 'Juego no válido' }, { status: 400 });
  }

  try {
    const sb = getServiceSupabase();

    // Get user
    const { data: user } = await sb
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Check if already registered
    const { data: existing } = await sb
      .from('registrations')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Ya estás inscrito en otro juego. Debes darte de baja primero.' },
        { status: 400 }
      );
    }

    // Check capacity
    const { count } = await sb
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('game_id', gameId);

    if ((count || 0) >= game.maxPlayers) {
      return NextResponse.json({ error: 'Cupos agotados para este juego' }, { status: 400 });
    }

    // Register
    const { data: registration, error } = await sb
      .from('registrations')
      .insert({ user_id: user.id, game_id: gameId })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ registration });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error al inscribirse' }, { status: 500 });
  }
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

  try {
    const sb = getServiceSupabase();

    const { data: user } = await sb
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    await sb.from('registrations').delete().eq('user_id', user.id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
