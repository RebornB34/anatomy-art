'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface BpmControllerProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
}

export default function BpmController({ bpm, onBpmChange }: BpmControllerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mini ECG waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    let offset = 0;
    const speed = bpm / 60; // beats per second

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 4;
      ctx.beginPath();

      for (let x = 0; x < w; x++) {
        const t = (x / w) * 4 + offset;
        const cycle = t % 1;
        let y = h / 2;

        if (cycle > 0.35 && cycle < 0.4) {
          y = h / 2 - 6; // small P wave
        } else if (cycle > 0.42 && cycle < 0.44) {
          y = h / 2 + 8; // Q dip
        } else if (cycle > 0.44 && cycle < 0.48) {
          y = h / 2 - (h * 0.4); // R peak (tall spike)
        } else if (cycle > 0.48 && cycle < 0.5) {
          y = h / 2 + 10; // S dip
        } else if (cycle > 0.55 && cycle < 0.65) {
          y = h / 2 - 5; // T wave
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      offset += 0.008 * speed;
      requestAnimationFrame(draw);
    }

    const frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [bpm]);

  return (
    <div
      className="flex flex-col items-end gap-2 p-3 rounded-lg border"
      style={{
        background: 'rgba(0, 10, 20, 0.8)',
        borderColor: 'rgba(0, 255, 136, 0.15)',
        backdropFilter: 'blur(10px)',
        minWidth: 160,
      }}
    >
      {/* BPM Display */}
      <div className="flex items-baseline gap-1.5 w-full justify-end">
        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Live BPM:</span>
        <motion.span
          key={bpm}
          initial={{ scale: 1.2, color: '#ff4444' }}
          animate={{ scale: 1, color: '#00ff88' }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold font-mono tabular-nums"
          style={{ textShadow: '0 0 15px rgba(0, 255, 136, 0.5)' }}
        >
          {bpm}
        </motion.span>
        <span className="text-xs text-gray-500 font-mono">BPM</span>
      </div>

      {/* ECG Waveform */}
      <canvas
        ref={canvasRef}
        width={140}
        height={30}
        className="w-full rounded"
        style={{ background: 'rgba(0, 20, 10, 0.3)' }}
      />

      {/* Slider */}
      <div className="w-full flex items-center gap-2">
        <span className="text-[9px] text-gray-600 font-mono">60</span>
        <input
          type="range"
          min={60}
          max={180}
          value={bpm}
          onChange={(e) => onBpmChange(Number(e.target.value))}
          className="flex-1 h-1 appearance-none rounded-full cursor-pointer"
          style={{
            background: `linear-gradient(90deg, #00ff88 ${((bpm - 60) / 120) * 100}%, rgba(255,255,255,0.1) ${((bpm - 60) / 120) * 100}%)`,
            accentColor: '#00ff88',
          }}
        />
        <span className="text-[9px] text-gray-600 font-mono">180</span>
      </div>

      {/* Status label */}
      <div className="text-[9px] font-mono uppercase tracking-widest w-full text-right" style={{
        color: bpm < 100 ? '#00ff88' : bpm < 140 ? '#ffaa00' : '#ff4444',
      }}>
        {bpm < 60 ? '● BRADYCARDIA' : bpm < 100 ? '● NORMAL' : bpm < 140 ? '● ELEVATED' : '● TACHYCARDIA'}
      </div>
    </div>
  );
}
