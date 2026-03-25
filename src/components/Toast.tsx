interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 bg-[var(--surface-light)] text-white px-5 py-2.5 rounded-[10px] text-sm font-semibold pointer-events-none z-50 transition-all duration-300 ${
        message
          ? "opacity-100 -translate-x-1/2 translate-y-0"
          : "opacity-0 -translate-x-1/2 translate-y-20"
      }`}
    >
      {message}
    </div>
  );
}