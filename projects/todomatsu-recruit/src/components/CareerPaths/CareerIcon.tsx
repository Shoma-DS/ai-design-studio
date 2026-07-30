const commonProps = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const icons: Record<string, React.ReactNode> = {
  buyer: (
    <svg {...commonProps}>
      <path d="M4 8h16l-1.5 10a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8L4 8Z" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
    </svg>
  ),
  "area-manager": (
    <svg {...commonProps}>
      <path d="M3 21h18" />
      <path d="M5 21V10l5-3 5 3v11" />
      <path d="M14 21v-7l4-2v9" />
    </svg>
  ),
  product: (
    <svg {...commonProps}>
      <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
      <path d="M3 7.5V16l9 4.5 9-4.5V7.5" />
      <path d="M12 12v8.5" />
    </svg>
  ),
  marketing: (
    <svg {...commonProps}>
      <path d="M4 11v2a2 2 0 0 0 2 2h1l3 4v-6" />
      <path d="M7 11 15 6v12l-8-5Z" />
      <path d="M18 9c1 1 1 5 0 6" />
    </svg>
  ),
  logistics: (
    <svg {...commonProps}>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </svg>
  ),
  corporate: (
    <svg {...commonProps}>
      <path d="M4 21V6l8-3 8 3v15" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 10h.01M14.99 10h.01M9 14h.01M14.99 14h.01" />
    </svg>
  ),
  store: (
    <svg {...commonProps}>
      <path d="M4 9 5 4h14l1 5" />
      <path d="M4 9v11h16V9" />
      <path d="M9 20v-6h6v6" />
    </svg>
  ),
  system: (
    <svg {...commonProps}>
      <rect x="4" y="4" width="16" height="11" rx="1.5" />
      <path d="M9 20h6M12 15v5" />
    </svg>
  ),
};

export default function CareerIcon({ id }: { id: string }) {
  return icons[id] ?? null;
}
