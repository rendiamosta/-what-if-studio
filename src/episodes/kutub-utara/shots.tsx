import React from 'react';
import { ShotProps, Hero, Icefield, LOOKS, kf, poseAt, basePose, hip, faceAt, clamp } from '../../engine';

const PIP = LOOKS.pipHood;

export const S1: React.FC<ShotProps> = ({ t, len }) => {
  // Kamera bergerak perlahan melintasi pemandangan kutub
  const camX = kf(t, [[0, 960], [len, 1920]]);
  
  // Pip berjalan melintasi perubahan lingkungan
  const progress = t / len;
  const pose = poseAt(t, [
    { f: 0, p: { ...hip(920, 1), x: 400, yaw: 0.2, look: 0.3 } },
    { f: len, p: { x: 2500 } }
  ]);

  // Efek lingkungan berdasarkan waktu (mencair)
  const melt = clamp(progress * 2);
  const red = clamp((progress - 0.5) * 2); // Langit berubah merah di akhir

  return (
    <g transform={`translate(${-camX + 960} 0)`}>
      <Icefield t={t} id="arctic-long" sunX={960} sunY={200} melt={melt > 0.5} red={red} />
      
      {/* Pip */}
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [1000, 'worried'], [2500, 'shock']]) }} rimId="rimR" shadow={0.5} />
      
      {/* Visual Elemen tambahan untuk menunjukkan dampak */}
      {progress > 0.3 && (
        <path d="M 1000 900 L 2000 850 L 2000 1080 L 1000 1080 Z" fill="#1a3a5a" opacity={melt * 0.5} />
      )}
      
      <text x={camX} y={100} fill="white" fontSize="60" textAnchor="middle" style={{ fontFamily: 'sans-serif' }}>
        {t < 600 ? "Kutub Utara" : t < 1500 ? "Efek Albedo" : t < 2400 ? "Bom Waktu Metana" : "Peringatan Global"}
      </text>
    </g>
  );
};