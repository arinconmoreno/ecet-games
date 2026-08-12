export interface GameConfig {
  id: string;
  name: string;
  maxPlayers: number;
  mode: 'Virtual' | 'Presencial';
  location: string;
  accentColor: string;
  url?: string;
  image: string;
  description: string;
}

export const GAMES: GameConfig[] = [
  {
    id: 'stopots',
    name: 'Stopots',
    maxPlayers: 10,
    mode: 'Virtual',
    location: 'Cualquier sede o remoto',
    accentColor: '#FF7E08',
    url: 'https://stopots.com/es',
    image: '/images/game-stopots.svg',
    description: 'El clásico juego de categorías. ¡Demuestra tu velocidad mental!',
  },
  {
    id: 'gartic',
    name: 'Gartic.io',
    maxPlayers: 14,
    mode: 'Virtual',
    location: 'Cualquier sede o remoto',
    accentColor: '#06C8C8',
    url: 'https://gartic.io/',
    image: '/images/game-gartic.svg',
    description: 'Dibuja y adivina. Creatividad y rapidez en cada ronda.',
  },
  {
    id: 'fifa',
    name: 'FIFA 18',
    maxPlayers: 10,
    mode: 'Presencial',
    location: 'Sede Medellín',
    accentColor: '#9747FF',
    image: '/images/game-fifa.png',
    description: 'Torneo presencial de fútbol virtual. ¡Gol a gol!',
  },
  {
    id: 'cod',
    name: 'Call of Duty Infinite Warfare',
    maxPlayers: 10,
    mode: 'Presencial',
    location: 'Sede Medellín',
    accentColor: '#FE9CAB',
    image: '/images/game-cod.jpg',
    description: 'Combate táctico en equipo. ¿Tienes lo que se necesita?',
  },
];

export const REGISTRATION_DEADLINE = new Date('2026-08-14T23:59:59-05:00');

export const PRIZE_STRUCTURE = {
  first: { label: '1er Lugar', prize: '$200.000 COP / $65 USD', color: '#FFD700' },
  second: { label: '2do Lugar', prize: 'Reconocimiento E-CET', color: '#C0C0C0' },
  third: { label: '3er Lugar', prize: 'Reconocimiento E-CET', color: '#CD7F32' },
};

export function getGameById(id: string): GameConfig | undefined {
  return GAMES.find((g) => g.id === id);
}
