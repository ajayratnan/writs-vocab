// components/Leaderboard.tsx
import React from 'react';

interface Leader {
  rank: number;
  name: string;
  xp: number;
  isCurrent?: boolean;
}

interface LeaderboardProps {
  leaders: Leader[];
  title?: string;
}

export default function Leaderboard({
  leaders,
  title = 'Top Performers',
}: LeaderboardProps) {
  return (
    <div className="max-w-lg mx-auto bg-[#FFFDF6] rounded-2xl shadow-lg p-6">
      {/* Title */}
      <h2 className="text-2xl font-heading font-bold text-[#002B42] mb-6 text-center">
        {title}
      </h2>

      {/* Top 3 Spotlight */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {leaders.slice(0, 3).map((p) => (
          <div
            key={p.rank}
            className={
              `flex flex-col items-center p-4 rounded-xl ` +
              (p.isCurrent 
                ? 'bg-white ring-4 ring-[#C90000]' 
                : 'bg-[#F5F3EE]')
            }
          >
            <div className="text-lg font-heading text-[#C90000]">
              #{p.rank}
            </div>
            <div className="mt-2 font-body text-[#002B42] text-center">
              {p.name}
            </div>
            <div className="mt-1 font-body font-semibold text-[#002B42]">
              {p.xp} XP
            </div>
          </div>
        ))}
      </div>

      {/* Full List */}
      <div className="divide-y divide-gray-200">
        {leaders.map((p) => (
          <div
            key={p.rank}
            className={
              `flex items-center py-3 px-2 rounded-lg transition ` +
              (p.isCurrent ? 'bg-[#E5F6FF]' : 'hover:bg-gray-100')
            }
          >
            <div className="w-8 text-center font-heading text-[#002B42]">
              #{p.rank}
            </div>
            <div className="flex-1 ml-4 font-body text-[#002B42] truncate">
              {p.name}
            </div>
            <div className="w-16 text-right font-semibold text-[#C90000]">
              {p.xp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
