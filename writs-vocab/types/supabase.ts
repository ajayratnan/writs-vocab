// types/supabase.ts
export type Word = {
  id: string;
  word: string;
  meaning: string;       // correct answer
  distractor1: string;   // fake 1
  distractor2: string;   // fake 2
  distractor3: string;   // fake 3
  synonym1: string | null;
  synonym2: string | null;
  antonym1: string | null;
  antonym2: string | null;
  example: string;
  poster_url: string | null;
  created_at: string | null;
};
