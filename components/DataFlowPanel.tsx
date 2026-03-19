'use client';

import { useEffect, useState, useRef } from 'react';

interface DataFlowPanelProps {
  bpm: number;
}

interface DataRow {
  id: string;
  addr: string;
  timestamp: string;
  bpmVal: number;
  status: string;
}

function randomHex(len: number) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join('');
}

function generateRow(bpm: number): DataRow {
  const statuses = ['OK', 'OK', 'OK', 'OK', 'SYNC', 'PASS', 'CHK'];
  return {
    id: crypto.randomUUID().slice(0, 6),
    addr: `0x${randomHex(4)}:${randomHex(4)}`,
    timestamp: `D0:${randomHex(8)}`,
    bpmVal: bpm + Math.floor(Math.random() * 5 - 2),
    status: statuses[Math.floor(Math.random() * statuses.length)],
  };
}

export default function DataFlowPanel({ bpm }: DataFlowPanelProps) {
  const [rows, setRows] = useState<DataRow[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial rows
    const initial = Array.from({ length: 6 }, () => generateRow(bpm));
    setRows(initial);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRows((prev) => {
        const next = [...prev, generateRow(bpm)];
        if (next.length > 12) next.shift();
        return next;
      });
    }, (60 / bpm) * 1000);

    return () => clearInterval(interval);
  }, [bpm]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [rows]);

  return (
    <div
      className="rounded-lg border p-3"
      style={{
        background: 'rgba(0, 10, 20, 0.85)',
        borderColor: 'rgba(0, 255, 136, 0.12)',
        backdropFilter: 'blur(10px)',
        maxWidth: 320,
      }}
    >
      <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#00ff88' }}>
        ▸ Data Flow Analysis
      </div>
      <div
        ref={containerRef}
        className="overflow-hidden"
        style={{ maxHeight: 120 }}
      >
        {rows.map((row) => (
          <div
            key={row.id}
            className="text-[9px] font-mono flex gap-3 py-[1px] items-center"
            style={{ color: 'rgba(0, 255, 136, 0.6)' }}
          >
            <span className="text-gray-600">{row.timestamp}</span>
            <span style={{ color: 'rgba(100, 200, 255, 0.5)' }}>{row.addr}</span>
            <span className="tabular-nums">{row.bpmVal} BPM</span>
            <span style={{ color: row.status === 'OK' ? 'rgba(0,255,136,0.4)' : 'rgba(255,200,0,0.5)' }}>{row.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
