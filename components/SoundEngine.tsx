'use client';

import { useCallback, useRef, useState } from 'react';

// Web Audio API sound engine — no external files needed
export function useSoundEngine() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(false);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playHeartbeat = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Lub
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(50, now);
    osc1.frequency.exponentialRampToValueAtTime(30, now + 0.12);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc1.connect(gain1).connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.15);

    // Dub (slightly delayed)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(40, now + 0.18);
    osc2.frequency.exponentialRampToValueAtTime(25, now + 0.32);
    gain2.gain.setValueAtTime(0.2, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 0.35);
  }, [enabled, getCtx]);

  const playHoverBlip = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.06);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }, [enabled, getCtx]);

  const playModeSwitch = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }, [enabled, getCtx]);

  const playPatchSuccess = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    const now = ctx.currentTime;
    [400, 600, 800].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.15);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.15);
    });
  }, [enabled, getCtx]);

  const toggle = useCallback(() => {
    setEnabled((prev) => !prev);
    // Init audio context on first enable (user gesture required)
    if (!enabled) getCtx();
  }, [enabled, getCtx]);

  return { enabled, toggle, playHeartbeat, playHoverBlip, playModeSwitch, playPatchSuccess };
}

// Sound toggle button component
export function SoundToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-[10px] font-mono uppercase tracking-widest transition-all duration-200"
      style={{
        borderColor: enabled ? 'rgba(0, 255, 136, 0.4)' : 'rgba(255, 255, 255, 0.15)',
        color: enabled ? '#00ff88' : 'rgba(255,255,255,0.4)',
        backgroundColor: enabled ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255,255,255,0.03)',
      }}
    >
      <span style={{ fontSize: '14px' }}>{enabled ? '🔊' : '🔇'}</span>
      <span>SFX {enabled ? 'ON' : 'OFF'}</span>
    </button>
  );
}
