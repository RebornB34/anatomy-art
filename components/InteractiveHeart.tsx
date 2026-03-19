'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface HeartPart {
  id: string;
  name: string;
  description: string;
  color: string;
  glowColor: string;
}

const heartParts: HeartPart[] = [
  {
    id: 'superior-vena-cava',
    name: 'Superior Vena Cava',
    description: 'Returns deoxygenated blood from upper body',
    color: '#4a5a9a',
    glowColor: 'rgba(74, 90, 154, 0.8)',
  },
  {
    id: 'inferior-vena-cava',
    name: 'Inferior Vena Cava',
    description: 'Returns deoxygenated blood from lower body',
    color: '#4a5a9a',
    glowColor: 'rgba(74, 90, 154, 0.8)',
  },
  {
    id: 'right-atrium',
    name: 'Right Atrium',
    description: 'Receives deoxygenated blood',
    color: '#6b7ec9',
    glowColor: 'rgba(107, 126, 201, 0.8)',
  },
  {
    id: 'left-atrium',
    name: 'Left Atrium',
    description: 'Receives oxygenated blood from lungs',
    color: '#ff9999',
    glowColor: 'rgba(255, 153, 153, 0.8)',
  },
  {
    id: 'right-ventricle',
    name: 'Right Ventricle',
    description: 'Pumps deoxygenated blood to lungs',
    color: '#a8a8d9',
    glowColor: 'rgba(168, 168, 217, 0.8)',
  },
  {
    id: 'left-ventricle',
    name: 'Left Ventricle',
    description: 'Pumps oxygenated blood to body',
    color: '#ff6b6b',
    glowColor: 'rgba(255, 107, 107, 0.8)',
  },
  {
    id: 'pulmonary-artery',
    name: 'Pulmonary Artery',
    description: 'Carries deoxygenated blood to lungs',
    color: '#6b7ec9',
    glowColor: 'rgba(107, 126, 201, 0.8)',
  },
  {
    id: 'pulmonary-vein',
    name: 'Pulmonary Vein',
    description: 'Carries oxygenated blood from lungs',
    color: '#ff9999',
    glowColor: 'rgba(255, 153, 153, 0.8)',
  },
  {
    id: 'aorta',
    name: 'Aorta',
    description: 'Carries oxygenated blood to body',
    color: '#ff6b6b',
    glowColor: 'rgba(255, 107, 107, 0.8)',
  },
];

