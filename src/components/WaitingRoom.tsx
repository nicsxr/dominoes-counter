interface WaitingRoomProps {
  roomCode: string;
  onCopy: () => void;
  onLeave: () => void;
}

export default function WaitingRoom({ roomCode, onCopy, onLeave }: WaitingRoomProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-4 py-6">
      <div className="w-full max-w-[360px] text-center">
        <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--blue)] rounded-full mx-auto mb-6 animate-spin" />
        <h2 className="text-[22px] font-bold mb-1">
          Waiting for opponent&hellip;
        </h2>
        <p className="text-sm text-[var(--text-dim)] mb-6">
          Share this code with your opponent
        </p>

        <button
          onClick={onCopy}
          className="bg-[var(--surface)] border-2 border-dashed border-[var(--border)] rounded-2xl p-5 mb-8 cursor-pointer transition-colors active:border-[var(--blue)] w-full"
        >
          <span className="block text-[40px] font-extrabold tracking-[8px] font-mono text-[var(--blue)]">
            {roomCode}
          </span>
          <small className="block text-[var(--text-dim)] text-xs mt-2">
            Tap to copy
          </small>
        </button>

        <button onClick={onLeave} className="btn-danger w-full">
          Leave Room
        </button>
      </div>
    </div>
  );
}