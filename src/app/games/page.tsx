'use client';

import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { useCountdown } from '@/lib/useCountdown';
import { useGameData, GameWithStats } from '@/lib/useGameData';

function GameRow({
  game,
  myRegistration,
  isPast,
  onRegister,
  onUnregister,
}: {
  game: GameWithStats;
  myRegistration: { game_id: string } | null;
  isPast: boolean;
  onRegister: (id: string) => Promise<void>;
  onUnregister: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [error, setError] = useState('');
  const isRegisteredHere = myRegistration?.game_id === game.id;
  const isRegisteredElsewhere = myRegistration && !isRegisteredHere;
  const isFull = game.registeredCount >= game.maxPlayers;
  const pct = (game.registeredCount / game.maxPlayers) * 100;

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      await onRegister(game.id);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    setLoading(true);
    setError('');
    try {
      await onUnregister();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-card border border-border-card rounded-card p-5 animate-slide-up">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Thumbnail */}
        <div className="w-20 h-20 rounded-[10px] overflow-hidden bg-[#1a1a1a] shrink-0">
          <img
            src={game.image}
            alt={game.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <h3 className="font-clash font-bold text-lg sm:text-xl">{game.name}</h3>
              <span
                className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-badge mt-1"
                style={{
                  backgroundColor:
                    game.mode === 'Virtual' ? 'rgba(6,200,200,0.15)' : 'rgba(151,71,255,0.15)',
                  color: game.mode === 'Virtual' ? '#06C8C8' : '#9747FF',
                }}
              >
                {game.mode} · {game.location}
              </span>
            </div>
          </div>

          <p className="text-text-secondary text-sm mt-2">{game.description}</p>

          {/* Capacity */}
          <div className="mt-3 mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-text-secondary">
                {game.registeredCount} / {game.maxPlayers} jugadores
              </span>
              {game.url && (
                <a
                  href={game.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sofka-orange hover:underline"
                >
                  Ir al juego ↗
                </a>
              )}
            </div>
            <div className="capacity-bar">
              <div
                className="capacity-fill"
                style={{ width: `${pct}%`, backgroundColor: game.accentColor }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            {isPast ? (
              <span className="text-text-muted text-sm italic">Inscripciones cerradas</span>
            ) : isRegisteredHere ? (
              <>
                <span className="text-sofka-green text-sm font-semibold flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6.5 12.5L2 8l1.4-1.4L6.5 9.7l6.1-6.1L14 5l-7.5 7.5z" />
                  </svg>
                  Inscrito
                </span>
                <button
                  onClick={handleUnregister}
                  disabled={loading}
                  className="text-sm border border-sofka-danger/40 text-sofka-danger px-3 py-1.5 rounded-btn hover:bg-sofka-danger/10 transition-colors disabled:opacity-50"
                >
                  {loading ? '...' : 'Darme de baja'}
                </button>
              </>
            ) : isRegisteredElsewhere ? (
              <span className="text-text-muted text-sm italic">
                Ya estás inscrito en otro juego
              </span>
            ) : isFull ? (
              <span className="text-text-muted text-sm italic">Cupos agotados</span>
            ) : (
              <button
                onClick={handleRegister}
                disabled={loading}
                className="text-sm font-semibold bg-sofka-orange hover:bg-sofka-orange-hover text-white px-5 py-2 rounded-btn transition-colors disabled:opacity-50"
              >
                {loading ? 'Inscribiendo...' : 'Inscribirme'}
              </button>
            )}
          </div>

          {error && (
            <p className="text-sofka-danger text-xs mt-2">{error}</p>
          )}
        </div>
      </div>

      {/* Participants expandable */}
      {game.participants.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border-card">
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="text-xs text-text-secondary hover:text-white transition-colors flex items-center gap-1"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="currentColor"
              className={`transition-transform ${showParticipants ? 'rotate-90' : ''}`}
            >
              <path d="M4.5 2L8.5 6L4.5 10V2Z" />
            </svg>
            {game.participants.length} participante{game.participants.length !== 1 ? 's' : ''}
          </button>
          {showParticipants && (
            <div className="flex flex-wrap gap-2 mt-3">
              {game.participants.map((p: any) => (
                <span
                  key={p.id || p.email}
                  className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] text-text-secondary px-3 py-1 rounded-full"
                >
                  {p.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GamesContent() {
  const { timeLeft, isPast } = useCountdown();
  const { games, myRegistration, loading, register, unregister } = useGameData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-sofka-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 animate-slide-up">
        <h1 className="font-clash font-bold text-2xl sm:text-3xl">Elige tu juego</h1>
        <p className="text-text-secondary text-sm mt-1">
          Solo puedes inscribirte en 1 juego.{' '}
          {!isPast && (
            <>
              Inscripciones abiertas hasta el{' '}
              <span className="text-sofka-orange font-semibold">14 de agosto de 2026</span>
            </>
          )}
        </p>
      </div>

      {isPast && (
        <div className="bg-sofka-danger/10 border border-sofka-danger/30 text-sofka-danger text-sm rounded-btn px-4 py-3 mb-6">
          ⚠️ El periodo de inscripciones ha finalizado. No es posible realizar cambios.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {games.map((game) => (
          <GameRow
            key={game.id}
            game={game}
            myRegistration={myRegistration}
            isPast={isPast}
            onRegister={register}
            onUnregister={unregister}
          />
        ))}
      </div>
    </div>
  );
}

export default function GamesPage() {
  return (
    <AuthGuard>
      <GamesContent />
    </AuthGuard>
  );
}
