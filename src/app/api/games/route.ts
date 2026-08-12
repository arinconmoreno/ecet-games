import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { GAMES } from '@/data/games';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET() {
  try {
    const sb = getServiceSupabase();

    const { data: registrations, error: regError } = await sb
      .from('registrations')
      .select('id, user_id, game_id');

    if (regError) {
      return NextResponse.json({
        error: 'registrations query failed',
        details: regError.message,
      }, { status: 500 });
    }

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

    const response = NextResponse.json(gamesWithStats);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Surrogate-Control', 'no-store');
    return response;
  } catch (err: any) {
    return NextResponse.json({
      error: 'unexpected error',
      message: err.message,
    }, { status: 500 });
  }
}