export default function InteractiveHeart() {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handlePartHover = (partId: string, event: React.MouseEvent<SVGElement>) => {
    setHoveredPart(partId);
    const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 20,
    });
  };

  const part = heartParts.find((p) => p.id === hoveredPart);

  return (
    <div className="relative w-full h-screen bg-cyber-black flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, transparent 70%)',
            left: '20%',
            top: '20%',
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255, 0, 110, 0.2) 0%, transparent 70%)',
            right: '20%',
            bottom: '20%',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-cyan-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
            Cyber-Biological Heart
          </h1>
          <p className="text-center text-gray-400 mt-2">
            Hover over different parts to explore anatomy and blood flow
          </p>
        </div>

        {/* Heart SVG Container */}
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
        >
          <svg
            viewBox="0 0 400 500"
            className="w-full max-w-md drop-shadow-2xl"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(0, 212, 255, 0.3))',
            }}
          >
            {/* Superior Vena Cava */}
            <motion.rect
              x="140"
              y="20"
              width="30"
              height="60"
              fill={hoveredPart === 'superior-vena-cava' ? '#00d4ff' : '#4a5a9a'}
              onMouseEnter={(e) => handlePartHover('superior-vena-cava', e as any)}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer transition-colors"
              animate={
                hoveredPart === 'superior-vena-cava'
                  ? { opacity: [0.8, 1, 0.8], boxShadow: '0 0 20px rgba(0, 212, 255, 0.8)' }
                  : {}
              }
              transition={{
                duration: 0.6,
                repeat: Infinity,
              }}
              rx="15"
            />

            {/* Inferior Vena Cava */}
            <motion.rect
              x="140"
              y="360"
              width="30"
              height="80"
              fill={hoveredPart === 'inferior-vena-cava' ? '#00d4ff' : '#4a5a9a'}
              onMouseEnter={(e) => handlePartHover('inferior-vena-cava', e as any)}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer transition-colors"
              animate={
                hoveredPart === 'inferior-vena-cava'
                  ? { opacity: [0.8, 1, 0.8], boxShadow: '0 0 20px rgba(0, 212, 255, 0.8)' }
                  : {}
              }
              transition={{
                duration: 0.6,
                repeat: Infinity,
              }}
              rx="15"
            />

            {/* Right Atrium - Upper Right */}
            <motion.path
              d="M 170 100 Q 220 120 230 180 Q 220 160 170 150 Z"
              fill={hoveredPart === 'right-atrium' ? '#4fcbf5' : '#6b7ec9'}
              onMouseEnter={(e) => handlePartHover('right-atrium', e as any)}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer transition-colors"
              animate={
                hoveredPart === 'right-atrium'
                  ? { opacity: [0.8, 1, 0.8] }
                  : {}
              }
              transition={{
                duration: 0.6,
                repeat: Infinity,
              }}
            />

            {/* Left Atrium - Upper Left */}
            <motion.path
              d="M 230 100 Q 180 120 170 180 Q 180 160 230 150 Z"
              fill={hoveredPart === 'left-atrium' ? '#ff7777' : '#ff9999'}
              onMouseEnter={(e) => handlePartHover('left-atrium', e as any)}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer transition-colors"
              animate={
                hoveredPart === 'left-atrium'
                  ? { opacity: [0.8, 1, 0.8] }
                  : {}
              }
              transition={{
                duration: 0.6,
                repeat: Infinity,
              }}
            />

            {/* Right Ventricle - Lower Right */}
            <motion.path
              d="M 170 200 Q 210 240 200 320 Q 180 280 170 260 Z"
              fill={hoveredPart === 'right-ventricle' ? '#7d8fd6' : '#a8a8d9'}
              onMouseEnter={(e) => handlePartHover('right-ventricle', e as any)}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer transition-colors"
              animate={
                hoveredPart === 'right-ventricle'
                  ? { opacity: [0.8, 1, 0.8] }
                  : {}
              }
              transition={{
                duration: 0.6,
                repeat: Infinity,
              }}
            />

            {/* Left Ventricle - Lower Left & Center (larger) */}
            <motion.path
              d="M 230 200 Q 270 240 260 340 Q 200 280 230 260 Z"
              fill={hoveredPart === 'left-ventricle' ? '#ff5252' : '#ff6b6b'}
              onMouseEnter={(e) => handlePartHover('left-ventricle', e as any)}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer transition-colors"
              animate={
                hoveredPart === 'left-ventricle'
                  ? { opacity: [0.8, 1, 0.8] }
                  : {}
              }
              transition={{
                duration: 0.6,
                repeat: Infinity,
              }}
            />

            {/* Pulmonary Artery - from right ventricle up */}
            <motion.path
              d="M 190 160 Q 120 140 100 80"
              stroke={hoveredPart === 'pulmonary-artery' ? '#4fcbf5' : '#6b7ec9'}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              onMouseEnter={(e) => handlePartHover('pulmonary-artery', e as any)}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer transition-colors"
              animate={
                hoveredPart === 'pulmonary-artery'
                  ? { opacity: [0.8, 1, 0.8], strokeWidth: [12, 15, 12] }
                  : { strokeWidth: [12, 14, 12] }
              }
              transition={{
                duration: 0.6,
                repeat: Infinity,
              }}
            />

            {/* Pulmonary Vein - from lungs down to left atrium */}
            <motion.path
              d="M 290 160 Q 320 140 340 80"
              stroke={hoveredPart === 'pulmonary-vein' ? '#ff7777' : '#ff9999'}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              onMouseEnter={(e) => handlePartHover('pulmonary-vein', e as any)}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer transition-colors"
              animate={
                hoveredPart === 'pulmonary-vein'
                  ? { opacity: [0.8, 1, 0.8], strokeWidth: [12, 15, 12] }
                  : { strokeWidth: [12, 14, 12] }
              }
              transition={{
                duration: 0.6,
                repeat: Infinity,
              }}
            />

            {/* Aorta - from left ventricle up */}
            <motion.path
              d="M 240 180 Q 300 160 350 100"
              stroke={hoveredPart === 'aorta' ? '#ff5252' : '#ff6b6b'}
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
              onMouseEnter={(e) => handlePartHover('aorta', e as any)}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer transition-colors"
              animate={
                hoveredPart === 'aorta'
                  ? { opacity: [0.8, 1, 0.8], strokeWidth: [14, 18, 14] }
                  : { strokeWidth: [14, 16, 14] }
              }
              transition={{
                duration: 0.6,
                repeat: Infinity,
              }}
            />

            {/* Decorative circuit nodes on vessels */}
            {[
              { cx: 100, cy: 80, id: 'node-1' },
              { cx: 340, cy: 80, id: 'node-2' },
              { cx: 350, cy: 100, id: 'node-3' },
              { cx: 120, cy: 140, id: 'node-4' },
            ].map((node) => (
              <motion.circle
                key={node.id}
                cx={node.cx}
                cy={node.cy}
                r="4"
                fill="#00d4ff"
                animate={{
                  r: [4, 6, 4],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: Math.random() * 0.4,
                }}
              />
            ))}

            {/* Main heart outline - septum dividing line */}
            <line
              x1="200"
              y1="180"
              x2="200"
              y2="340"
              stroke="#00d4ff"
              strokeWidth="2"
              opacity="0.3"
            />
          </svg>
        </motion.div>

        {/* Info Panel */}
        {hoveredPart && part && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-8 p-6 bg-gradient-to-r from-cyan-900/20 to-red-900/20 border border-cyan-500/50 rounded-lg backdrop-blur-sm max-w-md"
          >
            <h3 className="text-xl font-bold text-cyan-300 mb-2">{part.name}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{part.description}</p>
            <div
              className="mt-4 w-8 h-8 rounded-full"
              style={{
                backgroundColor: part.color,
                boxShadow: `0 0 15px ${part.glowColor}`,
              }}
            />
          </motion.div>
        )}

        {/* Legend */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-sm max-w-md">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <span className="text-gray-300">Deoxygenated Blood</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span className="text-gray-300">Oxygenated Blood</span>
          </div>
        </div>
      </div>
    </div>
  );
}
