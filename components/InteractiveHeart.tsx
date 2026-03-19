'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeartPart {
  id: string;
  name: string;
  description: string;
  funFact: string;
  oxygenated: boolean;
  color: string;
  hoverColor: string;
  glowColor: string;
}

const heartParts: HeartPart[] = [
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

// Blood particle component that follows a path
function BloodParticle({
  pathId,
  color,
  delay,
  duration,
  size = 4,
}: {
  pathId: string;
  color: string;
  delay: number;
  duration: number;
  size?: number;
}) {
  return (
    <circle r={size} fill={color} opacity="0.9">
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

// Ambient floating particle for the background
function AmbientParticle({ index }: { index: number }) {
  const x = Math.random() * 100;
  const duration = 8 + Math.random() * 12;
  const delay = Math.random() * 5;
  const size = 1 + Math.random() * 2;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: '-5%',
        background: index % 2 === 0 ? 'rgba(230, 57, 70, 0.4)' : 'rgba(69, 123, 157, 0.4)',
      }}
      animate={{
        y: [0, -window?.innerHeight * 1.1 || -800],
        opacity: [0, 0.6, 0.6, 0],
        x: [0, Math.sin(index) * 30, Math.cos(index) * 20, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

export default function InteractiveHeart() {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePartHover = (partId: string) => {
    setHoveredPart(partId);
  };

  const part = heartParts.find((p) => p.id === hoveredPart);

  return (
    <div className="relative w-full min-h-screen bg-[#060a13] flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient background particles */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <AmbientParticle key={i} index={i} />
          ))}
        </div>
      )}

      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(214, 40, 40, 0.08) 0%, transparent 70%)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(230, 57, 70, 0.06) 0%, transparent 70%)',
            left: '50%',
            top: '45%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4 py-8 w-full max-w-3xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[#e63946] via-[#d62828] to-[#457b9d] bg-clip-text text-transparent">
              The Human Heart
            </span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base tracking-wide font-light">
            Explore the circulatory system — hover over each part to learn more
          </p>
        </motion.div>

        {/* Heart SVG Container */}
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.03, 1.06, 1.03, 1],
          }}
          transition={{
            duration: 0.85,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
            times: [0, 0.15, 0.3, 0.5, 1],
          }}
        >
          <svg
            viewBox="0 0 500 600"
            className="w-full max-w-lg"
            style={{
              filter: hoveredPart
                ? 'drop-shadow(0 0 40px rgba(230, 57, 70, 0.25))'
                : 'drop-shadow(0 0 25px rgba(230, 57, 70, 0.15))',
              transition: 'filter 0.3s ease',
            }}
          >
            <defs>
              {/* Gradients for chambers */}
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

              {/* Glow filters */}
              <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Blood flow paths (invisible, used for animateMotion) */}
              {/* Aorta flow — up and arching right */}
              <path id="flow-aorta" d="M 270 240 Q 270 160 310 120 Q 370 70 400 60 Q 440 55 460 90" fill="none" />
              {/* Superior vena cava flow — down into right atrium */}
              <path id="flow-svc" d="M 140 40 Q 140 80 150 120 Q 155 160 170 190" fill="none" />
              {/* Inferior vena cava flow — up into right atrium */}
              <path id="flow-ivc" d="M 170 560 Q 170 520 175 480 Q 180 440 185 400 Q 190 370 195 340" fill="none" />
              {/* Pulmonary artery flow — up and left from right ventricle */}
              <path id="flow-pa" d="M 200 220 Q 180 180 150 140 Q 120 100 80 70 Q 50 50 30 55" fill="none" />
              {/* Pulmonary vein flow — down and right into left atrium */}
              <path id="flow-pv" d="M 30 120 Q 70 130 120 160 Q 180 190 230 210 Q 260 220 280 230" fill="none" />
              {/* Through right atrium into right ventricle */}
              <path id="flow-ra-rv" d="M 170 200 Q 180 250 195 290 Q 210 330 220 360" fill="none" />
              {/* Through left atrium into left ventricle */}
              <path id="flow-la-lv" d="M 290 220 Q 300 260 310 300 Q 315 340 310 380" fill="none" />
            </defs>

            {/* ============== MAIN HEART STRUCTURE ============== */}

            {/* Aorta — the big arch */}
            <motion.path
              d="M 265 245 Q 265 175 295 135 Q 330 90 380 70 Q 420 55 450 65 Q 470 75 465 100 Q 460 120 440 130"
              stroke={hoveredPart === 'aorta' ? '#ff1744' : 'url(#grad-aorta)'}
              strokeWidth={hoveredPart === 'aorta' ? 18 : 15}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              onMouseEnter={() => handlePartHover('aorta')}
              onMouseLeave={() => setHoveredPart(null)}
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
              onMouseEnter={() => handlePartHover('superior-vena-cava')}
              onMouseLeave={() => setHoveredPart(null)}
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
              onMouseEnter={() => handlePartHover('inferior-vena-cava')}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer"
              style={{
                transition: 'stroke-width 0.2s ease, stroke 0.2s ease',
                filter: hoveredPart === 'inferior-vena-cava' ? 'drop-shadow(0 0 12px rgba(69, 123, 157, 0.8))' : 'none',
              }}
            />

            {/* Pulmonary Artery — branches from right ventricle up-left */}
            <motion.path
              d="M 195 230 Q 170 190 140 155 Q 110 115 75 85 Q 50 65 30 65"
              stroke={hoveredPart === 'pulmonary-artery' ? '#00b4d8' : 'url(#grad-pulm-artery)'}
              strokeWidth={hoveredPart === 'pulmonary-artery' ? 14 : 11}
              fill="none"
              strokeLinecap="round"
              onMouseEnter={() => handlePartHover('pulmonary-artery')}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer"
              style={{
                transition: 'stroke-width 0.2s ease, stroke 0.2s ease',
                filter: hoveredPart === 'pulmonary-artery' ? 'drop-shadow(0 0 12px rgba(69, 123, 157, 0.8))' : 'none',
              }}
            />
            {/* Pulmonary artery branch */}
            <path
              d="M 75 85 Q 55 80 35 90 Q 20 100 25 120"
              stroke="url(#grad-pulm-artery)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />

            {/* Pulmonary Veins — from lungs back to left atrium */}
            <motion.path
              d="M 35 130 Q 70 135 120 165 Q 180 200 240 225 Q 270 235 285 240"
              stroke={hoveredPart === 'pulmonary-vein' ? '#ff5252' : 'url(#grad-pulm-vein)'}
              strokeWidth={hoveredPart === 'pulmonary-vein' ? 12 : 9}
              fill="none"
              strokeLinecap="round"
              onMouseEnter={() => handlePartHover('pulmonary-vein')}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer"
              style={{
                transition: 'stroke-width 0.2s ease, stroke 0.2s ease',
                filter: hoveredPart === 'pulmonary-vein' ? 'drop-shadow(0 0 12px rgba(230, 57, 70, 0.8))' : 'none',
              }}
            />

            {/* ============== HEART CHAMBERS ============== */}

            {/* Right Atrium — upper right of heart (viewer's left) */}
            <motion.path
              d="M 165 185 Q 130 195 120 230 Q 115 260 130 285 Q 145 300 175 305 Q 195 300 210 280 L 210 230 Q 210 200 185 190 Z"
              fill={hoveredPart === 'right-atrium' ? '#48cae4' : 'url(#grad-right-atrium)'}
              onMouseEnter={() => handlePartHover('right-atrium')}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer"
              style={{
                transition: 'fill 0.2s ease',
                filter: hoveredPart === 'right-atrium' ? 'drop-shadow(0 0 15px rgba(106, 137, 183, 0.8))' : 'none',
              }}
            />

            {/* Left Atrium — upper left of heart (viewer's right) */}
            <motion.path
              d="M 280 195 Q 310 195 335 215 Q 355 235 350 265 Q 345 290 320 305 Q 295 310 270 300 L 260 280 L 260 230 Q 260 205 280 195 Z"
              fill={hoveredPart === 'left-atrium' ? '#ff5252' : 'url(#grad-left-atrium)'}
              onMouseEnter={() => handlePartHover('left-atrium')}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer"
              style={{
                transition: 'fill 0.2s ease',
                filter: hoveredPart === 'left-atrium' ? 'drop-shadow(0 0 15px rgba(193, 18, 31, 0.8))' : 'none',
              }}
            />

            {/* Septum divider — thin line between left and right */}
            <line
              x1="235"
              y1="210"
              x2="235"
              y2="460"
              stroke="#0d1520"
              strokeWidth="3"
              opacity="0.6"
            />

            {/* Right Ventricle — lower right of heart (viewer's left) */}
            <motion.path
              d="M 130 290 Q 115 320 120 360 Q 125 400 145 430 Q 170 465 200 480 Q 220 485 235 470 L 235 310 Q 230 295 210 285 Q 175 290 130 290 Z"
              fill={hoveredPart === 'right-ventricle' ? '#64b5f6' : 'url(#grad-right-ventricle)'}
              onMouseEnter={() => handlePartHover('right-ventricle')}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer"
              style={{
                transition: 'fill 0.2s ease',
                filter: hoveredPart === 'right-ventricle' ? 'drop-shadow(0 0 15px rgba(94, 129, 172, 0.8))' : 'none',
              }}
            />

            {/* Left Ventricle — lower left of heart (viewer's right), thicker */}
            <motion.path
              d="M 235 310 L 235 470 Q 250 485 275 480 Q 320 460 345 420 Q 365 385 365 345 Q 360 310 340 295 Q 310 285 280 295 Q 255 300 235 310 Z"
              fill={hoveredPart === 'left-ventricle' ? '#ff1744' : 'url(#grad-left-ventricle)'}
              onMouseEnter={() => handlePartHover('left-ventricle')}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer"
              style={{
                transition: 'fill 0.2s ease',
                filter: hoveredPart === 'left-ventricle' ? 'drop-shadow(0 0 15px rgba(214, 40, 40, 0.8))' : 'none',
              }}
            />

            {/* Valve lines (tricuspid / mitral) */}
            <path
              d="M 140 290 Q 175 280 210 290"
              stroke="#1a2940"
              strokeWidth="2.5"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M 260 295 Q 300 282 345 295"
              stroke="#2a1520"
              strokeWidth="2.5"
              fill="none"
              opacity="0.5"
            />

            {/* Subtle surface detail lines on chambers */}
            <path d="M 145 250 Q 165 245 180 255" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.08" />
            <path d="M 300 240 Q 320 235 335 248" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.08" />
            <path d="M 155 360 Q 185 350 210 365" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.06" />
            <path d="M 270 350 Q 305 338 340 355" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.06" />

            {/* ============== BLOOD FLOW PARTICLES ============== */}

            {/* Aorta particles (red, oxygenated) */}
            {[0, 0.8, 1.6, 2.4].map((delay, i) => (
              <BloodParticle key={`aorta-${i}`} pathId="flow-aorta" color="#ff4444" delay={delay} duration={3.2} size={3.5} />
            ))}

            {/* Superior vena cava particles (blue, deoxygenated) */}
            {[0, 1, 2].map((delay, i) => (
              <BloodParticle key={`svc-${i}`} pathId="flow-svc" color="#4fc3f7" delay={delay} duration={3} size={3} />
            ))}

            {/* Inferior vena cava particles (blue, deoxygenated) */}
            {[0, 1.2, 2.4].map((delay, i) => (
              <BloodParticle key={`ivc-${i}`} pathId="flow-ivc" color="#4fc3f7" delay={delay} duration={3.5} size={3} />
            ))}

            {/* Pulmonary artery particles (blue, going to lungs) */}
            {[0, 0.9, 1.8, 2.7].map((delay, i) => (
              <BloodParticle key={`pa-${i}`} pathId="flow-pa" color="#4fc3f7" delay={delay} duration={3.2} size={3} />
            ))}

            {/* Pulmonary vein particles (red, coming from lungs) */}
            {[0, 1, 2, 3].map((delay, i) => (
              <BloodParticle key={`pv-${i}`} pathId="flow-pv" color="#ff6b6b" delay={delay} duration={4} size={3} />
            ))}

            {/* Internal flow: right atrium → right ventricle */}
            {[0, 1.5].map((delay, i) => (
              <BloodParticle key={`ra-rv-${i}`} pathId="flow-ra-rv" color="#64b5f6" delay={delay} duration={2.5} size={2.5} />
            ))}

            {/* Internal flow: left atrium → left ventricle */}
            {[0, 1.5].map((delay, i) => (
              <BloodParticle key={`la-lv-${i}`} pathId="flow-la-lv" color="#ef5350" delay={delay} duration={2.5} size={2.5} />
            ))}

            {/* ============== DECORATIVE NODES ============== */}
            {[
              { cx: 30, cy: 65, color: '#4fc3f7' },
              { cx: 35, cy: 130, color: '#ff6b6b' },
              { cx: 140, cy: 40, color: '#4fc3f7' },
              { cx: 450, cy: 65, color: '#ff4444' },
              { cx: 165, cy: 560, color: '#4fc3f7' },
            ].map((node, i) => (
              <g key={`node-${i}`}>
                <circle cx={node.cx} cy={node.cy} r="6" fill={node.color} opacity="0.15">
                  <animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                  <animate attributeName="opacity" values="0.15;0.3;0.15" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                </circle>
                <circle cx={node.cx} cy={node.cy} r="3" fill={node.color} opacity="0.8">
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
                </circle>
              </g>
            ))}

            {/* Floating labels on vessels (small text labels) */}
            <text x="420" y="50" fill="#e63946" fontSize="9" fontFamily="Inter, sans-serif" opacity="0.6" fontWeight="600">AORTA</text>
            <text x="90" y="30" fill="#457b9d" fontSize="8" fontFamily="Inter, sans-serif" opacity="0.6" fontWeight="600">SVC</text>
            <text x="120" y="570" fill="#457b9d" fontSize="8" fontFamily="Inter, sans-serif" opacity="0.6" fontWeight="600">IVC</text>
            <text x="10" y="55" fill="#457b9d" fontSize="7" fontFamily="Inter, sans-serif" opacity="0.5" fontWeight="600">TO LUNGS</text>
            <text x="10" y="145" fill="#e63946" fontSize="7" fontFamily="Inter, sans-serif" opacity="0.5" fontWeight="600">FROM LUNGS</text>

          </svg>
        </motion.div>

        {/* Info Panel */}
        <AnimatePresence mode="wait">
          {hoveredPart && part ? (
            <motion.div
              key={part.id}
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full max-w-md"
            >
              <div
                className="p-5 rounded-2xl border backdrop-blur-xl"
                style={{
                  background: part.oxygenated
                    ? 'linear-gradient(135deg, rgba(214, 40, 40, 0.08) 0%, rgba(30, 10, 10, 0.6) 100%)'
                    : 'linear-gradient(135deg, rgba(69, 123, 157, 0.08) 0%, rgba(10, 20, 30, 0.6) 100%)',
                  borderColor: part.oxygenated
                    ? 'rgba(230, 57, 70, 0.25)'
                    : 'rgba(69, 123, 157, 0.25)',
                  boxShadow: `0 8px 32px ${part.oxygenated ? 'rgba(230, 57, 70, 0.1)' : 'rgba(69, 123, 157, 0.1)'}`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: part.color,
                      boxShadow: `0 0 10px ${part.glowColor}`,
                    }}
                  />
                  <h3
                    className="text-lg font-bold tracking-tight"
                    style={{ color: part.oxygenated ? '#ff6b6b' : '#64b5f6' }}
                  >
                    {part.name}
                  </h3>
                  <span
                    className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wider uppercase"
                    style={{
                      backgroundColor: part.oxygenated
                        ? 'rgba(230, 57, 70, 0.15)'
                        : 'rgba(69, 123, 157, 0.15)',
                      color: part.oxygenated ? '#ff6b6b' : '#64b5f6',
                    }}
                  >
                    {part.oxygenated ? '● O₂ Rich' : '● O₂ Poor'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{part.description}</p>
                <div
                  className="mt-3 pt-3 text-xs text-gray-500 italic"
                  style={{
                    borderTop: `1px solid ${part.oxygenated ? 'rgba(230, 57, 70, 0.12)' : 'rgba(69, 123, 157, 0.12)'}`,
                  }}
                >
                  💡 {part.funFact}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md h-[140px] flex items-center justify-center"
            >
              <p className="text-gray-600 text-sm text-center">
                <span className="inline-block w-2 h-2 rounded-full bg-gray-700 mr-2 animate-pulse" />
                Hover over the heart to explore its anatomy
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#e63946', boxShadow: '0 0 6px rgba(230,57,70,0.5)' }} />
            <span>Oxygenated Blood</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#457b9d', boxShadow: '0 0 6px rgba(69,123,157,0.5)' }} />
            <span>Deoxygenated Blood</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-gray-400"
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span>Blood Flow</span>
          </div>
        </div>
      </div>
    </div>
  );
}
