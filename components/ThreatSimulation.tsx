'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

type ThreatType = 'hypertension' | 'blocked-artery' | 'valve-malfunction' | null;
type ThreatStatus = 'idle' | 'compromised' | 'patching' | 'restored';

interface ThreatSimulationProps {
  active: boolean;
  onBpmOverride: (bpm: number | null) => void;
  onPlayPatchSuccess: () => void;
}

const threats: { type: ThreatType; name: string; icon: string; description: string }[] = [
  {
    type: 'hypertension',
    name: 'Hypertension Attack',
    icon: '📈',
    description: 'Blood pressure critical — aorta under stress. BPM spiking.',
  },
  {
    type: 'blocked-artery',
    name: 'Arterial Blockage',
    icon: '🚧',
    description: 'Coronary artery obstruction detected. Blood flow restricted.',
  },
  {
    type: 'valve-malfunction',
    name: 'Valve Malfunction',
    icon: '⚠️',
    description: 'Mitral valve regurgitation — backflow detected in left atrium.',
  },
];

export default function ThreatSimulation({ active, onBpmOverride, onPlayPatchSuccess }: ThreatSimulationProps) {
  const [currentThreat, setCurrentThreat] = useState<ThreatType>(null);
  const [status, setStatus] = useState<ThreatStatus>('idle');
  const [patchProgress, setPatchProgress] = useState(0);

  const launchThreat = useCallback((type: ThreatType) => {
    setCurrentThreat(type);
    setStatus('compromised');
    setPatchProgress(0);
    if (type === 'hypertension') {
      onBpmOverride(160);
    }
  }, [onBpmOverride]);

  const patchThreat = useCallback(() => {
    if (status !== 'compromised') return;
    setStatus('patching');
    setPatchProgress(0);

    const interval = setInterval(() => {
      setPatchProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('restored');
          setCurrentThreat(null);
          onBpmOverride(null);
          onPlayPatchSuccess();
          setTimeout(() => {
            setStatus('idle');
          }, 2000);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
  }, [status, onBpmOverride, onPlayPatchSuccess]);

  // Reset when deactivated
  useEffect(() => {
    if (!active) {
      setCurrentThreat(null);
      setStatus('idle');
      setPatchProgress(0);
      onBpmOverride(null);
    }
  }, [active, onBpmOverride]);

  if (!active) return null;

  const threatInfo = threats.find((t) => t.type === currentThreat);

  return (
    <div
      className="rounded-lg border p-3"
      style={{
        background: 'rgba(0, 10, 20, 0.85)',
        borderColor: status === 'compromised' ? 'rgba(255, 50, 50, 0.4)' : status === 'restored' ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 170, 0, 0.15)',
        backdropFilter: 'blur(10px)',
        maxWidth: 300,
        transition: 'border-color 0.3s ease',
      }}
    >
      <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-2" style={{
        color: status === 'compromised' ? '#ff4444' : status === 'restored' ? '#00ff88' : '#ffaa00',
      }}>
        <span>▸ Threat Simulation</span>
        <span className="ml-auto text-[8px] px-1.5 py-0.5 rounded border" style={{
          borderColor: status === 'idle' ? 'rgba(0,255,136,0.2)' : status === 'compromised' ? 'rgba(255,50,50,0.3)' : status === 'patching' ? 'rgba(255,170,0,0.3)' : 'rgba(0,255,136,0.3)',
          color: status === 'idle' ? '#00ff88' : status === 'compromised' ? '#ff4444' : status === 'patching' ? '#ffaa00' : '#00ff88',
        }}>
          {status === 'idle' ? 'STANDBY' : status === 'compromised' ? 'COMPROMISED' : status === 'patching' ? 'PATCHING...' : 'RESTORED'}
        </span>
      </div>

      {status === 'idle' && (
        <div className="flex flex-col gap-1.5">
          <div className="text-[9px] text-gray-500 font-mono mb-1">Select threat vector:</div>
          {threats.map((threat) => (
            <button
              key={threat.type}
              onClick={() => launchThreat(threat.type)}
              className="text-left text-[10px] font-mono px-2 py-1.5 rounded border transition-all duration-200 hover:scale-[1.02]"
              style={{
                borderColor: 'rgba(255, 170, 0, 0.15)',
                color: 'rgba(255, 200, 100, 0.7)',
                backgroundColor: 'rgba(255, 170, 0, 0.03)',
              }}
            >
              {threat.icon} {threat.name}
            </button>
          ))}
        </div>
      )}

      {status === 'compromised' && threatInfo && (
        <div className="flex flex-col gap-2">
          <motion.div
            className="text-xs font-mono"
            style={{ color: '#ff6666' }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            {threatInfo.icon} {threatInfo.description}
          </motion.div>
          <button
            onClick={patchThreat}
            className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-all duration-200 hover:scale-105"
            style={{
              borderColor: 'rgba(0, 255, 136, 0.4)',
              color: '#00ff88',
              backgroundColor: 'rgba(0, 255, 136, 0.08)',
            }}
          >
            ⚡ Deploy Patch
          </button>
        </div>
      )}

      {status === 'patching' && (
        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-mono" style={{ color: '#ffaa00' }}>Applying countermeasures...</div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: '#ffaa00', width: `${patchProgress}%`, transition: 'width 0.08s linear' }}
            />
          </div>
          <div className="text-[9px] font-mono text-gray-500 text-right">{patchProgress}%</div>
        </div>
      )}

      {status === 'restored' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-mono"
          style={{ color: '#00ff88' }}
        >
          ✓ System integrity restored. All vitals nominal.
        </motion.div>
      )}
    </div>
  );
}

// SVG overlay for threat visual effects
export function ThreatOverlay({
  active,
  threatType,
  status,
}: {
  active: boolean;
  threatType: ThreatType;
  status: ThreatStatus;
}) {
  if (!active || !threatType || status === 'restored' || status === 'idle') return null;

  return (
    <g>
      {/* Hypertension: pulsing red overlay on aorta region */}
      {threatType === 'hypertension' && (
        <motion.circle
          cx="350"
          cy="150"
          r="60"
          fill="none"
          stroke="#ff0000"
          strokeWidth="2"
          opacity="0.4"
          animate={{ r: [50, 70, 50], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}

      {/* Blocked artery: obstruction mark */}
      {threatType === 'blocked-artery' && (
        <g>
          <motion.line
            x1="365"
            y1="330"
            x2="345"
            y2="350"
            stroke="#ff4444"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <motion.line
            x1="345"
            y1="330"
            x2="365"
            y2="350"
            stroke="#ff4444"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </g>
      )}

      {/* Valve malfunction: backflow arrows */}
      {threatType === 'valve-malfunction' && (
        <motion.text
          x="275"
          y="300"
          fill="#ff4444"
          fontSize="18"
          fontWeight="bold"
          animate={{ opacity: [0.4, 1, 0.4], y: [298, 302, 298] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        >
          ↑↑
        </motion.text>
      )}

      {/* Warning border flash */}
      {status === 'compromised' && (
        <motion.rect
          x="100"
          y="160"
          width="300"
          height="340"
          rx="10"
          fill="none"
          stroke="#ff0000"
          strokeWidth="1.5"
          strokeDasharray="8 6"
          animate={{ opacity: [0.1, 0.35, 0.1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </g>
  );
}
