'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import { GAMES } from '@/data/games';
import { isAdminEmail } from '@/data/contacts';

interface Score {
  id?: string;
  user_id: string;
  game_id: string;
  points: number;
  wins: number;
  user?: { id: string; name: string; email: string };
}

interface Participant {
  id: string;
  name: string;
  email: string;
}

function AdminContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeGame, setActiveGame] = useState(GAMES[0].id);
  const [scores, setScores] = useState<Score[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, { points: number; wins: number }>>({});

  const email = session?.user?.email || '';
  const isAdmin = isAdminEmail(email);

  useEffect(() => {
    if (session && !isAdmin) {
      router.push('/home');
    }
  }, [session, isAdmin, router]);

  useEffect(() => {
    setLoading(true);
    const t = Date.now();
    Promise.all([
      fetch(`/api/scores?gameId=${activeGame}&t=${t}`, { cache: 'no-store' }).then((r) => r.json()),
      fetch(`/api/games?t=${t}`, { cache: 'no-store' }).then((r) => r.json()),
    ])
      .then(([scoresData, gamesData]) => {
        const gamesList = Array.isArray(gamesData) ? gamesData : (gamesData.games || []);
        const game = gamesList.find((g: any) => g.id === activeGame);
        const parts: Participant[] = game?.participants || [];
        setParticipants(parts);

        // Build score map
        const scoreMap: Record<string, Score> = {};
        (scoresData.scores || []).forEach((s: Score) => {
          scoreMap[s.user_id] = s;
        });

        // Merge participants with scores
        const merged: Score[] = parts.map((p) => ({
          user_id: p.id,
          game_id: activeGame,
          points: scoreMap[p.id]?.points || 0,
          wins: scoreMap[p.id]?.wins || 0,
          user: p,
        }));

        merged.sort((a, b) => b.points - a.points);
        setScores(merged);

        // Init edit values
        const ev: Record<string, { points: number; wins: number }> = {};
        merged.forEach((s) => {
          ev[s.user_id] = { points: s.points, wins: s.wins };
        });
        setEditValues(ev);
      })
      .catch(() => {
        setScores([]);
        setParticipants([]);
      })
      .finally(() => setLoading(false));
  }, [activeGame]);

  const handleSave = async (userId: string) => {
    setSaving(userId);
    const vals = editValues[userId];
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          gameId: activeGame,
          points: vals.points,
          wins: vals.wins,
        }),
      });

      // Update local state
      setScores((prev) =>
        prev
          .map((s) =>
            s.user_id === userId ? { ...s, points: vals.points, wins: vals.wins } : s
          )
          .sort((a, b) => b.points - a.points)
      );
    } catch {
      // silent
    } finally {
      setSaving(null);
    }
  };

  if (!isAdmin) return null;

  const game = GAMES.find((g) => g.id === activeGame)!;

  return (
    <div>
      <h1 className="font-clash font-bold text-2xl sm:text-3xl mb-2 animate-slide-up">
        Panel de Administración
      </h1>
      <p className="text-text-secondary text-sm mb-6 animate-slide-up">
        Gestiona los resultados y puntajes de cada juego
      </p>

      {/* Game Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 animate-slide-up animate-slide-up-delay-1">
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGame(g.id)}
            className="px-4 py-2 rounded-btn text-sm font-medium transition-all"
            style={{
              backgroundColor: activeGame === g.id ? '#06C8C8' : 'transparent',
              color: activeGame === g.id ? '#000' : '#888',
              border: `1px solid ${activeGame === g.id ? '#06C8C8' : '#333'}`,
            }}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Editable Table */}
      <div className="bg-bg-card border border-border-card rounded-card overflow-hidden animate-slide-up animate-slide-up-delay-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-sofka-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : scores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-muted">
            <p className="text-sm">No hay jugadores inscritos en {game.name}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-card text-text-secondary text-xs uppercase tracking-wider">
                  <th className="text-left py-3 px-4">Jugador</th>
                  <th className="text-center py-3 px-4 w-32">Puntos</th>
                  <th className="text-center py-3 px-4 w-32">Victorias</th>
                  <th className="text-center py-3 px-4 w-28">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score) => {
                  const ev = editValues[score.user_id] || { points: 0, wins: 0 };
                  const hasChanges =
                    ev.points !== score.points || ev.wins !== score.wins;

                  return (
                    <tr
                      key={score.user_id}
                      className="border-b border-border-card/50 hover:bg-[#1a1a1a] transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">
                        {score.user?.name || 'Jugador'}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          value={ev.points}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              [score.user_id]: {
                                ...prev[score.user_id],
                                points: parseInt(e.target.value) || 0,
                              },
                            }))
                          }
                          className="w-full bg-bg-input border border-border-input rounded px-3 py-1.5 text-center text-white focus:border-sofka-teal outline-none"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          value={ev.wins}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              [score.user_id]: {
                                ...prev[score.user_id],
                                wins: parseInt(e.target.value) || 0,
                              },
                            }))
                          }
                          className="w-full bg-bg-input border border-border-input rounded px-3 py-1.5 text-center text-white focus:border-sofka-teal outline-none"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleSave(score.user_id)}
                          disabled={saving === score.user_id || !hasChanges}
                          className="bg-sofka-teal text-black text-xs font-semibold px-4 py-1.5 rounded-btn hover:bg-[#05b0b0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {saving === score.user_id ? '...' : 'Guardar'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminContent />
    </AuthGuard>
  );
}
