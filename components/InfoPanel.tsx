'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface HeartPartInfo {
  id: string;
  name: string;
  description: string;
  funFact: string;
  oxygenated: boolean;
  color: string;
  glowColor: string;
}

interface InfoPanelProps {
  part: HeartPartInfo | null;
}

export default function InfoPanel({ part }: InfoPanelProps) {
  return (
    <AnimatePresence mode="wait">
      {part ? (
        <motion.div
          key={part.id}
          initial={{ opacity: 0, y: 15, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-sm"
        >
          <div
            className="p-4 rounded-xl border backdrop-blur-xl"
            style={{
              background: part.oxygenated
                ? 'linear-gradient(135deg, rgba(214, 40, 40, 0.08) 0%, rgba(30, 10, 10, 0.7) 100%)'
                : 'linear-gradient(135deg, rgba(69, 123, 157, 0.08) 0%, rgba(10, 20, 30, 0.7) 100%)',
              borderColor: part.oxygenated
                ? 'rgba(230, 57, 70, 0.2)'
                : 'rgba(69, 123, 157, 0.2)',
              boxShadow: `0 8px 32px ${part.oxygenated ? 'rgba(230, 57, 70, 0.08)' : 'rgba(69, 123, 157, 0.08)'}`,
            }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: part.color,
                  boxShadow: `0 0 10px ${part.glowColor}`,
                }}
              />
              <h3
                className="text-base font-bold tracking-tight font-mono"
                style={{ color: part.oxygenated ? '#ff6b6b' : '#64b5f6' }}
              >
                {part.name}
              </h3>
              <span
                className="ml-auto text-[9px] px-2 py-0.5 rounded-full font-semibold tracking-wider uppercase font-mono"
                style={{
                  backgroundColor: part.oxygenated
                    ? 'rgba(230, 57, 70, 0.12)'
                    : 'rgba(69, 123, 157, 0.12)',
                  color: part.oxygenated ? '#ff6b6b' : '#64b5f6',
                }}
              >
                {part.oxygenated ? '● O₂ Rich' : '● O₂ Poor'}
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">{part.description}</p>
            <div
              className="mt-2.5 pt-2.5 text-[10px] text-gray-500 italic"
              style={{
                borderTop: `1px solid ${part.oxygenated ? 'rgba(230, 57, 70, 0.1)' : 'rgba(69, 123, 157, 0.1)'}`,
              }}
            >
              💡 {part.funFact}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-sm h-[100px] flex items-center justify-center"
        >
          <p className="text-gray-600 text-xs text-center font-mono">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-700 mr-2 animate-pulse" />
            Hover over the heart to explore
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
