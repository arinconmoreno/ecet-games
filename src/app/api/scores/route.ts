import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getServiceSupabase } from '@/lib/supabase';
import { isAdminEmail } from '@/data/contacts';

export const dynamic = 'force-dynamic';

// GET: Get scores for a game
export async function GET(req: NextRequest) {
  const gameId = req.nextUrl.searchParams.get('gameId');

  try {
    const sb = getServiceSupabase();

    let query = sb.from('scores').select('*, user:users(id, name, email)');
    if (gameId) query = query.eq('game_id', gameId);

    const { data: scores } = await query.order('points', { ascending: false });

    return NextResponse.json({ scores: scores || [] });
  } catch {
    return NextResponse.json({ scores: [] });
  }
}

// POST: Update scores (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { userId, gameId, points, wins } = await req.json();

  try {
    const sb = getServiceSupabase();

    // Get admin user id
    const { data: admin } = await sb
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    // Upsert score
    const { data, error } = await sb
      .from('scores')
      .upsert(
        {
          user_id: userId,
          game_id: gameId,
          points: points || 0,
          wins: wins || 0,
          updated_by: admin?.id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,game_id' }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ score: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
