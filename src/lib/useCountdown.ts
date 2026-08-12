'use client';

import { useState, useEffect } from 'react';
import { REGISTRATION_DEADLINE } from '@/data/games';

export function useCountdown() {
  const [timeLeft, setTimeLeft] = useState('');
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diff = REGISTRATION_DEADLINE.getTime() - now.getTime();

      if (diff <= 0) {
        setIsPast(true);
        setTimeLeft('Inscripciones cerradas');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`Faltan ${days} día${days !== 1 ? 's' : ''} y ${hours} hora${hours !== 1 ? 's' : ''}`);
      } else if (hours > 0) {
        setTimeLeft(`Faltan ${hours} hora${hours !== 1 ? 's' : ''} y ${minutes} min`);
      } else {
        setTimeLeft(`Faltan ${minutes} minuto${minutes !== 1 ? 's' : ''}`);
      }
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return { timeLeft, isPast };
}
