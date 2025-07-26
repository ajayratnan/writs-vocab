// components/FlashCard.tsx
import { useMemo, useState, useEffect, useRef } from 'react';
import type { Word } from '@/types/supabase';

interface FlashCardProps {
  data: Word;
  duration?: number;           // seconds
  isRetry: boolean;            // show retry banner if true
  onConfirm: (correct: boolean, bonus: number) => void;
}

export default function FlashCard({
  data,
  duration = 30,
  isRetry,
  onConfirm,
}: FlashCardProps) {
  // 1) Message pools
  const wrongMsgs    = [
    "Oops! That wasn’t quite right. Let’s try again.",
    "Close, but not quite—give it another shot!",
    "Not exactly—one more try.",
    "Almost there! You can nail it.",
  ];
  const retryBanners = [
    "You missed this one before—show it who’s boss!",
    "Last time was tricky—now you’ve got this!",
    "Retry time—make it count!",
    "Wrong before; let’s get it right now!",
  ];
  const correctMsgs  = [
    "Well done! That’s correct.",
    "Great job—you got it!",
    "Fantastic! You nailed it.",
    "Correct—nice work!",
  ];

  const [wrongMsg]    = useState(() => wrongMsgs[Math.floor(Math.random() * wrongMsgs.length)]);
  const [retryBanner] = useState(() => retryBanners[Math.floor(Math.random() * retryBanners.length)]);
  const [correctMsg]  = useState(() => correctMsgs[Math.floor(Math.random() * correctMsgs.length)]);

  // 2) Build & shuffle options from meaning + distractors
  const choices = useMemo(() => {
    return [
      data.meaning,
      data.distractor1,
      data.distractor2,
      data.distractor3,
    ].sort(() => 0.5 - Math.random());
  }, [data.id]);

  // 3) State & timer
  const [picked, setPicked]     = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 4) Text-to-Speech
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  function speak(text: string) {
    if (utteranceRef.current) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    utteranceRef.current = u;
    speechSynthesis.speak(u);
  }

  useEffect(() => {
    if (picked !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0) {
          clearInterval(timerRef.current!);
          setPicked('');       // mark answered
          onConfirm(false, 0); // timeout = wrong
          return 0;
        }
        return +(t - 0.1).toFixed(1);
      });
    }, 100);
    return () => clearInterval(timerRef.current!);
  }, [picked, onConfirm]);

  function handleSelect(choice: string) {
    clearInterval(timerRef.current!);
    setPicked(choice);
  }

  function handleNext() {
    const correct = picked === data.meaning;
    const bonus   = correct ? Math.floor((timeLeft / duration) * 5) : 0;
    onConfirm(correct, bonus);
    setPicked(null);
    setTimeLeft(duration);
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-[#FFFDF6] rounded-[16px] shadow border border-[#F5F3EE]">
      {/* Retry banner */}
      {isRetry && (
        <div className="mb-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md text-center font-body">
          {retryBanner}
        </div>
      )}

      {/* Timer bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
        <div
          className="h-2 rounded-full bg-[#C90000] transition-all"
          style={{ width: `${(timeLeft / duration) * 100}%` }}
        />
      </div>

      {/* Word heading + TTS icon */}
      <div className="flex items-center justify-center mb-8">
        <h2 className="font-heading text-[38px] text-[#002B42] font-bold capitalize">
          {data.word}
        </h2>
        <button
          onClick={() => speak(data.word)}
          className="ml-3 p-1 text-[#002B42] hover:text-[#C90000] transition"
          aria-label="Pronounce word"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5L6 9H2v6h4l5 4V5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.54 8.46a5 5 0 010 7.08M17.66 6.34a9 9 0 010 12.72"
            />
          </svg>
        </button>
      </div>

      {/* Options */}
      <div className="space-y-[20px] mb-6">
        {choices.map((c) => {
          const base     = 'w-full h-[56px] rounded-[12px] text-[18px] font-body font-semibold transition-colors';
          const idle     = 'bg-[#F5F3EE] text-[#002B42] hover:bg-gray-300';
          const correctC = 'bg-green-600 text-white';
          const wrongC   = 'bg-[#C90000] text-white';
          const faded    = 'bg-[#F5F3EE] text-gray-400';

          let cls = idle;
          if (picked !== null) {
            if (c === data.meaning) cls = correctC;
            else if (c === picked)   cls = wrongC;
            else                      cls = faded;
          }

          return (
            <button
              key={c}
              disabled={picked !== null}
              onClick={() => handleSelect(c)} 
              className={`${base} ${cls}`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Feedback, details, and Next button */}
      {picked !== null && (
        <>
          {picked !== data.meaning && (
            <div className="mb-3 text-center text-[#C90000] font-body">
              {wrongMsg}
            </div>
          )}

          <div className="space-y-1 text-[16px] font-body text-[#002B42]">
            <p><strong>Synonyms:</strong> {data.synonym1}, {data.synonym2}</p>
            <p><strong>Antonyms:</strong> {data.antonym1}, {data.antonym2}</p>
            <p className="italic flex items-center">
              <strong>Example:</strong>&nbsp;{data.example}
              <button
                onClick={() => speak(data.example)}
                className="ml-2 p-1 text-[#002B42] hover:text-[#C90000] transition"
                aria-label="Pronounce example"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5L6 9H2v6h4l5 4V5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.54 8.46a5 5 0 010 7.08M17.66 6.34a9 9 0 010 12.72"
                  />
                </svg>
              </button>
            </p>
          </div>

          {picked === data.meaning && (
            <div className="mt-4 mb-2 text-center text-green-700 font-body">
              {correctMsg}
            </div>
          )}

          <button
            onClick={handleNext}
            className="w-full h-[48px] mt-6 bg-[#C90000] text-white rounded-[12px] font-body font-semibold text-[18px] hover:bg-red-700 transition"
          >
            Next ➜
          </button>
        </>
      )}
    </div>
  );
}

