export interface DbUser {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export interface DbRegistration {
  id: string;
  user_id: string;
  game_id: string;
  registered_at: string;
  user?: DbUser;
}

export interface DbScore {
  id: string;
  user_id: string;
  game_id: string;
  points: number;
  wins: number;
  updated_at: string;
  updated_by: string;
  user?: DbUser;
}

export interface GameStats {
  gameId: string;
  registeredCount: number;
  participants: Array<{ id: string; name: string; email: string }>;
}
