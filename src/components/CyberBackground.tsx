import { useMemo } from 'react';

export default function CyberBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 15}s`,
        duration: `${10 + Math.random() * 20}s`,
        size: Math.random() > 0.7 ? 3 : 2,
        opacity: 0.2 + Math.random() * 0.4,
        color: ['#00F0FF', '#9D00FF', '#FF2BD6', '#00FFA3'][Math.floor(Math.random() * 4)],
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial gradient overlays */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.03) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(157, 0, 255, 0.04) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 43, 214, 0.015) 0%, transparent 60%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
          }}
        />
      ))}

      {/* Horizontal neon accent lines */}
      <div className="absolute top-[20%] left-0 right-0 neon-line" />
      <div className="absolute top-[80%] left-0 right-0 neon-line" style={{ opacity: 0.2 }} />
    </div>
  );
}
