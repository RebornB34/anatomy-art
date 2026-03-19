'use client';

import { motion } from 'framer-motion';

// Blood particle that follows a path via SVG animateMotion
function BloodParticle({
  pathId,
  color,
  delay,
  duration,
  size = 3.5,
}: {
  pathId: string;
  color: string;
  delay: number;
  duration: number;
  size?: number;
}) {
  return (
    <circle r={size} fill={color} opacity="0.85">
      <animateMotion
        dur={`${duration}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
        rotate="auto"
      >
        <mpath href={`#${pathId}`} />
      </animateMotion>
    </circle>
  );
}

export interface HeartPartData {
  id: string;
  name: string;
  description: string;
  funFact: string;
  oxygenated: boolean;
  color: string;
  hoverColor: string;
  glowColor: string;
}

export const heartPartsData: HeartPartData[] = [
  {
    id: 'aorta',
    name: 'Aorta',
    description: 'The largest artery — carries oxygen-rich blood from the left ventricle to the entire body.',
    funFact: 'The aorta is about 30cm long and 2.5cm wide — roughly the diameter of a garden hose.',
    oxygenated: true,
    color: '#e63946',
    hoverColor: '#ff1744',
    glowColor: 'rgba(230, 57, 70, 0.7)',
  },
  {
    id: 'superior-vena-cava',
    name: 'Superior Vena Cava',
    description: 'Returns deoxygenated blood from the upper body (head, arms, chest) back to the right atrium.',
    funFact: 'About 7cm long, it carries about 2 liters of blood per minute.',
    oxygenated: false,
    color: '#457b9d',
    hoverColor: '#00b4d8',
    glowColor: 'rgba(69, 123, 157, 0.7)',
  },
  {
    id: 'inferior-vena-cava',
    name: 'Inferior Vena Cava',
    description: 'The largest vein — returns deoxygenated blood from the lower body to the right atrium.',
    funFact: 'It\'s the widest vein in the human body at about 3cm in diameter.',
    oxygenated: false,
    color: '#457b9d',
    hoverColor: '#00b4d8',
    glowColor: 'rgba(69, 123, 157, 0.7)',
  },
  {
    id: 'right-atrium',
    name: 'Right Atrium',
    description: 'Receives deoxygenated blood from the body via the vena cavae and passes it to the right ventricle.',
    funFact: 'The right atrium contains the sinoatrial (SA) node — the heart\'s natural pacemaker.',
    oxygenated: false,
    color: '#6a89b7',
    hoverColor: '#48cae4',
    glowColor: 'rgba(106, 137, 183, 0.7)',
  },
  {
    id: 'left-atrium',
    name: 'Left Atrium',
    description: 'Receives oxygenated blood from the lungs via the pulmonary veins and passes it to the left ventricle.',
    funFact: 'It has thicker walls than the right atrium because it pumps blood at higher pressure.',
    oxygenated: true,
    color: '#c1121f',
    hoverColor: '#ff5252',
    glowColor: 'rgba(193, 18, 31, 0.7)',
  },
  {
    id: 'right-ventricle',
    name: 'Right Ventricle',
    description: 'Pumps deoxygenated blood to the lungs through the pulmonary artery for oxygenation.',
    funFact: 'Its wall is about 3–5mm thick — thinner than the left ventricle since it only pumps to the nearby lungs.',
    oxygenated: false,
    color: '#5e81ac',
    hoverColor: '#64b5f6',
    glowColor: 'rgba(94, 129, 172, 0.7)',
  },
  {
    id: 'left-ventricle',
    name: 'Left Ventricle',
    description: 'The most muscular chamber — pumps oxygenated blood through the aorta to the entire body.',
    funFact: 'Its wall is 3× thicker than the right ventricle (up to 15mm) to generate enough pressure.',
    oxygenated: true,
    color: '#d62828',
    hoverColor: '#ff1744',
    glowColor: 'rgba(214, 40, 40, 0.7)',
  },
  {
    id: 'pulmonary-artery',
    name: 'Pulmonary Artery',
    description: 'Carries deoxygenated blood from the right ventricle to the lungs for gas exchange.',
    funFact: 'It\'s the only artery in the body that carries deoxygenated blood!',
    oxygenated: false,
    color: '#457b9d',
    hoverColor: '#00b4d8',
    glowColor: 'rgba(69, 123, 157, 0.7)',
  },
  {
    id: 'pulmonary-vein',
    name: 'Pulmonary Veins',
    description: 'Carry freshly oxygenated blood from the lungs back to the left atrium of the heart.',
    funFact: 'These are the only veins that carry oxygenated blood — there are 4 of them total.',
    oxygenated: true,
    color: '#e63946',
    hoverColor: '#ff5252',
    glowColor: 'rgba(230, 57, 70, 0.7)',
  },
];

interface HeartSVGProps {
  hoveredPart: string | null;
  onPartHover: (id: string | null) => void;
  speedMultiplier: number;
  dimmed: boolean; // dimmed when conduction mode is active
  children?: React.ReactNode; // for overlays (conduction, threat)
}

export default function HeartSVG({ hoveredPart, onPartHover, speedMultiplier, dimmed, children }: HeartSVGProps) {
  const baseDuration = 3.2 / speedMultiplier;

  return (
    <svg
      viewBox="0 0 500 600"
      className="w-full max-w-lg"
      style={{
        filter: hoveredPart
          ? 'drop-shadow(0 0 40px rgba(230, 57, 70, 0.2))'
          : 'drop-shadow(0 0 20px rgba(230, 57, 70, 0.1))',
        transition: 'filter 0.3s ease',
      }}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="grad-left-ventricle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d62828" />
          <stop offset="100%" stopColor="#a31621" />
        </linearGradient>
        <linearGradient id="grad-right-ventricle" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5e81ac" />
          <stop offset="100%" stopColor="#3b5998" />
        </linearGradient>
        <linearGradient id="grad-left-atrium" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c1121f" />
          <stop offset="100%" stopColor="#9b1b30" />
        </linearGradient>
        <linearGradient id="grad-right-atrium" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6a89b7" />
          <stop offset="100%" stopColor="#4a6fa5" />
        </linearGradient>
        <linearGradient id="grad-aorta" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e63946" />
          <stop offset="100%" stopColor="#ff6b6b" />
        </linearGradient>
        <linearGradient id="grad-vein" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#457b9d" />
          <stop offset="100%" stopColor="#1d3557" />
        </linearGradient>
        <linearGradient id="grad-pulm-artery" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#457b9d" />
          <stop offset="100%" stopColor="#5e81ac" />
        </linearGradient>
        <linearGradient id="grad-pulm-vein" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e63946" />
          <stop offset="100%" stopColor="#c1121f" />
        </linearGradient>

        {/* Blood flow paths (invisible, for animateMotion) */}
        <path id="flow-aorta" d="M 270 240 Q 270 160 310 120 Q 370 70 400 60 Q 440 55 460 90" fill="none" />
        <path id="flow-svc" d="M 140 40 Q 140 80 150 120 Q 155 160 170 190" fill="none" />
        <path id="flow-ivc" d="M 170 560 Q 170 520 175 480 Q 180 440 185 400 Q 190 370 195 340" fill="none" />
        <path id="flow-pa" d="M 200 220 Q 180 180 150 140 Q 120 100 80 70 Q 50 50 30 55" fill="none" />
        <path id="flow-pv" d="M 30 120 Q 70 130 120 160 Q 180 190 230 210 Q 260 220 280 230" fill="none" />
        <path id="flow-ra-rv" d="M 170 200 Q 180 250 195 290 Q 210 330 220 360" fill="none" />
        <path id="flow-la-lv" d="M 290 220 Q 300 260 310 300 Q 315 340 310 380" fill="none" />
      </defs>

      {/* Heart anatomy group — can be dimmed or brightened */}
      <g style={{ opacity: dimmed ? 0.25 : 1, transition: 'opacity 0.5s ease' }}>
        {/* ====== VESSELS ====== */}

        {/* Aorta arch */}
        <motion.path
          d="M 265 245 Q 265 175 295 135 Q 330 90 380 70 Q 420 55 450 65 Q 470 75 465 100 Q 460 120 440 130"
          stroke={hoveredPart === 'aorta' ? '#ff1744' : 'url(#grad-aorta)'}
          strokeWidth={hoveredPart === 'aorta' ? 18 : 15}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          onMouseEnter={() => onPartHover('aorta')}
          onMouseLeave={() => onPartHover(null)}
          className="cursor-pointer"
          style={{
            transition: 'stroke-width 0.2s ease, stroke 0.2s ease',
            filter: hoveredPart === 'aorta' ? 'drop-shadow(0 0 12px rgba(230, 57, 70, 0.8))' : 'none',
          }}
        />

        {/* Superior Vena Cava */}
        <motion.path
          d="M 140 40 Q 138 80 145 120 Q 150 155 165 185"
          stroke={hoveredPart === 'superior-vena-cava' ? '#00b4d8' : 'url(#grad-vein)'}
          strokeWidth={hoveredPart === 'superior-vena-cava' ? 16 : 13}
          fill="none"
          strokeLinecap="round"
          onMouseEnter={() => onPartHover('superior-vena-cava')}
          onMouseLeave={() => onPartHover(null)}
          className="cursor-pointer"
          style={{
            transition: 'stroke-width 0.2s ease, stroke 0.2s ease',
            filter: hoveredPart === 'superior-vena-cava' ? 'drop-shadow(0 0 12px rgba(69, 123, 157, 0.8))' : 'none',
          }}
        />

        {/* Inferior Vena Cava */}
        <motion.path
          d="M 165 560 Q 170 510 175 460 Q 180 420 190 385"
          stroke={hoveredPart === 'inferior-vena-cava' ? '#00b4d8' : 'url(#grad-vein)'}
          strokeWidth={hoveredPart === 'inferior-vena-cava' ? 16 : 13}
          fill="none"
          strokeLinecap="round"
          onMouseEnter={() => onPartHover('inferior-vena-cava')}
          onMouseLeave={() => onPartHover(null)}
          className="cursor-pointer"
          style={{
            transition: 'stroke-width 0.2s ease, stroke 0.2s ease',
            filter: hoveredPart === 'inferior-vena-cava' ? 'drop-shadow(0 0 12px rgba(69, 123, 157, 0.8))' : 'none',
          }}
        />

        {/* Pulmonary Artery */}
        <motion.path
          d="M 195 230 Q 170 190 140 155 Q 110 115 75 85 Q 50 65 30 65"
          stroke={hoveredPart === 'pulmonary-artery' ? '#00b4d8' : 'url(#grad-pulm-artery)'}
          strokeWidth={hoveredPart === 'pulmonary-artery' ? 14 : 11}
          fill="none"
          strokeLinecap="round"
          onMouseEnter={() => onPartHover('pulmonary-artery')}
          onMouseLeave={() => onPartHover(null)}
          className="cursor-pointer"
          style={{
            transition: 'stroke-width 0.2s ease, stroke 0.2s ease',
            filter: hoveredPart === 'pulmonary-artery' ? 'drop-shadow(0 0 12px rgba(69, 123, 157, 0.8))' : 'none',
          }}
        />
        <path d="M 75 85 Q 55 80 35 90 Q 20 100 25 120" stroke="url(#grad-pulm-artery)" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.7" />

        {/* Pulmonary Veins */}
        <motion.path
          d="M 35 130 Q 70 135 120 165 Q 180 200 240 225 Q 270 235 285 240"
          stroke={hoveredPart === 'pulmonary-vein' ? '#ff5252' : 'url(#grad-pulm-vein)'}
          strokeWidth={hoveredPart === 'pulmonary-vein' ? 12 : 9}
          fill="none"
          strokeLinecap="round"
          onMouseEnter={() => onPartHover('pulmonary-vein')}
          onMouseLeave={() => onPartHover(null)}
          className="cursor-pointer"
          style={{
            transition: 'stroke-width 0.2s ease, stroke 0.2s ease',
            filter: hoveredPart === 'pulmonary-vein' ? 'drop-shadow(0 0 12px rgba(230, 57, 70, 0.8))' : 'none',
          }}
        />

        {/* ====== CHAMBERS ====== */}

        {/* Right Atrium */}
        <motion.path
          d="M 165 185 Q 130 195 120 230 Q 115 260 130 285 Q 145 300 175 305 Q 195 300 210 280 L 210 230 Q 210 200 185 190 Z"
          fill={hoveredPart === 'right-atrium' ? '#48cae4' : 'url(#grad-right-atrium)'}
          onMouseEnter={() => onPartHover('right-atrium')}
          onMouseLeave={() => onPartHover(null)}
          className="cursor-pointer"
          style={{
            transition: 'fill 0.2s ease',
            filter: hoveredPart === 'right-atrium' ? 'drop-shadow(0 0 15px rgba(106, 137, 183, 0.8))' : 'none',
          }}
        />

        {/* Left Atrium */}
        <motion.path
          d="M 280 195 Q 310 195 335 215 Q 355 235 350 265 Q 345 290 320 305 Q 295 310 270 300 L 260 280 L 260 230 Q 260 205 280 195 Z"
          fill={hoveredPart === 'left-atrium' ? '#ff5252' : 'url(#grad-left-atrium)'}
          onMouseEnter={() => onPartHover('left-atrium')}
          onMouseLeave={() => onPartHover(null)}
          className="cursor-pointer"
          style={{
            transition: 'fill 0.2s ease',
            filter: hoveredPart === 'left-atrium' ? 'drop-shadow(0 0 15px rgba(193, 18, 31, 0.8))' : 'none',
          }}
        />

        {/* Septum */}
        <line x1="235" y1="210" x2="235" y2="460" stroke="#0d1520" strokeWidth="3" opacity="0.6" />

        {/* Right Ventricle */}
        <motion.path
          d="M 130 290 Q 115 320 120 360 Q 125 400 145 430 Q 170 465 200 480 Q 220 485 235 470 L 235 310 Q 230 295 210 285 Q 175 290 130 290 Z"
          fill={hoveredPart === 'right-ventricle' ? '#64b5f6' : 'url(#grad-right-ventricle)'}
          onMouseEnter={() => onPartHover('right-ventricle')}
          onMouseLeave={() => onPartHover(null)}
          className="cursor-pointer"
          style={{
            transition: 'fill 0.2s ease',
            filter: hoveredPart === 'right-ventricle' ? 'drop-shadow(0 0 15px rgba(94, 129, 172, 0.8))' : 'none',
          }}
        />

        {/* Left Ventricle */}
        <motion.path
          d="M 235 310 L 235 470 Q 250 485 275 480 Q 320 460 345 420 Q 365 385 365 345 Q 360 310 340 295 Q 310 285 280 295 Q 255 300 235 310 Z"
          fill={hoveredPart === 'left-ventricle' ? '#ff1744' : 'url(#grad-left-ventricle)'}
          onMouseEnter={() => onPartHover('left-ventricle')}
          onMouseLeave={() => onPartHover(null)}
          className="cursor-pointer"
          style={{
            transition: 'fill 0.2s ease',
            filter: hoveredPart === 'left-ventricle' ? 'drop-shadow(0 0 15px rgba(214, 40, 40, 0.8))' : 'none',
          }}
        />

        {/* Valve lines */}
        <path d="M 140 290 Q 175 280 210 290" stroke="#1a2940" strokeWidth="2.5" fill="none" opacity="0.5" />
        <path d="M 260 295 Q 300 282 345 295" stroke="#2a1520" strokeWidth="2.5" fill="none" opacity="0.5" />

        {/* Surface detail lines */}
        <path d="M 145 250 Q 165 245 180 255" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.06" />
        <path d="M 300 240 Q 320 235 335 248" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.06" />
        <path d="M 155 360 Q 185 350 210 365" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.06" />
        <path d="M 270 350 Q 305 338 340 355" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.06" />

        {/* Circuit trace decorations */}
        <path d="M 125 230 L 105 230 L 105 260 L 115 260" stroke="#00ff88" strokeWidth="0.5" fill="none" opacity="0.12" />
        <path d="M 360 270 L 375 270 L 375 250 L 365 250" stroke="#00ff88" strokeWidth="0.5" fill="none" opacity="0.12" />
        <circle cx="105" cy="230" r="1.5" fill="#00ff88" opacity="0.2" />
        <circle cx="375" cy="270" r="1.5" fill="#00ff88" opacity="0.2" />
        <path d="M 200 470 L 200 490 L 220 490" stroke="#00ff88" strokeWidth="0.5" fill="none" opacity="0.1" />
        <path d="M 280 470 L 280 490 L 260 490" stroke="#00ff88" strokeWidth="0.5" fill="none" opacity="0.1" />

        {/* ====== BLOOD PARTICLES ====== */}
        {!dimmed && (
          <g>
            {/* Aorta (red) */}
            {[0, 0.8, 1.6, 2.4].map((d, i) => (
              <BloodParticle key={`a-${i}`} pathId="flow-aorta" color="#ff4444" delay={d} duration={baseDuration} size={3.5} />
            ))}
            {/* SVC (blue) */}
            {[0, 1, 2].map((d, i) => (
              <BloodParticle key={`s-${i}`} pathId="flow-svc" color="#4fc3f7" delay={d} duration={baseDuration * 0.95} size={3} />
            ))}
            {/* IVC (blue) */}
            {[0, 1.2, 2.4].map((d, i) => (
              <BloodParticle key={`i-${i}`} pathId="flow-ivc" color="#4fc3f7" delay={d} duration={baseDuration * 1.1} size={3} />
            ))}
            {/* Pulmonary artery (blue) */}
            {[0, 0.9, 1.8, 2.7].map((d, i) => (
              <BloodParticle key={`pa-${i}`} pathId="flow-pa" color="#4fc3f7" delay={d} duration={baseDuration} size={3} />
            ))}
            {/* Pulmonary vein (red) */}
            {[0, 1, 2, 3].map((d, i) => (
              <BloodParticle key={`pv-${i}`} pathId="flow-pv" color="#ff6b6b" delay={d} duration={baseDuration * 1.25} size={3} />
            ))}
            {/* RA → RV (blue) */}
            {[0, 1.5].map((d, i) => (
              <BloodParticle key={`rr-${i}`} pathId="flow-ra-rv" color="#64b5f6" delay={d} duration={baseDuration * 0.8} size={2.5} />
            ))}
            {/* LA → LV (red) */}
            {[0, 1.5].map((d, i) => (
              <BloodParticle key={`ll-${i}`} pathId="flow-la-lv" color="#ef5350" delay={d} duration={baseDuration * 0.8} size={2.5} />
            ))}
          </g>
        )}

        {/* Vessel endpoint nodes */}
        {[
          { cx: 30, cy: 65, color: '#4fc3f7' },
          { cx: 35, cy: 130, color: '#ff6b6b' },
          { cx: 140, cy: 40, color: '#4fc3f7' },
          { cx: 450, cy: 65, color: '#ff4444' },
          { cx: 165, cy: 560, color: '#4fc3f7' },
        ].map((n, i) => (
          <g key={`node-${i}`}>
            <circle cx={n.cx} cy={n.cy} r="6" fill={n.color} opacity="0.12">
              <animate attributeName="r" values="5;8;5" dur="2.5s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
            </circle>
            <circle cx={n.cx} cy={n.cy} r="2.5" fill={n.color} opacity="0.7" />
          </g>
        ))}

        {/* Vessel labels */}
        <text x="420" y="50" fill="#e63946" fontSize="8" fontFamily="monospace" opacity="0.5" fontWeight="600">AORTA</text>
        <text x="95" y="30" fill="#457b9d" fontSize="7" fontFamily="monospace" opacity="0.5" fontWeight="600">SVC</text>
        <text x="125" y="572" fill="#457b9d" fontSize="7" fontFamily="monospace" opacity="0.5" fontWeight="600">IVC</text>
        <text x="8" y="55" fill="#457b9d" fontSize="6.5" fontFamily="monospace" opacity="0.4">TO LUNGS</text>
        <text x="8" y="145" fill="#e63946" fontSize="6.5" fontFamily="monospace" opacity="0.4">FROM LUNGS</text>

        {/* Chamber labels (subtle, appear on hover) */}
        {hoveredPart === 'right-atrium' && <text x="135" y="245" fill="#64b5f6" fontSize="8" fontFamily="monospace" opacity="0.8">RA</text>}
        {hoveredPart === 'left-atrium' && <text x="295" y="255" fill="#ff6b6b" fontSize="8" fontFamily="monospace" opacity="0.8">LA</text>}
        {hoveredPart === 'right-ventricle' && <text x="160" y="385" fill="#64b5f6" fontSize="8" fontFamily="monospace" opacity="0.8">RV</text>}
        {hoveredPart === 'left-ventricle' && <text x="290" y="385" fill="#ff6b6b" fontSize="8" fontFamily="monospace" opacity="0.8">LV</text>}
      </g>

      {/* Overlay slot for conduction / threat / evolution */}
      {children}
    </svg>
  );
}
