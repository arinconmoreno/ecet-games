import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { GAMES } from '@/data/games';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sb = getServiceSupabase();

    // Simple query first - no joins
    const { data: registrations, error: regError } = await sb
      .from('registrations')
      .select('id, user_id, game_id');

    if (regError) {
      return NextResponse.json({
        error: 'registrations query failed',
        details: regError.message,
        hint: regError.hint,
      }, { status: 500 });
    }

    // Get users separately
    const { data: users, error: usersError } = await sb
      .from('users')
      .select('id, name, email');

    if (usersError) {
      return NextResponse.json({
        error: 'users query failed',
        details: usersError.message,
      }, { status: 500 });
    }

    const userMap = new Map((users || []).map((u: any) => [u.id, u]));

    const gamesWithStats = GAMES.map((game) => {
      const gameRegs = (registrations || []).filter((r: any) => r.game_id === game.id);
      return {
        ...game,
        registeredCount: gameRegs.length,
        participants: gameRegs.map((r: any) => {
          const user = userMap.get(r.user_id);
          return {
            id: r.user_id,
            name: user?.name || 'Unknown',
            email: user?.email || '',
          };
        }),
      };
    });

    return NextResponse.json(gamesWithStats);
  } catch (err: any) {
    return NextResponse.json({
      error: 'unexpected error',
      message: err.message,
    }, { status: 500 });
  }
}
