'use client';

import AuthGuard from '@/components/AuthGuard';
import { GAMES, PRIZE_STRUCTURE } from '@/data/games';

const RULES = [
  'Solo puedes inscribirte en 1 juego',
  'Las inscripciones cierran el 14 de agosto de 2026 a las 11:59 PM COT',
  'El premio del 1er lugar se entrega como donación a afectados por el terremoto a nombre del ganador',
  'Los reconocimientos E-CET se entregarán digitalmente',
  'Los juegos presenciales se realizarán en la sede de Medellín',
  'Los juegos virtuales se pueden jugar desde cualquier ubicación',
];

function PrizesContent() {
  return (
    <div>
      <h1 className="font-clash font-bold text-2xl sm:text-3xl mb-2 animate-slide-up">
        Premios
      </h1>
      <p className="text-text-secondary text-sm mb-8 animate-slide-up">
        Reconocimientos para los mejores jugadores de cada categoría
      </p>

      {/* Prize Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {GAMES.map((game, idx) => (
          <div
            key={game.id}
            className={`bg-bg-card border border-border-card rounded-card overflow-hidden animate-slide-up animate-slide-up-delay-${idx + 1}`}
          >
            {/* Banner */}
            <div className="relative h-[100px] overflow-hidden bg-[#1a1a1a]">
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-full object-cover opacity-70"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
            </div>

            <div className="p-5">
              <h3 className="font-clash font-bold text-base mb-0.5">{game.name}</h3>
              <span
                className="inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-badge mb-4"
                style={{
                  backgroundColor: game.mode === 'Virtual' ? 'rgba(6,200,200,0.15)' : 'rgba(151,71,255,0.15)',
                  color: game.mode === 'Virtual' ? '#06C8C8' : '#9747FF',
                }}
              >
                {game.mode}
              </span>

              {/* Prizes */}
              <div className="flex flex-col gap-3">
                {/* 1st */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-[#FFD700] to-[#B8860B] text-black shrink-0">
                    1°
                  </div>
                  <div>
                    <p className="text-sofka-orange font-clash font-bold text-sm">
                      {PRIZE_STRUCTURE.first.prize}
                    </p>
                  </div>
                </div>
                {/* 2nd */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-[#C0C0C0] to-[#808080] text-black shrink-0">
                    2°
                  </div>
                  <p className="text-text-secondary text-sm">{PRIZE_STRUCTURE.second.prize}</p>
                </div>
                {/* 3rd */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-[#CD7F32] to-[#8B5A2B] text-white shrink-0">
                    3°
                  </div>
                  <p className="text-text-secondary text-sm">{PRIZE_STRUCTURE.third.prize}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rules Section */}
      <div className="bg-bg-card border border-border-card rounded-card p-6 animate-slide-up">
        <h2 className="font-clash font-bold text-lg mb-4">Reglas del torneo</h2>
        <div className="flex flex-col gap-2.5">
          {RULES.map((rule, i) => (
            <div key={i} className="flex items-start gap-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="shrink-0 mt-0.5"
              >
                <path
                  d="M7.5 12.5L3.5 8.5L4.9 7.1L7.5 9.7L13.1 4.1L14.5 5.5L7.5 12.5Z"
                  fill="#FF7E08"
                />
              </svg>
              <span className="text-text-secondary text-sm">{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PrizesPage() {
  return (
    <AuthGuard>
      <PrizesContent />
    </AuthGuard>
  );
}
