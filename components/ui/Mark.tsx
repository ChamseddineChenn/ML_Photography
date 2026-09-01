export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" aria-hidden="true" className={className}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 26 L8 8 L14 19 L20 8 L23 26" />
        <path d="M28 8 L28 26 L44 26" />
      </g>
    </svg>
  );
}
