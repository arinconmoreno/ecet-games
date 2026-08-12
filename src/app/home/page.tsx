'use client';

import { useSession } from 'next-auth/react';
import AuthGuard from '@/components/AuthGuard';
import { useCountdown } from '@/lib/useCountdown';
import { useGameData } from '@/lib/useGameData';
import Link from 'next/link';

function GameCard({ game }: { game: any }) {
  const pct = (game.registeredCount / game.maxPlayers) * 100;
  return (
    <Link href="/games" className="block group">
      <div className="bg-bg-card border border-border-card rounded-card overflow-hidden hover:border-[#333] transition-colors">
        {/* Banner */}
        <div className="relative h-[120px] overflow-hidden bg-[#1a1a1a]">
          {game.image && (
            <img
              src={game.image}
              alt={game.name}
              className="w-full h-full object-cover opacity-[0.85] group-hover:opacity-100 transition-opacity"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 to-transparent" />
          {/* Mode badge */}
          <span
            className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-badge"
            style={{
              backgroundColor: game.mode === 'Virtual' ? 'rgba(6,200,200,0.2)' : 'rgba(151,71,255,0.2)',
              color: game.mode === 'Virtual' ? '#06C8C8' : '#9747FF',
            }}
          >
            {game.mode}
          </span>
          {/* Counter */}
          <span className="absolute top-3 right-3 text-xs font-mono text-text-secondary bg-black/50 px-2 py-0.5 rounded">
            {game.registeredCount}/{game.maxPlayers}
          </span>
        </div>

        <div className="p-4">
          <h3 className="font-clash font-bold text-lg mb-1">{game.name}</h3>
          <p className="text-text-secondary text-sm mb-3 line-clamp-2">{game.description}</p>
          {/* Capacity bar */}
          <div className="capacity-bar">
            <div
              className="capacity-fill"
              style={{ width: `${pct}%`, backgroundColor: game.accentColor }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

function HomeContent() {
  const { data: session } = useSession();
  const { timeLeft, isPast } = useCountdown();
  const { games, myRegistration, loading, totalRegistered, totalCapacity } = useGameData();
  const userName = session?.user?.name || '';
  const myGameName = myRegistration
    ? games.find((g) => g.id === myRegistration.game_id)?.name || '—'
    : 'Sin inscripción';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-sofka-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8 animate-slide-up">
        <span className="text-sofka-orange text-xs font-bold uppercase tracking-widest">
          Bienvenido/a
        </span>
        <h1 className="font-clash font-bold text-2xl sm:text-3xl mt-1">{userName}</h1>
        <p className="text-text-secondary text-sm mt-1">
          {isPast ? '🔒 Inscripciones cerradas' : `⏱ ${timeLeft} para el cierre de inscripciones`}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 animate-slide-up animate-slide-up-delay-1">
        <div className="bg-bg-card border border-border-card rounded-card p-5">
          <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
            Jugadores inscritos
          </p>
          <p className="font-clash font-bold text-3xl text-sofka-orange">{totalRegistered}</p>
        </div>
        <div className="bg-bg-card border border-border-card rounded-card p-5">
          <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
            Cupos disponibles
          </p>
          <p className="font-clash font-bold text-3xl text-sofka-teal">
            {totalCapacity - totalRegistered}
          </p>
        </div>
        <div className="bg-bg-card border border-border-card rounded-card p-5">
          <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
            Tu juego
          </p>
          <p className="font-clash font-bold text-xl text-sofka-violet">{myGameName}</p>
        </div>
      </div>

      {/* Games Grid */}
      <h2 className="font-clash font-bold text-xl mb-4 animate-slide-up animate-slide-up-delay-2">
        Juegos disponibles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up animate-slide-up-delay-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}
