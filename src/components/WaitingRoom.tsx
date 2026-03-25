import { QRCodeSVG } from "qrcode.react";
import { getRoomUrl } from "../lib/utils";

interface WaitingRoomProps {
  roomCode: string;
  onCopy: () => void;
  onLeave: () => void;
  onShareLink: () => void;
}

export default function WaitingRoom({ roomCode, onCopy, onLeave, onShareLink }: WaitingRoomProps) {
  const roomUrl = getRoomUrl(roomCode);

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-4 py-6">
      <div className="w-full max-w-[360px] text-center">
        <h2 className="text-[22px] font-bold mb-1">
          Waiting for opponent&hellip;
        </h2>
        <p className="text-sm text-[var(--text-dim)] mb-6">
          Share the code or scan QR to join
        </p>

        <button
          onClick={onCopy}
          className="bg-[var(--surface)] border-2 border-dashed border-[var(--border)] rounded-2xl p-5 mb-4 cursor-pointer transition-colors active:border-[var(--blue)] w-full"
        >
          <span className="block text-[40px] font-extrabold tracking-[8px] font-mono text-[var(--blue)]">
            {roomCode}
          </span>
          <small className="block text-[var(--text-dim)] text-xs mt-2">
            Tap to copy the code
          </small>
        </button>

        <div className="bg-white rounded-2xl p-4 mx-auto w-fit mb-4">
          <QRCodeSVG value={roomUrl} size={180} />
        </div>

        <button
          onClick={onShareLink}
          className="btn-secondary w-full mb-3"
        >
          Share Link
        </button>

        <button onClick={onLeave} className="btn-danger w-full">
          Leave Room
        </button>
      </div>
    </div>
  );
}