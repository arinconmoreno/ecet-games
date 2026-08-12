'use client';

import { useState, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { GAMES } from '@/data/games';

interface Score {
  id: string;
  user_id: string;
  game_id: string;
  points: number;
  wins: number;
  user?: { id: string; name: string; email: string };
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function getMedalColor(pos: number) {
  if (pos === 0) return '#FFD700';
  if (pos === 1) return '#C0C0C0';
  if (pos === 2) return '#CD7F32';
  return undefined;
}

function LeaderboardContent() {
  const [activeGame, setActiveGame] = useState(GAMES[0].id);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = Date.now();
    fetch(`/api/scores?gameId=${activeGame}&t=${t}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setScores(d.scores || []))
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, [activeGame]);

  const game = GAMES.find((g) => g.id === activeGame)!;

  return (
    <div>
      <h1 className="font-clash font-bold text-2xl sm:text-3xl mb-6 animate-slide-up">
        Tabla de posiciones
      </h1>

      {/* Game Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 animate-slide-up animate-slide-up-delay-1">
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGame(g.id)}
            className="px-4 py-2 rounded-btn text-sm font-medium transition-all"
            style={{
              backgroundColor: activeGame === g.id ? g.accentColor : 'transparent',
              color: activeGame === g.id ? '#fff' : '#888',
              border: `1px solid ${activeGame === g.id ? g.accentColor : '#333'}`,
            }}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-bg-card border border-border-card rounded-card overflow-hidden animate-slide-up animate-slide-up-delay-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-sofka-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : scores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-muted">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="12" width="4" height="9" rx="1" />
              <rect x="10" y="6" width="4" height="15" rx="1" />
              <rect x="17" y="9" width="4" height="12" rx="1" />
            </svg>
            <p className="mt-3 text-sm">Aún no hay resultados para {game.name}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-card text-text-secondary text-xs uppercase tracking-wider">
                <th className="text-left py-3 px-4 w-12">#</th>
                <th className="text-left py-3 px-4">Jugador</th>
                <th className="text-right py-3 px-4">Puntos</th>
                <th className="text-right py-3 px-4">Victorias</th>
                <th className="text-right py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, i) => {
                const medalColor = getMedalColor(i);
                return (
                  <tr key={score.id} className="border-b border-border-card/50 hover:bg-[#1a1a1a] transition-colors">
                    <td className="py-3 px-4">
                      <span
                        className="font-clash font-bold text-base"
                        style={{ color: medalColor || '#888' }}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                          style={{
                            backgroundColor: medalColor
                              ? `${medalColor}20`
                              : 'rgba(255,126,8,0.15)',
                            color: medalColor || '#FF7E08',
                          }}
                        >
                          {getInitials(score.user?.name || '?')}
                        </div>
                        <span className="font-medium">{score.user?.name || 'Jugador'}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 font-mono font-semibold">
                      {score.points}
                    </td>
                    <td className="text-right py-3 px-4 font-mono">{score.wins}</td>
                    <td className="text-right py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-sofka-green bg-sofka-green/10 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-sofka-green" />
                        Activo
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <AuthGuard>
      <LeaderboardContent />
    </AuthGuard>
  );
}
