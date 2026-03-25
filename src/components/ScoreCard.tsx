import { useRef, useEffect } from "react";

export function AnimatedScore({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value !== prevValue.current && ref.current) {
      ref.current.classList.remove("score-pop");
      void ref.current.offsetWidth;
      ref.current.classList.add("score-pop");
      prevValue.current = value;
    }
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

interface ScoreCardProps {
  name: string;
  score: number;
  variant: "self" | "opponent";
  selected?: boolean;
  onClick?: () => void;
}

export default function ScoreCard({ name, score, variant, selected, onClick }: ScoreCardProps) {
  const isOpponent = variant === "opponent";
  const clickable = !!onClick;

  const bg = isOpponent
    ? "bg-linear-to-br from-[#1a1a3e] to-[#1e1e4a] border-[#2a2a5a]"
    : "bg-linear-to-br from-[#0a2a1a] to-[#0e3a2e] border-[#1a5a3a]";

  const ring = selected ? "ring-2 ring-(--blue)] ring-offset-2 ring-offset-(--bg)]" : "";

  return (
    <div
      onClick={onClick}
      className={`w-full rounded-2xl text-center flex flex-col items-center gap-1 justify-center min-h-0 border ${bg} ${ring} ${
        isOpponent ? "p-2.5 flex-[0.5]" : "p-4 flex-1"
      } ${clickable ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}`}
    >
      <span
        className={`font-semibold uppercase tracking-[2px] text-(--text-dim) ${
          isOpponent ? "text-xs" : "text-sm"
        }`}
      >
        {name}
      </span>
      <AnimatedScore
        value={score}
        className={
          isOpponent
            ? "text-[42px] max-[640px]:text-[36px] min-[800px]:text-[52px] font-extrabold leading-none tabular-nums text-(--blue)]"
            : "text-[64px] max-[640px]:text-[48px] min-[800px]:text-[80px] font-extrabold leading-none tabular-nums text-(--green)]"
        }
      />
    </div>
  );
}