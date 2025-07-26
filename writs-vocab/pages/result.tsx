// pages/result.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Leaderboard from '@/components/Leaderboard';

interface Leader {
  rank: number;
  name: string;
  xp: number;
  isCurrent?: boolean;
}

export default function ResultPage() {
  const router = useRouter();
  const { setId, correct, wrong, bonus } = router.query;

  // parse query params
  const c = Array.isArray(correct)
    ? parseInt(correct[0], 10)
    : parseInt(correct as string, 10) || 0;
  const w = Array.isArray(wrong)
    ? parseInt(wrong[0], 10)
    : parseInt(wrong as string, 10) || 0;
  const b = Array.isArray(bonus)
    ? parseInt(bonus[0], 10)
    : parseInt(bonus as string, 10) || 0;

  const xpEarned = c * 10 - w * 2 + b;

  // local state
  const [name, setName]           = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [leaders, setLeaders]     = useState<Leader[]>([]);

  // fetch top‑10 leaderboard for this set
  async function fetchLeaders() {
    if (typeof setId !== 'string') return;
    const { data, error: lbErr } = await supabase
      .from('leaderboard')
      .select('name, score')
      .eq('set_id', setId)
      .order('score', { ascending: false })
      .limit(10);

    if (lbErr) {
      console.error(lbErr);
      return;
    }

    const list: Leader[] = (data || []).map((row, i) => ({
      rank: i + 1,
      name: row.name,
      xp: row.score,
      isCurrent:
        submitted &&
        row.name === name.trim() &&
        row.score === xpEarned,
    }));
    setLeaders(list);
  }

  // handle name submission
  async function handleSubmit() {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    setError(null);

    const { error: insErr } = await supabase
      .from('leaderboard')
      .insert([
        {
          set_id: setId as string,
          name: name.trim(),
          score: xpEarned,
        },
      ]);

    if (insErr) {
      setError(insErr.message);
    } else {
      setSubmitted(true);
      await fetchLeaders();
    }
  }

  // if page reloads with submitted=true, re‑fetch
  useEffect(() => {
    if (submitted) {
      fetchLeaders();
    }
  }, [submitted]);

  return (
    <div className="min-h-screen bg-[#FFFDF6] p-6 flex flex-col items-center">
      {/* Stats */}
      <h1 className="font-heading text-3xl font-bold text-[#002B42] mb-4">
        Your Results
      </h1>
      <p className="font-body text-[#002B42] mb-2">
        Correct: <strong>{c}</strong>    Wrong: <strong>{w}</strong>
      </p>
      <p className="font-body text-[#C90000] mb-6">
        XP earned: <strong>{xpEarned}</strong>
      </p>

      {/* Name entry or thank you */}
      {!submitted ? (
        <div className="w-full max-w-sm space-y-3 mb-8">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full border border-gray-300 p-2 rounded font-body text-[#002B42] placeholder-gray-400"
          />
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2 bg-[#002B42] text-white rounded-md font-body font-semibold hover:bg-blue-800 transition"
          >
            Submit for Leaderboard
          </button>
        </div>
      ) : (
        <p className="font-body text-[#002B42] mb-8">
          Thanks, <strong>{name.trim()}</strong>! Your score has been recorded.
        </p>
      )}

      {/* Show leaderboard once submitted */}
      {submitted && leaders.length > 0 && (
        <Leaderboard leaders={leaders} title="Global Leaderboard" />
      )}

      {/* Home button */}
      <button
        onClick={() => router.push('/')}
        className="mt-8 px-4 py-2 bg-gray-300 text-[#002B42] rounded-md font-body hover:bg-gray-400 transition"
      >
        Home
      </button>
    </div>
  );
}
