'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ConductionModeProps {
  active: boolean;
  speedMultiplier: number;
  hoveredNode: string | null;
  onNodeHover: (id: string | null) => void;
}

const conductionNodes = [
  {
    id: 'sa-node',
    name: 'SA Node (Sinoatrial)',
    description: 'The heart\'s natural pacemaker. Generates electrical impulses at 60–100 bpm, initiating each heartbeat.',
    cx: 185,
    cy: 210,
    color: '#00ff88',
  },
  {
    id: 'av-node',
    name: 'AV Node (Atrioventricular)',
    description: 'Delays the signal ~0.1s so atria finish contracting before ventricles fire. Acts as a gatekeeper.',
    cx: 235,
    cy: 285,
    color: '#aaff00',
  },
  {
    id: 'bundle-his',
    name: 'Bundle of His',
    description: 'Carries the electrical signal from the AV node through the septum (wall between ventricles).',
    cx: 235,
    cy: 340,
    color: '#ffdd00',
  },
  {
    id: 'purkinje-left',
    name: 'Purkinje Fibers (Left)',
    description: 'Branch through the left ventricle wall, causing simultaneous contraction from apex to base.',
    cx: 300,
    cy: 420,
    color: '#ffaa00',
  },
  {
    id: 'purkinje-right',
    name: 'Purkinje Fibers (Right)',
    description: 'Branch through the right ventricle wall, triggering synchronized contraction.',
    cx: 185,
    cy: 420,
    color: '#ffaa00',
  },
];

export default function ConductionMode({ active, speedMultiplier, hoveredNode, onNodeHover }: ConductionModeProps) {
  if (!active) return null;

  const signalDuration = 2.5 / speedMultiplier;

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Conduction pathway: SA → AV */}
      <motion.path
        d="M 185 215 Q 210 240 235 280"
        stroke="#00ff88"
        strokeWidth="3"
        fill="none"
        strokeDasharray="6 4"
        opacity="0.6"
        animate={{ strokeDashoffset: [20, 0] }}
        transition={{ duration: signalDuration * 0.4, repeat: Infinity, ease: 'linear' }}
      />

      {/* AV → Bundle of His */}
      <motion.path
        d="M 235 290 L 235 340"
        stroke="#aaff00"
        strokeWidth="3"
        fill="none"
        strokeDasharray="6 4"
        opacity="0.6"
        animate={{ strokeDashoffset: [16, 0] }}
        transition={{ duration: signalDuration * 0.3, repeat: Infinity, ease: 'linear', delay: signalDuration * 0.3 }}
      />

      {/* Bundle → Left Purkinje */}
      <motion.path
        d="M 235 340 Q 270 380 300 420 Q 310 440 300 460"
        stroke="#ffdd00"
        strokeWidth="2.5"
        fill="none"
        strokeDasharray="5 4"
        opacity="0.5"
        animate={{ strokeDashoffset: [24, 0] }}
        transition={{ duration: signalDuration * 0.4, repeat: Infinity, ease: 'linear', delay: signalDuration * 0.5 }}
      />

      {/* Bundle → Right Purkinje */}
      <motion.path
        d="M 235 340 Q 210 380 185 420 Q 170 440 175 460"
        stroke="#ffdd00"
        strokeWidth="2.5"
        fill="none"
        strokeDasharray="5 4"
        opacity="0.5"
        animate={{ strokeDashoffset: [24, 0] }}
        transition={{ duration: signalDuration * 0.4, repeat: Infinity, ease: 'linear', delay: signalDuration * 0.5 }}
      />

      {/* Signal pulse traveling SA → AV → Bundle → Purkinje */}
      <motion.circle
        r="5"
        fill="#00ff88"
        opacity="0.9"
        style={{ filter: 'drop-shadow(0 0 8px #00ff88)' }}
      >
        <animateMotion
          path="M 185 215 Q 210 240 235 280 L 235 340"
          dur={`${signalDuration}s`}
          repeatCount="indefinite"
          rotate="auto"
        />
      </motion.circle>

      {/* Nodes */}
      {conductionNodes.map((node) => (
        <g
          key={node.id}
          onMouseEnter={() => onNodeHover(node.id)}
          onMouseLeave={() => onNodeHover(null)}
          className="cursor-pointer"
        >
          {/* Glow ring */}
          <circle cx={node.cx} cy={node.cy} r="12" fill="none" stroke={node.color} strokeWidth="1" opacity="0.3">
            <animate attributeName="r" values="10;14;10" dur={`${signalDuration * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur={`${signalDuration * 0.5}s`} repeatCount="indefinite" />
          </circle>
          {/* Core dot */}
          <circle
            cx={node.cx}
            cy={node.cy}
            r={hoveredNode === node.id ? 7 : 5}
            fill={node.color}
            style={{
              filter: `drop-shadow(0 0 6px ${node.color})`,
              transition: 'r 0.2s ease',
            }}
          >
            <animate attributeName="opacity" values="0.8;1;0.8" dur="1s" repeatCount="indefinite" />
          </circle>
          {/* Label */}
          <text
            x={node.cx + 16}
            y={node.cy + 4}
            fill={node.color}
            fontSize="8"
            fontFamily="monospace"
            opacity={hoveredNode === node.id ? 1 : 0.6}
            style={{ transition: 'opacity 0.2s' }}
          >
            {node.id === 'sa-node' ? 'SA NODE' :
             node.id === 'av-node' ? 'AV NODE' :
             node.id === 'bundle-his' ? 'BUNDLE OF HIS' :
             node.id === 'purkinje-left' ? 'L-PURKINJE' : 'R-PURKINJE'}
          </text>
        </g>
      ))}
    </motion.g>
  );
}

// Export node data for the info panel
export { conductionNodes };
