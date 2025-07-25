// pages/play/[setId].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import FlashCard from '@/components/FlashCard';
import { supabase } from '@/lib/supabaseClient';
import type { Word } from '@/types/supabase';

export default function PlayPage() {
  const router = useRouter();
  const { setId } = router.query;

  const [queue, setQueue]     = useState<Word[]>([]);
  const [retryQ, setRetryQ]   = useState<Word[]>([]);
  const [current, setCurrent] = useState<Word | null>(null);
  const [isRetry, setIsRetry] = useState(false);
  const [loading, setLoading] = useState(true);

  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount]     = useState(0);
  const [bonusXP, setBonusXP]           = useState(0);

  // 1️⃣ Fetch & shuffle
  useEffect(() => {
    if (typeof setId !== 'string') return;

    (async () => {
      const { data: sd, error: se } = await supabase
        .from('sets')
        .select('word_ids')
        .eq('id', setId)
        .single();
      if (se || !sd) {
        alert('Set not found');
        router.push('/');
        return;
      }

      const { data: wd, error: we } = await supabase
        .from('words')
        .select('*')
        .in('id', sd.word_ids);
      const words = (wd || []) as Word[];
      if (we || words.length === 0) {
        alert('No words in set');
        router.push('/');
        return;
      }

      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setQueue(shuffled.slice(1));
      setCurrent(shuffled[0]);
      setLoading(false);
    })();
  }, [setId, router]);

  // 2️⃣ Advance / redirect (fixed to include setId)
  useEffect(() => {
    if (loading) return;
    if (current) return;

    if (queue.length) {
      setCurrent(queue[0]);
      setQueue(queue.slice(1));
      setIsRetry(false);
    } else if (retryQ.length) {
      setCurrent(retryQ[0]);
      setRetryQ(retryQ.slice(1));
      setIsRetry(true);
    } else {
      // ← include setId here
      router.push(
        `/result?setId=${setId}&correct=${correctCount}&wrong=${wrongCount}&bonus=${bonusXP}`
      );
    }
  }, [
    loading,
    current,
    queue,
    retryQ,
    correctCount,
    wrongCount,
    bonusXP,
    router,
    setId,
  ]);

  if (loading || !current) {
    return <p className="text-center mt-10 text-[#002B42]">Loading cards…</p>;
  }

  return (
    <div className="px-4">
      <FlashCard
        duration={30}
        data={current}
        isRetry={isRetry}
        onConfirm={(correct, bonus) => {
          if (correct) {
            setCorrectCount((c) => c + 1);
            setBonusXP((b) => b + bonus);
          } else {
            setWrongCount((w) => w + 1);
            setRetryQ((r) => [...r, current]);
          }
          setCurrent(null);
        }}
      />
    </div>
  );
}
