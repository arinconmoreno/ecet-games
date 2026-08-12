import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getServiceSupabase } from '@/lib/supabase';
import { isAdminEmail } from '@/data/contacts';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Helper: no-cache response
function jsonResponse(data: any, status = 200) {
  const response = NextResponse.json(data, { status });
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Surrogate-Control', 'no-store');
  return response;
}

// Helper: find user by email
async function findUser(email: string) {
  const sb = getServiceSupabase();
  const { data: users } = await sb
    .from('users')
    .select('id, email, name')
    .ilike('email', email);
  return users && users.length > 0 ? users[0] : null;
}

// GET: Get scores for a game
export async function GET(req: NextRequest) {
  const gameId = req.nextUrl.searchParams.get('gameId');

  try {
    const sb = getServiceSupabase();

    let query = sb.from('scores').select('id, user_id, game_id, points, wins');
    if (gameId) query = query.eq('game_id', gameId);
    const { data: scores, error: scoresError } = await query.order('points', { ascending: false });

    if (scoresError) {
      return jsonResponse({ scores: [], error: scoresError.message });
    }

    const { data: users } = await sb.from('users').select('id, name, email');
    const userMap = new Map((users || []).map((u: any) => [u.id, u]));

    const enrichedScores = (scores || []).map((s: any) => ({
      ...s,
      user: userMap.get(s.user_id) || { id: s.user_id, name: 'Unknown', email: '' },
    }));

    return jsonResponse({ scores: enrichedScores });
  } catch (err: any) {
    return jsonResponse({ scores: [], error: err.message });
  }
}

// POST: Update scores (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    return jsonResponse({ error: 'No autorizado' }, 403);
  }

  const { userId, gameId, points, wins } = await req.json();

  try {
    const sb = getServiceSupabase();

    const admin = await findUser(session.user.email);

    // Check if score exists
    const { data: existing } = await sb
      .from('scores')
      .select('id')
      .eq('user_id', userId)
      .eq('game_id', gameId);

    let result;
    if (existing && existing.length > 0) {
      const { data, error } = await sb
        .from('scores')
        .update({
          points: points || 0,
          wins: wins || 0,
          updated_by: admin?.id || null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('game_id', gameId)
        .select();

      if (error) return jsonResponse({ error: error.message }, 500);
      result = data;
    } else {
      const { data, error } = await sb
        .from('scores')
        .insert({
          user_id: userId,
          game_id: gameId,
          points: points || 0,
          wins: wins || 0,
          updated_by: admin?.id || null,
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) return jsonResponse({ error: error.message }, 500);
      result = data;
    }

    return jsonResponse({ score: result?.[0] || null, success: true });
  } catch (err: any) {
    return jsonResponse({ error: err.message }, 500);
  }
}
