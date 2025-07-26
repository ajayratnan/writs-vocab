// pages/index.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type API_Set = { id: string; name: string; word_ids: string[] };
type Set     = { id: string; name: string; wordIds: string[] };

export default function HomePage() {
  const [sets, setSets]       = useState<Set[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    async function loadSets() {
      const { data, error } = await supabase
        .from('sets')
        .select('id,name,word_ids')
        .order('created_at', { ascending: true });
      if (error) {
        setError(error.message);
      } else {
        setSets(
          (data || []).map((r: API_Set) => ({
            id: r.id,
            name: r.name,
            wordIds: r.word_ids,
          }))
        );
      }
      setLoading(false);
    }
    loadSets();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* Hero */}
      <section className="bg-white rounded-card shadow-lg p-8 grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="font-heading text-3xl text-brand-navy">
            Welcome to WRITS Vocabulary Builder
          </h2>
          <p className="font-body text-gray-800 leading-relaxed">
            “Every word you master is a step towards confidence & success.”
            Sharpen your vocabulary with bite‑sized flashcards, synonyms,
            antonyms, and examples.
          </p>
          <blockquote className="italic text-[#C90000] font-body">
            “Words are the most powerful drug used by mankind.”
          </blockquote>
        </div>
        <img
          src="/images/vocab-hero.png"
          alt="Vocabulary Builder Illustration"
          className="rounded-card shadow-md w-full h-auto max-h-64 object-contain mx-auto"
        />
      </section>

      {/* Promo Posters */}
      <div className="grid grid-cols-2 gap-6">
        <img
          src="/images/clat-poster.svg"
          alt="CLAT Crash Batch 2026"
          className="rounded-card shadow-md w-full h-auto max-h-60 object-cover"
        />
        <img
          src="/images/fin-pioneers-poster.svg"
          alt="FIN Pioneers Batch 1"
          className="rounded-card shadow-md w-full h-auto max-h-60 object-cover"
        />
      </div>

       {/* Centered “Choose Your Set” Banner */}
      <div className="flex justify-center mt-12 mb-8">
        <h2
          className="
            bg-beige
            text-brand-navy
            font-heading
            text-2xl
            py-3 px-6
            rounded-full
            shadow-md
            text-center
          "
        >
          Choose Your Set
        </h2>
      </div>

      {/* Sets Grid */}
      {loading ? (
        <p className="text-center font-body text-gray-800">Loading sets…</p>
      ) : error ? (
        <p className="text-center font-body text-red-600">Error: {error}</p>
      ) : sets.length === 0 ? (
        <p className="text-center font-body text-gray-800">
          No sets available. Check back soon!
        </p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sets.map((s) => (
            <Link
              key={s.id}
              href={`/play/${s.id}`}
              className="flex flex-col bg-white rounded-card shadow-md hover:shadow-lg transition p-6"
            >
              <h3 className="font-heading text-2xl mb-2">{s.name}</h3>
              <p className="font-body mb-6">
                {s.wordIds.length} word{s.wordIds.length !== 1 && 's'}
              </p>

              {/* Always-on, hex‑based pill button */}
              <button
                className="
                  mt-auto 
                  bg-[#C90000] 
                  text-white 
                  font-body 
                  font-semibold 
                  py-2 px-4 
                  rounded-full 
                  transition
                "
              >
                Start Set
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
