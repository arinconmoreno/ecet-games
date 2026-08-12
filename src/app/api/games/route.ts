import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { GAMES } from '@/data/games';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sb = getServiceSupabase();

    // Get all registrations with user info
    const { data: registrations } = await sb
      .from('registrations')
      .select('*, user:users(id, name, email)');

    const gamesWithStats = GAMES.map((game) => {
      const gameRegs = (registrations || []).filter((r: any) => r.game_id === game.id);
      return {
        ...game,
        registeredCount: gameRegs.length,
        participants: gameRegs.map((r: any) => ({
          id: r.user?.id,
          name: r.user?.name,
          email: r.user?.email,
        })),
      };
    });

    return NextResponse.json(gamesWithStats);
  } catch {
    // Fallback with empty stats
    return NextResponse.json(
      GAMES.map((g) => ({ ...g, registeredCount: 0, participants: [] }))
    );
  }
}
