import React from 'react';
import { makeRoom, Box, pts, type V3 } from '../room';
import { RoomShell, BackWindow, FloorShadow, stand } from '../furnish';
import { Glow, LightVeil, Dust } from '../light';
import { Shaft } from '../kit';
import { AlarmClock, WallCalendar, Mug } from '../props';
import { rnd } from '../anim';

// The bunk hut: a station bedroom in the polar day. A window on the back wall with the low sun still in it (the
// practical), a bunk bed on the left with a sleeping bag over the top rail, a crate with the bedside clock on it
// (23:40 - long past waking up time and it is still bright), a wall calendar, a coat on a hook, boots on the floor.
// A bunk of cold necessity: Pip's eye mask sits up on his forehead.
// `BUNK` holds the room; the bunk's seat point (for someone sitting on the bottom bunk's edge) is bunkSeat().

export const BUNK = makeRoom({ x: 920, y: 500 }, { x0: 470, x1: 1400, y0: 340, y1: 745 }, 3.4);

/** Where the hips sit on the bottom bunk's front edge (u mid-bunk, w front). */
export const bunkSeat = () => BUNK.P(0.16, 0.545, 0.64);

export const Bunk: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'bunk', veil = 0.46 }) => {
  const r = BUNK;
  const { P, Q } = r;
  const win = { x0: 970, x1: 1245, y0: 380, y1: 620 };
  const sun = { x: 1170, y: 588 };
  // the mattress and bedding hang over the bunk's front edge
  const drape = Q([[0.02, 0.6, 0.64], [0.27, 0.6, 0.64], [0.26, 0.86, 0.6], [0.04, 0.86, 0.6]]);
  return (
    <g>
      <RoomShell r={r} id={id} floor="boards" />
      {/* the window: the sun is still up, a shaft falls across the floor; beyond it, empty ice */}
      <BackWindow r={r} id={`${id}win`} t={t} x0={win.x0} x1={win.x1} y0={win.y0} y1={win.y1} sun={sun} cols={2} curtains={false} far="ridge" />
      <Shaft d={`M ${win.x0 + 30} ${win.y1} L ${win.x1 - 30} ${win.y1} L ${P(0.94, 1, 0.85).x} ${P(0.94, 1, 0.85).y} L ${P(0.44, 1, 0.85).x} ${P(0.44, 1, 0.85).y} Z`} o={0.34} />
      {/* a wall calendar: 21 of the 30 days crossed off */}
      <WallCalendar x={766} y={392} w={196} crossed={21} />
      {/* the coat on its hook, left of the calendar */}
      <g>
        <circle cx={492} cy={430} r={5} fill="#8A7A6C" />
        <path d={`M 492 434 L 492 452`} stroke="#241E30" strokeWidth={5} />
        <path d={`M 474 452 L 510 448 L 514 560 Q 494 572 468 564 Z`} fill="#332A3E" />
        <path d={`M 474 452 Q 492 470 510 448`} stroke="#241E30" strokeWidth={5} fill="none" />
        <path d={`M 480 560 L 478 584 M 504 556 L 508 580`} stroke="#241E30" strokeWidth={5} strokeLinecap="round" />
      </g>
      {/* the bunk: posts, the bottom bunk, the top bunk, a ladder */}
      <FloorShadow r={r} u={[0.0, 0.3]} w={[0.28, 0.68]} />
      {([[0.03, 0.32], [0.25, 0.32], [0.03, 0.62], [0.25, 0.62]] as [number, number][]).map(([u, w], i) => (
        <Box key={`po${i}`} r={r} u={[u, u + 0.014]} v={[0.1, 1]} w={[w, w + 0.03]} front="#2A2434" top="#332A3E" side="#221C2C" />
      ))}
      {/* bottom bunk: frame, mattress, pillow, the reading lamp's glow smothered by daylight */}
      <Box r={r} u={[0.02, 0.262]} v={[0.5, 0.545]} w={[0.3, 0.66]} front="#5B4038" top="#7A5747" side="#3A2826" />
      <Box r={r} u={[0.03, 0.252]} v={[0.455, 0.5]} w={[0.305, 0.655]} front="#B9A878" top={SHEETS} side="#94836A" rim />
      <polygon points={drape} fill="#B9A878" />
      <polygon points={drape} fill="#000" opacity={0.16} />
      {[0.3, 0.45, 0.6].map((k) => (
        <path key={`dr${k}`} d={`M ${P(0.03 + k * 0.23, 0.6, 0.64).x} ${P(0.03 + k * 0.23, 0.6, 0.64).y} L ${P(0.03 + k * 0.23, 0.86, 0.6).x} ${P(0.03 + k * 0.23, 0.86, 0.6).y}`} stroke="#8E7D64" strokeWidth={3.4} />
      ))}
      <polygon points={Q([[0.06, 0.545, 0.62], [0.16, 0.545, 0.62], [0.16, 0.5, 0.62], [0.06, 0.5, 0.62]])} fill="#E8E0CE" />
      {/* top bunk: frame and a sleeping bag rolled over its rail */}
      <Box r={r} u={[0.02, 0.262]} v={[0.17, 0.215]} w={[0.3, 0.66]} front="#5B4038" top="#7A5747" side="#3A2826" />
      <g>
        <polygon points={Q([[0.04, 0.172, 0.34], [0.2, 0.168, 0.34], [0.21, 0.1, 0.34], [0.05, 0.104, 0.34]])} fill="#3E5A6E" />
        <ellipse cx={P(0.12, 0.14, 0.345).x} cy={P(0.12, 0.14, 0.345).y} rx={54} ry={13} fill="#4E6E84" />
        {[0.5, 0.8].map((k, i) => (
          <path key={i} d={`M ${P(0.12 * (0.4 + k), 0.115, 0.34).x} ${P(0.12 * (0.4 + k), 0.115, 0.34).y} l 4 14 M ${P(0.12 * (0.4 + k), 0.16, 0.34).x} ${P(0.12 * (0.4 + k), 0.16, 0.34).y} l -2 -12`} stroke="#2E4454" strokeWidth={3} />
        ))}
      </g>
      {/* the ladder */}
      {[0.1, 0.18, 0.26].map((v, i) => (
        <path key={`lr${i}`} d={`M ${P(0.31, 0.12 + v * 0.9, 0.45).x} ${P(0.31, 0.12 + v * 0.9, 0.45).y} L ${P(0.31, 0.16 + v * 0.9, 0.62).x} ${P(0.31, 0.16 + v * 0.9, 0.62).y}`} stroke="#4A3A44" strokeWidth={5.4} strokeLinecap="round" />
      ))}
      <path d={`M ${P(0.335, 0.1, 0.44).x} ${P(0.335, 0.1, 0.44).y} L ${P(0.335, 1, 0.44).x} ${P(0.335, 1, 0.44).y}`} stroke="#4A3A44" strokeWidth={6} />
      <path d={`M ${P(0.295, 0.1, 0.66).x} ${P(0.295, 0.1, 0.66).y} L ${P(0.295, 1, 0.66).x} ${P(0.295, 1, 0.66).y}`} stroke="#3A2A34" strokeWidth={6} />
      {/* the crate beside the bunk: the bedside clock and a mug on it */}
      <Box r={r} u={[0.3, 0.38]} v={[0.8, 1]} w={[0.42, 0.56]} front="#5B4038" top="#7A5747" side="#3A2826" />
      {(() => {
        const top = P(0.345, 0.795, 0.52);
        return (
          <g>
            {/* the mug first, parked well left of the display so it never covers the digits */}
            <Mug x={top.x - 100} y={top.y - 4} rot={-8} steam={0.4} f={t} />
            <AlarmClock x={top.x + 8} y={top.y - 2} s={0.62} text="23:40" />
          </g>
        );
      })()}
      {/* boots and a bag on the floor, a rug under them */}
      <ellipse cx={P(0.55, 1, 0.8).x} cy={P(0.55, 1, 0.8).y} rx={150} ry={34} fill="#4A3040" opacity={0.6} />
      {[[0, 0], [46, -8]].map(([dx, dy], i) => (
        <g key={`bo${i}`} transform={`translate(${P(0.56 + i * 0.03, 1, 0.8).x + dx} ${P(0.56 + i * 0.03, 1, 0.8).y + dy}) rotate(${(i ? 14 : -6)})`}>
          <path d="M 0 -2 L 0 -22 L 14 -28 L 20 -20 L 12 -14 L 26 -4 Z" fill="#2A2434" />
          <path d="M 12 -20 L 12 -2" stroke="#1E1A28" strokeWidth={4} />
        </g>
      ))}
      <path d={`M ${P(0.62, 1, 0.9).x} ${P(0.62, 1, 0.9).y} L ${P(0.62, 1, 0.9).x - 40} ${P(0.62, 1, 0.9).y}`} stroke="#E9C46A" strokeWidth={8} strokeLinecap="round" transform={`rotate(${Math.sin(t / 7) * 4} ${P(0.62, 1, 0.9).x} ${P(0.62, 1, 0.9).y})`} />
      {/* finishes: the veil keeps the room's mid-tones down, holes at the window */}
      <LightVeil id={`${id}veil`} lights={[[sun.x + 20, sun.y + 10, 360], [1108, 500, 220]]} o={veil} />
      <Glow x={sun.x} y={sun.y} r={260} o={0.4} />
      <Dust t={t} seed={23} x0={win.x0} y0={win.y1 - 90} w={win.x1 - win.x0} h={330} n={20} o={0.5} />
    </g>
  );
};

const SHEETS = '#E8E0CE';
