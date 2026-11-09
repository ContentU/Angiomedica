// Icone della demo (stessi tracciati SVG)
const PATHS = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  diag: <path d="M7 17 17 7M8 7h9v9" />,
  plus: <path d="M12 5v14M5 12h14" />,
  back: <path d="M15 6l-6 6 6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  check: <path d="m5 12 5 5 9-10" />,
  info: (<><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></>),
  phone: <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" />,
  alert: (<><path d="M12 3 2 20h20L12 3z" /><path d="M12 10v4M12 17v.5" /></>),
  pin: (<><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  home: (<><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /><path d="M12 17s-3-1.8-3-4a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 2.2-3 4-3 4z" /></>),
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20, sw = 2.2, stroke = "currentColor", className, style }: {
  name: IconName; size?: number; sw?: number; stroke?: string; className?: string; style?: React.CSSProperties;
}) {
  return (
    <svg className={className} style={style} aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {PATHS[name]}
    </svg>
  );
}
