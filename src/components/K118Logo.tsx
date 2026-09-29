import React from 'react';

interface K118LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOnlineDot?: boolean;
  className?: string;
}

export const K118Logo: React.FC<K118LogoProps> = ({
  size = 'md',
  showOnlineDot = true,
  className = '',
}) => {
  const dimensions = {
    sm: { width: 36, height: 40, fontSizeK: 'text-lg', fontSize118: 'text-xs', dotSize: 'w-2.5 h-2.5 top-1.5 right-1.5' },
    md: { width: 56, height: 62, fontSizeK: 'text-2xl', fontSize118: 'text-sm', dotSize: 'w-3 h-3 top-2 right-2' },
    lg: { width: 92, height: 102, fontSizeK: 'text-4xl', fontSize118: 'text-xl', dotSize: 'w-4 h-4 top-3 right-3' },
    xl: { width: 130, height: 144, fontSizeK: 'text-6xl', fontSize118: 'text-3xl', dotSize: 'w-5 h-5 top-4 right-4' },
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* SVG Container replicating the speech bubble contour */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 100 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-lg"
      >
        <defs>
          <linearGradient id="k118Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6A11CB" />
            <stop offset="45%" stopColor="#7B2CBF" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#7C3AED" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Rounded Chat Bubble with bottom tail */}
        <path
          d="M 24 4 
             C 12 4, 4 12, 4 24 
             L 4 72 
             C 4 84, 12 92, 24 92 
             L 40 92 
             C 46 92, 48 104, 50 105 
             C 52 104, 54 92, 60 92 
             L 76 92 
             C 88 92, 96 84, 96 72 
             L 96 24 
             C 96 12, 88 4, 76 4 
             Z"
          fill="url(#k118Gradient)"
        />

        {/* Green Online Dot in Top Right */}
        {showOnlineDot && (
          <circle
            cx="80"
            cy="18"
            r="6"
            fill="#10B981"
            className="animate-pulse"
          />
        )}

        {/* "K" Letter */}
        <text
          x="50"
          y="54"
          fill="#FFFFFF"
          textAnchor="middle"
          fontSize="44"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-1"
        >
          K
        </text>

        {/* "118" Text */}
        <text
          x="50"
          y="82"
          fill="#FFFFFF"
          textAnchor="middle"
          fontSize="24"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0"
        >
          118
        </text>
      </svg>
    </div>
  );
};
