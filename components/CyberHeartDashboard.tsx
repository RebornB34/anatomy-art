'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HudOverlay from './HudOverlay';
import BpmController from './BpmController';
import DataFlowPanel from './DataFlowPanel';
import InfoPanel from './InfoPanel';
import HeartSVG, { heartPartsData } from './HeartSVG';
import ConductionMode, { conductionNodes } from './ConductionMode';
import ThreatSimulation, { ThreatOverlay } from './ThreatSimulation';
import EvolutionToggle, { AmphibianHeart, amphibianParts } from './EvolutionToggle';
import { useSoundEngine, SoundToggle } from './SoundEngine';

type ViewMode = 'circulatory' | 'conduction';

export default function CyberHeartDashboard() {
  const [bpm, setBpm] = useState(72);
  const [bpmOverride, setBpmOverride] = useState<number | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('circulatory');
  const [threatActive, setThreatActive] = useState(false);
  const [threatType, setThreatType] = useState<string | null>(null);
  const [threatStatus, setThreatStatus] = useState<string>('idle');
  const [is3Chamber, setIs3Chamber] = useState(false);
  const [conductionHoveredNode, setConductionHoveredNode] = useState<string | null>(null);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);

  const sound = useSoundEngine();

  const effectiveBpm = bpmOverride ?? bpm;
  const speedMultiplier = effectiveBpm / 72;

  // Play heartbeat sound on each pulse
  useEffect(() => {
    if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
    const ms = (60 / effectiveBpm) * 1000;
    heartbeatInterval.current = setInterval(() => {
      sound.playHeartbeat();
    }, ms);
    return () => {
      if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
    };
  }, [effectiveBpm, sound.playHeartbeat]);

  const handlePartHover = useCallback((id: string | null) => {
    if (id && id !== hoveredPart) {
      sound.playHoverBlip();
    }
    setHoveredPart(id);
  }, [hoveredPart, sound]);

  const toggleViewMode = useCallback(() => {
    sound.playModeSwitch();
    setViewMode((prev) => (prev === 'circulatory' ? 'conduction' : 'circulatory'));
  }, [sound]);

  const toggleThreat = useCallback(() => {
    sound.playModeSwitch();
    setThreatActive((prev) => !prev);
  }, [sound]);

  const toggleEvolution = useCallback(() => {
    sound.playModeSwitch();
    setIs3Chamber((prev) => !prev);
  }, [sound]);

  // Determine which part info to show
  const getInfoPart = () => {
    if (!hoveredPart) return null;

    // Check conduction nodes
    if (viewMode === 'conduction') {
      const node = conductionNodes.find((n) => n.id === (conductionHoveredNode || hoveredPart));
      if (node) {
        return {
          id: node.id,
          name: node.name,
          description: node.description,
          funFact: 'Part of the cardiac conduction system.',
          oxygenated: false,
          color: node.color,
          glowColor: node.color,
        };
      }
    }

    // Check amphibian parts
    if (is3Chamber) {
      const ampPart = amphibianParts.find((p) => p.id === hoveredPart);
      if (ampPart) return ampPart;
    }

    // Default human heart
    return heartPartsData.find((p) => p.id === hoveredPart) || null;
  };

  // Conduction node info
  const getConductionInfo = () => {
    if (!conductionHoveredNode) return null;
    const node = conductionNodes.find((n) => n.id === conductionHoveredNode);
    if (!node) return null;
    return {
      id: node.id,
      name: node.name,
      description: node.description,
      funFact: 'Part of the cardiac conduction system that coordinates heartbeats.',
      oxygenated: false,
      color: node.color,
      glowColor: node.color,
    };
  };

  const displayPart = getConductionInfo() || getInfoPart();

  // Simple chamber bounds for crosshairs (approximate SVG positions mapped to view)
  const getChamberBounds = () => {
    if (!hoveredPart) return null;
    const bounds: Record<string, { x: number; y: number; w: number; h: number }> = {
      'right-atrium': { x: 115, y: 185, w: 95, h: 120 },
      'left-atrium': { x: 255, y: 190, w: 100, h: 120 },
      'right-ventricle': { x: 115, y: 280, w: 125, h: 200 },
      'left-ventricle': { x: 230, y: 280, w: 140, h: 200 },
      'aorta': { x: 260, y: 50, w: 210, h: 200 },
      'superior-vena-cava': { x: 125, y: 30, w: 50, h: 160 },
      'inferior-vena-cava': { x: 155, y: 375, w: 45, h: 190 },
      'pulmonary-artery': { x: 20, y: 50, w: 185, h: 190 },
      'pulmonary-vein': { x: 25, y: 120, w: 265, h: 125 },
    };
    return bounds[hoveredPart] || null;
  };

  return (
    <div className="relative w-full min-h-screen bg-[#060a13] flex flex-col items-center justify-center overflow-hidden">
      {/* HUD Overlay (grid, scanning line, brackets, crosshairs) */}
      <HudOverlay hoveredPart={hoveredPart} chamberBounds={getChamberBounds()} />

      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(214, 40, 40, 0.06) 0%, transparent 70%)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(230, 57, 70, 0.05) 0%, transparent 70%)',
            left: '50%',
            top: '45%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 60 / effectiveBpm, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* ========== TOP BAR ========== */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-start justify-between pointer-events-none">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-auto"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#00ff88]">System Online</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold font-mono tracking-tight">
            <span className="bg-gradient-to-r from-[#e63946] via-[#00ff88] to-[#457b9d] bg-clip-text text-transparent">
              CYBER-AORTIC SYSTEM BLUEPRINT
            </span>
          </h1>
          <p className="text-[10px] text-gray-600 font-mono tracking-wider mt-0.5">
            DEVELOPER DUO: RebornB34 &amp; VibeMedic
          </p>
        </motion.div>

        {/* BPM Controller */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pointer-events-auto"
        >
          <BpmController bpm={effectiveBpm} onBpmChange={setBpm} />
        </motion.div>
      </div>

      {/* ========== MODE TOGGLE BAR ========== */}
      <div className="absolute top-[100px] left-4 z-20 flex flex-col gap-2">
        {/* View mode toggle */}
        <button
          onClick={toggleViewMode}
          className="text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded border transition-all duration-200 text-left"
          style={{
            borderColor: viewMode === 'conduction' ? 'rgba(0, 255, 136, 0.4)' : 'rgba(255, 255, 255, 0.1)',
            color: viewMode === 'conduction' ? '#00ff88' : 'rgba(255,255,255,0.4)',
            backgroundColor: viewMode === 'conduction' ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255,255,255,0.02)',
          }}
        >
          {viewMode === 'circulatory' ? '⚡ Conduction Mode' : '🔴 Circulatory Mode'}
        </button>

        {/* Threat sim toggle */}
        <button
          onClick={toggleThreat}
          className="text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded border transition-all duration-200 text-left"
          style={{
            borderColor: threatActive ? 'rgba(255, 70, 70, 0.4)' : 'rgba(255, 255, 255, 0.1)',
            color: threatActive ? '#ff4444' : 'rgba(255,255,255,0.4)',
            backgroundColor: threatActive ? 'rgba(255, 70, 70, 0.05)' : 'rgba(255,255,255,0.02)',
          }}
        >
          {threatActive ? '✕ Exit Threat Sim' : '🛡 Threat Simulation'}
        </button>

        {/* Evolution toggle */}
        <EvolutionToggle is3Chamber={is3Chamber} onToggle={toggleEvolution} />

        {/* Sound toggle */}
        <SoundToggle enabled={sound.enabled} onToggle={sound.toggle} />
      </div>

      {/* ========== HEART (CENTER) ========== */}
      <div className="relative z-10 flex flex-col items-center mt-16">
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.02, 1.05, 1.02, 1],
          }}
          transition={{
            duration: 60 / effectiveBpm,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
            times: [0, 0.15, 0.3, 0.5, 1],
          }}
        >
          <AnimatePresence mode="wait">
            {is3Chamber ? (
              <motion.div
                key="amphibian"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <svg viewBox="0 0 500 600" className="w-full max-w-lg" style={{ filter: 'drop-shadow(0 0 20px rgba(124, 77, 255, 0.15))' }}>
                  <AmphibianHeart hoveredPart={hoveredPart} onPartHover={handlePartHover} />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="human"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <HeartSVG
                  hoveredPart={hoveredPart}
                  onPartHover={handlePartHover}
                  speedMultiplier={speedMultiplier}
                  dimmed={viewMode === 'conduction'}
                >
                  {/* Conduction overlay */}
                  <AnimatePresence>
                    {viewMode === 'conduction' && (
                      <ConductionMode
                        active={true}
                        speedMultiplier={speedMultiplier}
                        hoveredNode={conductionHoveredNode}
                        onNodeHover={setConductionHoveredNode}
                      />
                    )}
                  </AnimatePresence>

                  {/* Threat overlay */}
                  <ThreatOverlay
                    active={threatActive}
                    threatType={threatType as any}
                    status={threatStatus as any}
                  />
                </HeartSVG>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info Panel */}
        <div className="mt-4">
          <InfoPanel part={displayPart} />
        </div>
      </div>

      {/* ========== BOTTOM PANELS ========== */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between pointer-events-none">
        {/* Data flow panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pointer-events-auto"
        >
          <DataFlowPanel bpm={effectiveBpm} />
        </motion.div>

        {/* Threat sim panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pointer-events-auto"
        >
          <AnimatePresence>
            {threatActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <ThreatSimulation
                  active={threatActive}
                  onBpmOverride={(val) => {
                    setBpmOverride(val);
                    if (val) setThreatType('hypertension');
                  }}
                  onPlayPatchSuccess={sound.playPatchSuccess}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="pointer-events-auto rounded-lg border p-3"
          style={{
            background: 'rgba(0, 10, 20, 0.8)',
            borderColor: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex flex-col gap-1.5 text-[10px] font-mono">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#e63946', boxShadow: '0 0 6px rgba(230,57,70,0.5)' }} />
              <span className="text-gray-400">Crimson: Oxygenated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#457b9d', boxShadow: '0 0 6px rgba(69,123,157,0.5)' }} />
              <span className="text-gray-400">Cyan: Deoxygenated</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#00ff88' }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span className="text-gray-400">Signal: Conduction</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
