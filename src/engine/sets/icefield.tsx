import React from 'react';
import { rnd, easeOut, clamp, settle } from '../anim';
import { DuskSky, Sun } from '../kit';
import { Glow, LightVeil, Dust } from '../light';

// The icefield: an Antarctic station in the polar day. One flat plain of snow under a low sun that never sets: the
// same golden-hour light as every set, but hours round the clock. The station: a stilted hut with warm lit windows
// (the practical), a lit shed door, an antenna mast with a blinking beacon, a pennant rope between two poles (the
// string lights of this set), crates, barrels, a sledge, a wind sock, footprints and sastrugi. Penguins live here
// too: `Penguin` below. `red` turns the light for the turn shots (rimRed matches).
// Ground plane: characters stand with their feet around y 900-930 at world scale.

export const ICE = { hor: 640, sky: '#25184A', snow: '#8E86A8', snowDark: '#584F72', ice: '#A9A0C4', warm: '#FFB46A', glow: '#FFD39A' };

/** A penguin, ours: flat body with a cream belly, coral beak and feet, a warm edge on the lit side, contact shadow.
 *  x, y is the foot point. moods: `idle` (breathes, blinks), `waddle` (rocks and bobs; the caller moves it),
 *  `slide` (tobogganing on its belly, snow spray behind), `peek` (head high, for looking around crates). */
