'use client';

import { motion } from 'framer-motion';

interface HudOverlayProps {
  hoveredPart: string | null;
  chamberBounds: { x: number; y: number; w: number; h: number } | null;
}

export default function HudOverlay({ hoveredPart, chamberBounds }: HudOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Animated grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.15), rgba(0, 212, 255, 0.2), rgba(0, 255, 136, 0.15), transparent)',
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
        }}
        animate={{ y: ['0vh', '100vh'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Corner brackets */}
      <CornerBracket position="top-left" />
      <CornerBracket position="top-right" />
      <CornerBracket position="bottom-left" />
      <CornerBracket position="bottom-right" />

      {/* Crosshairs — target hovered chamber */}
      {hoveredPart && chamberBounds && (
        <motion.div
          className="absolute"
          initial={{ opacity: 0, scale: 1.3 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{
            left: chamberBounds.x - 12,
            top: chamberBounds.y - 12,
            width: chamberBounds.w + 24,
            height: chamberBounds.h + 24,
          }}
        >
          {/* Top-left corner */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-sm" style={{ borderColor: '#00ff88' }} />
          {/* Top-right corner */}
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-sm" style={{ borderColor: '#00ff88' }} />
          {/* Bottom-left corner */}
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-sm" style={{ borderColor: '#00ff88' }} />
          {/* Bottom-right corner */}
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-sm" style={{ borderColor: '#00ff88' }} />
          {/* Center dot */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 4,
              height: 4,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#00ff88',
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
      )}

      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.4) 100%)',
        }}
      />
    </div>
  );
}

function CornerBracket({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const styles: React.CSSProperties = {
    position: 'absolute',
    width: 30,
    height: 30,
  };

  const borderStyle = '1px solid rgba(0, 255, 136, 0.25)';

  switch (position) {
    case 'top-left':
      return <div style={{ ...styles, top: 16, left: 16, borderTop: borderStyle, borderLeft: borderStyle }} />;
    case 'top-right':
      return <div style={{ ...styles, top: 16, right: 16, borderTop: borderStyle, borderRight: borderStyle }} />;
    case 'bottom-left':
      return <div style={{ ...styles, bottom: 16, left: 16, borderBottom: borderStyle, borderLeft: borderStyle }} />;
    case 'bottom-right':
      return <div style={{ ...styles, bottom: 16, right: 16, borderBottom: borderStyle, borderRight: borderStyle }} />;
  }
}
