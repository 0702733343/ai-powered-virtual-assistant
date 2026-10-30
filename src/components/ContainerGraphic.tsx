interface ContainerGraphicProps {
  colorHex: string;
  className?: string;
  showLid?: boolean;
}

export function ContainerGraphic({ colorHex, className = 'w-full h-40' }: ContainerGraphicProps) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 320 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          <linearGradient id={`grad-body-${colorHex.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colorHex} stopOpacity="1" />
            <stop offset="100%" stopColor={adjustBrightness(colorHex, -35)} stopOpacity="1" />
          </linearGradient>
          <linearGradient id={`grad-roof-${colorHex.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={adjustBrightness(colorHex, 25)} stopOpacity="1" />
            <stop offset="100%" stopColor={colorHex} stopOpacity="1" />
          </linearGradient>
          <linearGradient id="metal-sheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Shadow base */}
        <ellipse cx="160" cy="164" rx="130" ry="12" fill="#000000" fillOpacity="0.35" filter="blur(4px)" />

        {/* 3D Isometric / Front Storage Container */}
        {/* Container Top Roof */}
        <polygon
          points="40,46 130,22 280,22 190,46"
          fill={`url(#grad-roof-${colorHex.replace('#', '')})`}
          stroke="#0f172a"
          strokeWidth="2"
        />

        {/* Container Right Side Profile */}
        <polygon
          points="190,46 280,22 280,126 190,150"
          fill={adjustBrightness(colorHex, -45)}
          stroke="#0f172a"
          strokeWidth="2"
        />
        {/* Side corrugation ribs */}
        {[205, 220, 235, 250, 265].map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={42 - (x - 190) * 0.26}
            x2={x}
            y2={146 - (x - 190) * 0.26}
            stroke="#000000"
            strokeOpacity="0.4"
            strokeWidth="3"
          />
        ))}

        {/* Container Front Face */}
        <polygon
          points="40,46 190,46 190,150 40,150"
          fill={`url(#grad-body-${colorHex.replace('#', '')})`}
          stroke="#0f172a"
          strokeWidth="2.5"
        />

        {/* Metal sheen overlay */}
        <polygon points="40,46 190,46 190,150 40,150" fill="url(#metal-sheen)" />

        {/* Front Corrugation Flutes / Ribs */}
        {[55, 70, 85, 100, 115, 130, 145, 160, 175].map((x, idx) => (
          <g key={idx}>
            <rect x={x - 2} y="50" width="4" height="96" fill="#000000" fillOpacity="0.3" />
            <rect x={x} y="50" width="3" height="96" fill="#ffffff" fillOpacity="0.15" />
          </g>
        ))}

        {/* Center Split Door Frame */}
        <line x1="115" y1="46" x2="115" y2="150" stroke="#0f172a" strokeWidth="3" />

        {/* Industrial Locking Bars (Vertical rods) */}
        <rect x="92" y="44" width="4" height="108" fill="#e2e8f0" stroke="#334155" strokeWidth="1" />
        <rect x="138" y="44" width="4" height="108" fill="#e2e8f0" stroke="#334155" strokeWidth="1" />

        {/* Cam handles and lock cams */}
        <rect x="88" y="98" width="12" height="6" rx="2" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
        <rect x="134" y="98" width="12" height="6" rx="2" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />

        {/* Corner Castings (reinforced heavy steel blocks) */}
        <rect x="37" y="42" width="10" height="10" rx="1" fill="#475569" stroke="#0f172a" strokeWidth="1.5" />
        <rect x="183" y="42" width="10" height="10" rx="1" fill="#475569" stroke="#0f172a" strokeWidth="1.5" />
        <rect x="37" y="142" width="10" height="10" rx="1" fill="#475569" stroke="#0f172a" strokeWidth="1.5" />
        <rect x="183" y="142" width="10" height="10" rx="1" fill="#475569" stroke="#0f172a" strokeWidth="1.5" />

        <rect x="273" y="20" width="10" height="10" rx="1" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
        <rect x="273" y="120" width="10" height="10" rx="1" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />

        {/* Stencil brand stamp */}
        <g opacity="0.85">
          <rect x="52" y="60" width="52" height="16" rx="2" fill="#0f172a" fillOpacity="0.4" />
          <text x="56" y="72" fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
            CYMBAL
          </text>
        </g>
      </svg>
    </div>
  );
}

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
}