export const Penguin: React.FC<{ x: number; y: number; s?: number; mood?: 'idle' | 'waddle' | 'slide' | 'peek'; facing?: 1 | -1; t: number }> = ({
  x, y, s = 1, mood = 'idle', facing = 1, t,
}) => {
  const back = '#2A2338';
  const backShade = '#1E1A2E';
  const belly = '#F6EFE3';
  const beak = '#F28C6A';
  const flap = Math.sin(t / 5 + 2) * (mood === 'waddle' ? 12 : 5);
  const rock = mood === 'waddle' ? Math.sin(t / 6) * 10 : mood === 'idle' || mood === 'peek' ? Math.sin(t / 9) * 2.5 : 0;
  const bob = mood === 'waddle' ? Math.abs(Math.sin(t / 6)) * 5 : 0;
  const blink = mood !== 'slide' && Math.floor((t + 27) / 47) % 4 === 0 ? Math.min(1, ((t + 27) % 47) / 3) : 0;
  const body = (
    <g>
      {/* contact shadow */}
      {mood === 'slide' ? (
        <ellipse cx={-6} cy={-26 * s} rx={46 * s} ry={12 * s} fill="#000" opacity={0.22} />
      ) : (
        <ellipse cx={2} cy={0} rx={38 * s} ry={7 * s} fill="#000" opacity={0.26} />
      )}
      <g transform={mood === 'slide' ? `rotate(${facing * -78} 0 0)` : `rotate(${rock}) translate(0 ${-bob})`}>
        {/* the body and head, one dark silhouette */}
        <ellipse cx={0} cy={-46} rx={34} ry={48} fill={back} />
        <ellipse cx={4} cy={-46} rx={34} ry={48} fill={backShade} opacity={0.35} />
        <ellipse cx={10} cy={-40} rx={23} ry={41} fill={belly} />
        <ellipse cx={-22} cy={-48} rx={7} ry={46} fill={backShade} opacity={0.5} />
        {/* the flipper */}
        <ellipse cx={27} cy={-48} rx={6} ry={30} fill={back} transform={`rotate(${flap * 0.7} 27 -24)`} />
        {/* head */}
        <circle cx={4} cy={-90} r={22} fill={back} />
        {blink > 0 ? (
          <path d={`M 6 -96 q 9 ${5 * blink} 16 1`} stroke={belly} strokeWidth={3.4} fill="none" strokeLinecap="round" />
        ) : (
          <circle cx={15} cy={-93} r={4.2} fill="#14121C" />
        )}
        <circle cx={16} cy={-94} r={1.3} fill={belly} />
        {/* the beak in front of the face */}
        <path d="M 22 -88 L 46 -81 L 22 -74 Z" fill={beak} />
        <path d="M 22 -81 L 38 -80" stroke={backShade} strokeWidth={2} />
        {/* the feet */}
        {mood === 'slide' ? null : (
          <g>
            <ellipse cx={-12} cy={mood === 'waddle' ? (Math.sin(t / 6) > 0 ? -7 : -2) : -2} rx={12} ry={4.6} fill={beak} />
            <ellipse cx={13} cy={mood === 'waddle' ? (Math.sin(t / 6) > 0 ? -2 : -7) : -2} rx={12} ry={4.6} fill={beak} />
          </g>
        )}
        {/* a warm rim on the lit side (the sun is behind in most shots) */}
        <path d="M -28 -14 Q -40 -50 -26 -92" stroke={ICE.warm} strokeWidth={3} fill="none" opacity={0.4} strokeLinecap="round" />
      </g>
      {mood === 'slide'
        ? [0, 1, 2].map((i) => (
            <g key={i} opacity={0.75 - i * 0.2}>
              <path
                d={`M ${-52 * facing - i * 26 * facing} ${-8 - i * 5} q ${14 * facing} ${-14 - i * 3} ${28 * facing} ${6 + i * 3}`}
                stroke="#EAE4F2"
                strokeWidth={7 - i * 1.6}
                fill="none"
                strokeLinecap="round"
              />
            </g>
          ))
        : null}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${facing * s} ${s})`}>
      {body}
    </g>
  );
};

/** Frozen strokes and footprints across the plain; the low sun makes every crest warm. */
const Ground: React.FC<{ t: number }> = ({ t }) => {
  const waves: React.ReactNode[] = [];
  for (let i = 0; i < 16; i++) {
    const x = -300 + rnd(81, i) * 2400;
    const y = 700 + rnd(82, i) * 320;
    const w = 90 + rnd(83, i) * 180;
    waves.push(
      <path
        key={`sast${i}`}
        d={`M ${x} ${y} q ${w * 0.3} ${-5 - rnd(84, i) * 9} ${w * 0.55} ${-3} q ${w * 0.2} ${-2} ${w * 0.45} ${-6 - rnd(85, i) * 6}`}
        stroke={i % 3 ? '#6E6288' : '#C9B8D8'}
        strokeWidth={i % 3 ? 3 : 2.2}
        fill="none"
        opacity={0.35}
        strokeLinecap="round"
      />,
    );
  }
  const prints: React.ReactNode[] = [];
  for (let i = 0; i < 7; i++) {
    const x = 520 + i * 58;
    const y = 1006 - i * 12;
    const o = easeOut(1 - i / 8);
    for (const dx of [-13, 13]) {
      prints.push(<ellipse key={`p${i}${dx}`} cx={x + dx} cy={y + (dx > 0 ? 5 : 0)} rx={9} ry={4.4} fill="#5E5474" opacity={0.5 * o} />);
    }
  }
  return (
    <g>
      {/* the plain: lit warm near the sun, sinking dark toward us */}
      <rect x={-400} y={640} width={2720} height={800} fill={ICE.snow} />
      <ellipse cx={480} cy={700} rx={940} ry={150} fill="#C9A88E" opacity={0.4} style={{ mixBlendMode: 'screen' }} />
      <ellipse cx={1300} cy={760} rx={600} ry={110} fill="#FFD9A0" opacity={0.14} style={{ mixBlendMode: 'screen' }} />
      <rect x={-400} y={640} width={2720} height={800} fill="#20183A" opacity={0.34} />
      {waves}
      {prints}
    </g>
  );
};

export const Icefield: React.FC<{ t: number; id?: string; sunX?: number; sunY?: number; sunR?: number; red?: number; wind?: number }> = ({
  t, id = 'ice', sunX = 500, sunY = 600, sunR = 170, red = 0, wind = 0.6,
}) => {
  const R = 1 - red;
  // the pennant rope sags between two poles
  const sag = (x: number) => 700 + 92 * (1 - Math.pow((x - 1180) / 560, 2)) + Math.sin(t / 5 + x / 300) * 4 * wind;
  // snow streaks fly in the wind, right to left
  const streaks: React.ReactNode[] = [];
  for (let i = 0; i < 9; i++) {
    const sp = 3.4 + rnd(91, i) * 3;
    const x = -200 + (((rnd(92, i) * 2720 + 3000 - t * (sp + wind * 5)) % 2720) + 2720) % 2720;
    const y = 120 + rnd(93, i) * 620;
    const len = 50 + rnd(94, i) * 110;
    streaks.push(
      <path key={`st${i}`} d={`M ${x} ${y} l ${len} ${len * 0.07}`} stroke="#EADDF2" strokeWidth={2 + rnd(95, i) * 2} opacity={0.1 + rnd(96, i) * 0.13 * wind} strokeLinecap="round" />,
    );
  }
  // petrels over the ridge
  const birds: React.ReactNode[] = [];
  for (let i = 0; i < 3; i++) {
    const bx = ((t * (0.9 + i * 0.25) + i * 500) % 2400) - 200;
    const by = 300 + i * 42 + Math.sin(t / 19 + i) * 8;
    const fl = Math.sin(t / 2.8 + i * 1.4) * 6;
    birds.push(
      <path key={`b${i}`} d={`M ${bx - 12} ${by + fl * 0.4} Q ${bx - 5} ${by - 6 + fl} ${bx} ${by} Q ${bx + 5} ${by - 6 + fl} ${bx + 12} ${by + fl * 0.4}`} stroke="#2A2140" strokeWidth={3.4} fill="none" strokeLinecap="round" opacity={0.8} />,
    );
  }
  return (
    <g>
      <DuskSky id={`${id}sky`} horizonY={ICE.hor} red={red} />
      {/* clouds lit from below, drifting slowly */}
      <g filter="url(#blur6)" opacity={0.75 * R}>
        {[
          [340, 240, 380, 24],
          [1360, 200, 430, 28],
          [880, 330, 290, 19],
          [1650, 390, 250, 16],
        ].map(([cx, cy, rx, ry], i) => (
          <g key={i} transform={`translate(${((t * 0.18 * (i % 2 ? 1 : -1)) % 70)} 0)`}>
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#6A4776" opacity={0.6} />
            <ellipse cx={cx + 12} cy={cy + ry * 0.5} rx={rx * 0.88} ry={ry * 0.42} fill="#F2A878" opacity={0.5} />
          </g>
        ))}
      </g>
      <Sun x={sunX} y={sunY} r={sunR} t={t} red={red} />
      {birds}
      {/* the wind, streaks of hard-pack snow flying sideways */}
      {streaks}
      {/* distant ridges across the horizon */}
      <path d="M -400 640 L -120 590 L 140 620 L 400 566 L 640 612 L 920 580 L 1210 618 L 1490 584 L 1780 616 L 2100 590 L 2320 632 L 2320 700 L -400 700 Z" fill="#635680" opacity={0.9} />
      <path d="M -400 648 L -60 616 L 260 636 L 560 608 L 860 634 L 1180 610 L 1500 636 L 1820 612 L 2140 634 L 2320 624 L 2320 700 L -400 700 Z" fill="#7E6E9C" opacity={0.8} />
      <Ground t={t} />
      {/* the pennant rope between two poles */}
      <g>
        <path d={`M 600 936 L 588 806 M 618 936 L 606 806`} stroke="#241C30" strokeWidth={7} strokeLinecap="round" />
        <path d={`M 1746 930 L 1736 806 M 1764 930 L 1754 806`} stroke="#241C30" strokeWidth={7} strokeLinecap="round" />
        <path d={`M 597 812 Q 1180 ${sag(1180) + 92} 1751 812`} stroke="#241C30" strokeWidth={3.4} fill="none" />
        {Array.from({ length: 9 }).map((_, i) => {
          const x = 660 + i * 128;
          const y = sag(x) + 92;
          const wh = Math.sin(t / 4 + i) * (5 + 7 * wind);
          return (
            <g key={`fl${i}`}>
              <path d={`M ${x} ${y} l ${-16 + wh * 0.3} ${-7 + wh} l ${2} ${20} Z`} fill={i % 2 ? '#D9534F' : '#E9C46A'} transform={`translate(${wh * 0.4} 0)`} />
              <path d={`M ${x + 10 * (i % 2 ? 1 : 0.2)} ${y} l ${6} 2`} stroke="#FFE2B0" strokeWidth={1.6} opacity={0.6} />
            </g>
          );
        })}
      </g>
      {/* crates, barrels and the sledge in front of the shed */}
      <g>
        <ellipse cx={1130} cy={912} rx={150} ry={13} fill="#000" opacity={0.3} />
        {[0, 1].map((i) => (
          <g key={`cr${i}`}>
            <rect x={1054 + i * 86} y={852} width={82} height={62} fill="#6B544A" />
            <rect x={1054 + i * 86} y={852} width={82} height={10} fill="#8A6E5E" />
            <path d={`M ${1095 + i * 86} 852 l 0 62 M ${1054 + i * 86} 884 l 82 0`} stroke="#4A3A36" strokeWidth={3.4} />
            <path d={`M ${1054 + i * 86} 859 l 82 0`} stroke="#FFB46A" strokeWidth={2.2} opacity={0.42} />
          </g>
        ))}
        <g>
          <rect x={1236} y={816} width={76} height={56} fill="#5E4A44" />
          <rect x={1236} y={816} width={76} height={9} fill="#7E6454" />
          <rect x={1246} y={872} width={76} height={42} fill="#6B544A" />
          <path d={`M 1284 816 l 0 98 M 1236 858 l 76 0`} stroke="#4A3A36" strokeWidth={3.2} />
        </g>
        <g>
          <ellipse cx={992} cy={906} rx={26} ry={9} fill="#000" opacity={0.3} />
          <rect x={968} y={842} width={48} height={62} rx={8} fill="#8A4A42" />
          <rect x={968} y={856} width={48} height={7} fill="#6E3830" />
          <rect x={968} y={842} width={10} height={62} rx={5} fill="#A05A4E" />
        </g>
        {/* the sledge */}
        <g>
          <ellipse cx={850} cy={922} rx={90} ry={9} fill="#000" opacity={0.28} />
          <path d={`M 782 908 L 908 908 L 916 886 L 794 886 Z`} fill="#6B544A" />
          <path d={`M 782 908 L 908 908`} stroke="#8A6E5E" strokeWidth={4} />
          <path d={`M 788 916 L 916 916`} stroke="#3A303E" strokeWidth={5} strokeLinecap="round" />
          <path d={`M 800 910 q -22 4 -30 12`} stroke="#5E4A44" strokeWidth={4} fill="none" />
          <path d={`M 900 916 q 26 -2 42 6`} stroke="#5E4A44" strokeWidth={4} fill="none" opacity={0.8} />
        </g>
      </g>
      {/* the wind sock on its pole, pointing the way the streaks fly */}
      <g>
        <ellipse cx={562} cy={910} rx={12} ry={5} fill="#000" opacity={0.3} />
        <path d={`M 562 908 L 562 782`} stroke="#241C30" strokeWidth={7} strokeLinecap="round" />
        <g transform={`translate(562 786) rotate(${-8 + Math.sin(t / 4) * (6 + 8 * wind)})`}>
          <path d={`M 0 -10 L 86 ${-13 - Math.sin(t / 2.6) * 5} L 86 ${4 - Math.sin(t / 2.6) * 4} L 0 12 Z`} fill="#E98A56" />
          <path d={`M 0 -10 L 26 ${-10 - Math.sin(t / 2.6) * 3} L 26 ${8} L 0 12 Z`} fill="#C05A3A" />
          <path d={`M 0 0 L 82 ${-4 - Math.sin(t / 2.6) * 4}`} stroke="#FFD39A" strokeWidth={2} opacity={0.5} />
        </g>
      </g>
      {/* the hut on its stilts: the big lit window is the set's warm light */}
      <g>
        <ellipse cx={1290} cy={908} rx={190} ry={15} fill="#000" opacity={0.34} />
        {/* snow skirt and stilts */}
        <path d="M 1130 894 q 60 -34 160 -30 q 110 4 150 30 L 1408 894 L 1130 894 Z" fill="#9A90B8" />
        {[[1204, 0], [1290, 0], [1378, 0]].map(([x], i) => (
          <path key={`lg${i}`} d={`M ${x - 12} 856 L ${x - 8} 904 L ${x + 8} 904 L ${x + 12} 856 Z`} fill="#2A2434" />
        ))}
        <path d={`M 1194 876 l 96 26`} stroke="#241E30" strokeWidth={4} />
        {/* the cabin body */}
        <rect x={1160} y={656} width={264} height={130} rx={6} fill="#4A3E52" />
        <rect x={1160} y={756} width={264} height={30} fill="#3A3044" />
        <rect x={1160} y={656} width={264} height={10} rx={5} fill="#5E4E64" />
        {/* the roof: snow-packed, ridge, a weather vane with a flag */}
        <path d="M 1136 662 L 1292 616 L 1448 662 Z" fill="#6E5E7E" />
        <path d="M 1136 662 L 1292 616 L 1448 662 Z" fill="#C9B8D8" opacity={0.35} />
        <path d="M 1150 654 L 1292 610 L 1436 654" stroke="#8A7898" strokeWidth={5} fill="none" />
        <path d={`M 1292 640 L 1136 662`} stroke="#FFD39A" strokeWidth={3} opacity={0.5 * R} />
        <rect x={1334} y={668} width={64} height={40} fill="#3A3044" stroke="#2A2434" strokeWidth={4} />
        <path d="M 1250 618 L 1250 588" stroke="#241C30" strokeWidth={5} strokeLinecap="round" />
        <path d="M 1250 588 l 30 6 l -30 6 Z" fill="#D9534F" transform={`rotate(${Math.sin(t / 3) * 8 + 180} 1250 592)`} />
        {/* the big lit window */}
        <rect x={1198} y={688} width={92} height={72} rx={4} fill="#2A2434" />
        <rect x={1206} y={696} width={76} height={56} fill="#FFD9A0" />
        <path d={`M 1206 696 l 76 56 M 1282 696 l -76 56`} stroke="#2A2434" strokeWidth={5} />
        <Glow x={1246} y={724} r={300} o={0.5} />
        {/* the door */}
        <rect x={1312} y={702} width={46} height={84} fill="#332A3E" stroke="#292233" strokeWidth={3} />
        <circle cx={1350} cy={746} r={4} fill="#E9C46A" />
        {/* the small far window, cooler */}
        <rect x={1372} y={700} width={40} height={32} rx={3} fill="#241E30" />
        <rect x={1378} y={706} width={28} height={20} fill="#9FC0FF" opacity={0.7} />
        {/* an antenna wire to the mast */}
        <path d={`M 1426 672 Q 1470 640 1496 500`} stroke="#241C30" strokeWidth={2.4} fill="none" />
        {/* puff of warm air from the vent */}
        {[0, 1].map((i) => (
          <path key={`vem${i}`} d={`M ${1400 + i * 10} ${682 - i * 8} q ${10 + Math.sin(t / 6 + i) * 6} ${-14} ${2} ${-26} q ${-8} ${-10} ${16 - Math.sin(t / 7) * 4} ${-18}`} stroke="#C9B8D8" strokeWidth={5} fill="none" opacity={0.3} strokeLinecap="round" />
        ))}
      </g>
      {/* the shed, its door ajar with light spilling out */}
      <g>
        <ellipse cx={1638} cy={884} rx={140} ry={12} fill="#000" opacity={0.32} />
        <path d="M 1556 884 L 1556 706 L 1716 706 L 1716 884 Z" fill="#3E344A" />
        <path d="M 1544 712 L 1636 668 L 1728 712 Q 1636 742 1544 712 Z" fill="#5E4E64" />
        <path d="M 1544 712 L 1728 712" stroke="#8A7898" strokeWidth={4} />
        <rect x={1596} y={742} width={62} height={142} fill="#FFD9A0" opacity={0.85} />
        <rect x={1596} y={742} width={62} height={142} fill="none" stroke="#2A2434" strokeWidth={5} />
        <path d={`M 1658 742 l 58 120 L 1716 884`} fill="#241E30" opacity={0.9} />
        <Glow x={1628} y={810} r={260} o={0.45} />
        {/* an antenna dish on the shed's wall */}
        <g transform={`translate(1690 760) rotate(${-14 + Math.sin(t / 9) * 5})`}>
          <path d="M -18 -28 Q 6 -30 18 -6 Q 8 22 -16 18 Z" fill="#9A90B8" stroke="#6E6288" strokeWidth={3} />
          <path d="M 0 -4 L 0 26" stroke="#6E6288" strokeWidth={4} />
        </g>
      </g>
      {/* the antenna mast with its blinking beacon */}
      <g>
        <path d="M 1500 906 L 1500 470" stroke="#241C30" strokeWidth={9} strokeLinecap="round" />
        {[[1336, 900], [1664, 896], [1500, 906]].map(([gx, gy], i) => (
          <path key={`gy${i}`} d={`M 1500 ${500 - i * 6} Q ${180 + i} ${gy - 60} ${gx} ${gy}`} stroke="#241C30" strokeWidth={2.2} fill="none" opacity={0.7} />
        ))}
        <rect x={1470} y={700} width={60} height={16} rx={4} fill="#3A3044" />
        <path d="M 1472 708 L 1528 708" stroke="#FFD39A" strokeWidth={2.4} opacity={0.5 * R} />
        <g transform={`translate(1502 648) rotate(8)`}>
          <path d="M -16 -20 Q 2 -24 14 -8 Q 6 16 -14 14 Z" fill="#9A90B8" stroke="#6E6288" strokeWidth={3} />
        </g>
        {(() => {
          const on = Math.floor((t + 60) / 26) % 2 === 0;
          return (
            <g>
              <circle cx={1500} cy={462} r={7} fill={on ? '#FF4A4A' : '#5A2028'} />
              {on ? <Glow x={1500} y={462} r={54} kind="red" o={0.8} /> : null}
            </g>
          );
        })()}
      </g>
      {/* dunes of snow drifting off the hut, the foreground shadow line */}
      <path d="M 1120 922 q 80 -18 180 -12" stroke="#B8AECF" strokeWidth={7} fill="none" opacity={0.6} strokeLinecap="round" />
      <ellipse cx={880} cy={936} rx={240} ry={26} fill="#3A3052" opacity={0.5} />
      {PENGUINS_PROP(t)}
      {/* a veil so the mid-tones sink; holes for the sun and the two warm lights */}
      <LightVeil
        id={`${id}veil`}
        lights={[
          [sunX, sunY, sunR * 4.6],
          [1246, 724, 330],
          [1628, 810, 240],
        ]}
        o={0.42}
      />
      <Glow x={sunX} y={sunY} r={sunR * 5} o={0.35} />
      <Glow x={1246} y={724} r={280} o={0.4} />
      <Dust t={t} seed={17} x0={700} y0={520} w={1300} h={420} n={26} o={0.4} />
      {red > 0 ? <rect x={-400} y={-400} width={2720} height={1900} fill="#16000A" opacity={0.36 * red} /> : null}
    </g>
  );
};

/** Two residents by the crates: one waddling a short beat, one tobogganing in from the right. Drawn inside the set so
 *  every shot that shows the station sees them; legs and contact shadows included. */
const PENGUINS_PROP = (t: number): React.ReactNode => {
  const wx = 1140 + Math.sin(t / 26) * 46;
  return (
    <g>
      <Penguin x={wx} y={946} s={0.86} mood="waddle" facing={-1} t={t} />
      <Penguin x={960} y={940} s={0.7} mood="idle" facing={1} t={t} />
    </g>
  );
};
