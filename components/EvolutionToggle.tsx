'use client';

import { motion } from 'framer-motion';

interface EvolutionToggleProps {
  is3Chamber: boolean;
  onToggle: () => void;
}

export default function EvolutionToggle({ is3Chamber, onToggle }: EvolutionToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded border text-[10px] font-mono uppercase tracking-wider transition-all duration-200"
      style={{
        borderColor: is3Chamber ? 'rgba(180, 130, 255, 0.3)' : 'rgba(0, 255, 136, 0.2)',
        color: is3Chamber ? '#b482ff' : 'rgba(255,255,255,0.5)',
        backgroundColor: is3Chamber ? 'rgba(180, 130, 255, 0.05)' : 'rgba(255,255,255,0.02)',
      }}
    >
      <span style={{ opacity: is3Chamber ? 0.5 : 1 }}>Human v4.0</span>
      <span className="text-gray-600">⟷</span>
      <span style={{ opacity: is3Chamber ? 1 : 0.5 }}>Amphibian v3.0</span>
    </button>
  );
}

// 3-chamber amphibian heart SVG overlay — replaces the human heart when active
export function AmphibianHeart({
  hoveredPart,
  onPartHover,
}: {
  hoveredPart: string | null;
  onPartHover: (id: string | null) => void;
}) {
  return (
    <g>
      {/* Single ventricle (merged) */}
      <motion.path
        d="M 160 300 Q 140 340 150 400 Q 165 450 235 475 Q 305 450 320 400 Q 330 340 310 300 Q 280 290 235 295 Q 195 290 160 300 Z"
        fill={hoveredPart === 'single-ventricle' ? '#b482ff' : '#7c4dff'}
        onMouseEnter={() => onPartHover('single-ventricle')}
        onMouseLeave={() => onPartHover(null)}
        className="cursor-pointer"
        style={{
          transition: 'fill 0.2s ease',
          filter: hoveredPart === 'single-ventricle' ? 'drop-shadow(0 0 15px rgba(124, 77, 255, 0.6))' : 'none',
        }}
      />

      {/* Right atrium */}
      <motion.path
        d="M 150 195 Q 115 210 110 245 Q 110 275 135 295 Q 160 305 195 295 L 195 245 Q 195 210 170 200 Z"
        fill={hoveredPart === 'amp-right-atrium' ? '#64b5f6' : '#5e81ac'}
        onMouseEnter={() => onPartHover('amp-right-atrium')}
        onMouseLeave={() => onPartHover(null)}
        className="cursor-pointer"
        style={{
          transition: 'fill 0.2s ease',
          filter: hoveredPart === 'amp-right-atrium' ? 'drop-shadow(0 0 12px rgba(94, 129, 172, 0.7))' : 'none',
        }}
      />

      {/* Left atrium */}
      <motion.path
        d="M 290 195 Q 320 210 330 245 Q 330 275 305 295 Q 280 305 250 295 L 250 245 Q 250 210 275 200 Z"
        fill={hoveredPart === 'amp-left-atrium' ? '#ff6b6b' : '#c1121f'}
        onMouseEnter={() => onPartHover('amp-left-atrium')}
        onMouseLeave={() => onPartHover(null)}
        className="cursor-pointer"
        style={{
          transition: 'fill 0.2s ease',
          filter: hoveredPart === 'amp-left-atrium' ? 'drop-shadow(0 0 12px rgba(193, 18, 31, 0.7))' : 'none',
        }}
      />

      {/* Vessels (simplified) */}
      <path d="M 140 40 Q 140 100 155 190" stroke="#457b9d" strokeWidth="11" fill="none" strokeLinecap="round" />
      <path d="M 250 200 Q 290 160 340 100 Q 380 60 420 55" stroke="#e63946" strokeWidth="12" fill="none" strokeLinecap="round" />

      {/* Label: "3 CHAMBERS" */}
      <text x="180" y="520" fill="#b482ff" fontSize="10" fontFamily="monospace" opacity="0.6" fontWeight="600">
        3 CHAMBERS — SINGLE VENTRICLE
      </text>

      {/* Incomplete septum line (dotted, showing it's absent) */}
      <line x1="235" y1="300" x2="235" y2="400" stroke="#b482ff" strokeWidth="1" strokeDasharray="3 5" opacity="0.3" />
    </g>
  );
}

// Data for the amphibian heart parts
export const amphibianParts = [
  {
    id: 'single-ventricle',
    name: 'Single Ventricle',
    description: 'A single shared ventricle where oxygenated and deoxygenated blood partially mix before being pumped out.',
    funFact: 'Amphibians compensate for mixing by using their moist skin for gas exchange — up to 80% in some species!',
    oxygenated: true,
    color: '#7c4dff',
    glowColor: 'rgba(124, 77, 255, 0.7)',
  },
  {
    id: 'amp-right-atrium',
    name: 'Right Atrium',
    description: 'Receives deoxygenated blood from the body, same as in mammals.',
    funFact: 'In the evolutionary "v3.0" heart, both atria pass blood to the same ventricle.',
    oxygenated: false,
    color: '#5e81ac',
    glowColor: 'rgba(94, 129, 172, 0.7)',
  },
  {
    id: 'amp-left-atrium',
    name: 'Left Atrium',
    description: 'Receives oxygenated blood from the lungs (and skin in some species).',
    funFact: 'The spiral valve in the conus arteriosus partially separates blood flow despite having one ventricle.',
    oxygenated: true,
    color: '#c1121f',
    glowColor: 'rgba(193, 18, 31, 0.7)',
  },
];
