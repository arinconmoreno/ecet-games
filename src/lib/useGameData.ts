'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameConfig } from '@/data/games';

export interface GameWithStats extends GameConfig {
  registeredCount: number;
  participants: Array<{ id: string; name: string; email: string }>;
}

export function useGameData() {
  const [games, setGames] = useState<GameWithStats[]>([]);
  const [myRegistration, setMyRegistration] = useState<{ game_id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const t = Date.now();
      const [gamesRes, regRes] = await Promise.all([
        fetch(`/api/games?t=${t}`, { cache: 'no-store' }),
        fetch(`/api/registrations?t=${t}`, { cache: 'no-store' }),
      ]);
      const gamesData = await gamesRes.json();
      const regData = await regRes.json();
      setGames(gamesData);
      setMyRegistration(regData.registration);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const register = async (gameId: string) => {
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    await refresh();
    return data;
  };

  const unregister = async () => {
    const res = await fetch('/api/registrations', { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    await refresh();
    return data;
  };

  const totalRegistered = games.reduce((sum, g) => sum + g.registeredCount, 0);
  const totalCapacity = games.reduce((sum, g) => sum + g.maxPlayers, 0);

  return {
    games,
    myRegistration,
    loading,
    refresh,
    register,
    unregister,
    totalRegistered,
    totalCapacity,
  };
}
