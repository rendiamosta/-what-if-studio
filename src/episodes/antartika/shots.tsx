import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, walkPose, kf, clamp, easeOut, easeIn, rnd, settle, camT,
  LOOKS, LEG_LEN, HEAD, joints, toWorld, reachAngle,
  Icefield, Penguin, Bunk, bunkSeat,
  AlarmClock, Bokeh, TitleCard, HudChip, FocusRings, Gauge, SchLabel, DrawOn, CountUp, SCH, Schematic, Arrow,
  Foreground, Glow, DuskSky, Sun, LightVeil, Shaft, ShotProps,
} from '../../engine';

// "Bagaimana jika kamu tinggal di Antartika selama 30 hari?" — thirteen shots on the icefield (the station in the
// polar day), the bunk hut, and the schematic. The power is the place: the sun never sets. Each shot is a pure
// function of its own clock t; the sun and the weather stay ours, the drifting snow carries every cut.

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;

/** hip point for a character whose feet stand at footY (world). */
const hip = (footY: number, scale: number) => ({ y: footY - LEG_LEN * scale });

// ---------- S1: wide, the station at golden hour; Pip walks in from the left ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 470], [len, 700]]);
  const pose = { ...walkPose(x, t * 0.55, 922, 0.92, { yaw: 0.55, look: 0.5, expr: 'happy' }, 1) };
  return (
    <g transform={camT(kf(t, [[0, 950], [len, 990]]), kf(t, [[0, 640], [len, 626]]), kf(t, [[0, 0.9], [len, 0.99]]))}>
      <Icefield t={t + 120} id="ice1" sunX={430} sunY={592} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.6} />
      <Foreground blur={10}>
        <path d="M -100 1080 L 260 1000 Q 420 1020 520 1080 Z" fill="#2A2044" />
      </Foreground>
    </g>
  );
};

// ---------- S2: medium, Pip stops against a gust; the wind carries the cut ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...hip(906, 1.06), x: 800, yaw: 0.35, look: 0.4, tilt: -3, armL: { a: 14, b: -8 }, armR: { a: 14, b: -8 } } },
    { f: 5, p: { tilt: 4, headTilt: 6, armL: { a: 34, b: 66 }, armR: { a: 30, b: 62 }, squash: 0.045, sway: 1.4 }, ease: easeOut },
    { f: 11, p: { tilt: -5, headTilt: -3, squash: 0 } },
    { f: 16, p: { tilt: 2, sway: 1 } },
  ]);
  return (
    <g transform={camT(800, kf(t, [[0, 642], [len, 634]]), kf(t, [[0, 1.62], [len, 1.7]]))}>
      <Icefield t={t + 60} id="ice2" sunX={1430} sunY={610} wind={1} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [12, 'neutral']]) }} rimId="rimR" shadow={0} />
      <HudChip f={t} label="HARI 1" icon="dot" />
      <Foreground blur={10}>
        <path d="M 1560 1080 L 1700 960 Q 1850 980 1980 1080 Z" fill="#241C38" />
      </Foreground>
    </g>
  );
};

// ---------- S3: macro insert, Pip's mitten pats a penguin in front of the crates ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const hand = { x: kf(t, [[0, 400], [9, 1314], [16, 1304], [len, 1312]]), y: kf(t, [[0, 660], [9, 828], [16, 838], [len, 830]]) };
  return (
    <g transform={camT(kf(t, [[0, 1420], [len, 1424]]), 812, kf(t, [[0, 2.8], [len, 2.9]]))}>
      <Icefield t={t + 210} id="ice3" sunX={700} sunY={520} />
      {/* the penguin in full view by the crates, head lifted toward the mitten */}
      <Penguin x={1330} y={948} s={0.92} mood="peek" facing={-1} t={t} />
      {/* his arm: reaching in from the top edge, the mitten down to the penguin's beak */}
      <g filter="url(#rimR)">
        <path d={`M ${hand.x - 330} ${hand.y - 420} Q ${hand.x - 190} ${hand.y - 160} ${hand.x - 8} ${hand.y + 6}`} stroke={PIP.line} strokeWidth={62} fill="none" strokeLinecap="round" />
        <path d={`M ${hand.x - 330} ${hand.y - 438} Q ${hand.x - 190} ${hand.y - 174} ${hand.x - 8} ${hand.y - 12}`} stroke={PIP.limb} strokeWidth={50} fill="none" strokeLinecap="round" />
        <g transform={`translate(${hand.x} ${hand.y}) rotate(150) scale(2.6)`}>
          <rect x={-4} y={10} width={8} height={24} rx={4} fill={PIP.hand} stroke={PIP.line} strokeWidth={2.4} />
          <path d="M -11 -2 Q -14 14 -6 18 L 7 18 Q 14 14 11 -2 Z" fill={PIP.hand} stroke={PIP.line} strokeWidth={2.6} strokeLinejoin="round" />
          <ellipse cx={-10} cy={6} rx={4.5} ry={7} fill={PIP.hand} stroke={PIP.line} strokeWidth={2.4} />
        </g>
      </g>
    </g>
  );
};

// ---------- S4: macro insert over a crate top: the alarm clock says 02:00, the sun blazing behind ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 540], [len, 528]]), kf(t, [[0, 1.02], [len, 1.1]]))}>
    <g filter="url(#blur6)">
      <DuskSky id="s4sky" x0={-400} y0={-400} w={2720} h={1100} horizonY={560} />
      <Sun x={520} y={470} r={130} t={t} />
      <Bokeh seed={5} x0={300} y0={300} w={1300} h={260} t={t} n={8} o={0.2} />
    </g>
    {/* the crate lid, seen from three-quarters above; plank lines run to the vanishing point */}
    <polygon points="0 620 1920 560 1920 1080 0 1080" fill="#6B544A" />
    <polygon points="0 620 1920 560 1920 596 0 656" fill="#8A6E5E" />
    <path d="M 0 620 L 1920 560" stroke="#FFD9A0" strokeWidth={5} opacity={0.55} />
    {[200, 480, 740, 980, 1240, 1520, 1760].map((bx, i) => (
      <path key={i} d={`M ${bx} 1074 L ${bx + (960 - bx) * 0.42} 596`} stroke="#4A3A36" strokeWidth={3.2} />
    ))}
    {/* frost edge ticks along the rim */}
    {Array.from({ length: 14 }).map((_, i) => (
      <circle key={`fr${i}`} cx={60 + i * 134} cy={618 - i * 4.2 + Math.sin(t / 40 + i) * 1} r={1.6 + rnd(9, i) * 1.6} fill="#EADDF2" opacity={0.5} />
    ))}
    <AlarmClock x={944} y={780} s={2.1} text="02:00" />
    <Foreground blur={10}>
      <path d="M -40 1080 L 200 780 Q 330 800 360 1080 Z" fill="#241C38" />
    </Foreground>
  </g>
);

// ---------- S5: medium, low angle: a snowball goes up where the sun still is ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...hip(908, 1.04), x: 820, yaw: 0.4, look: 0.7, armR: { a: 156, b: -20 }, armL: { a: 24, b: -10 }, headTilt: -6 } },
    { f: 6, p: { armR: { a: 168, b: -14 }, headTilt: -10 }, ease: easeOut },
    { f: 9, p: {} },
    { f: 13, p: { armR: { a: 58, b: 24 }, headTilt: 4, squash: -0.02 }, ease: easeOut },
  ]);
  const face = faceAt(t, [[0, 'happy'], [14, 'neutral']]);
  const hold = toWorld(pose, joints(pose).armR.end);
  const flown = t >= 10;
  const bx = flown ? kf(t, [[10, hold.x], [26, 1420]]) : hold.x;
  const by = flown ? kf(t, [[10, hold.y], [16, 330], [26, 470]]) : hold.y;
  return (
    <g transform={camT(960, 636, kf(t, [[0, 1.46], [len, 1.52]]))}>
      <Icefield t={t + 150} id="ice5" sunX={1240} sunY={592} sunR={150} />
      <Hero look={PIP} pose={{ ...pose, ...face, handR: flown ? 'open' : 'point' }} rimId="rimR" shadow={0} />
      {/* Mo at the right: he ducks in and out of frame */}
      <Hero look={MO} pose={{ ...basePose, ...hip(912, 0.94), x: 1180, yaw: -0.4, look: -0.7, tilt: -6, armL: { a: 130, b: 44 }, armR: { a: 20, b: -12 }, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
      {flown ? (
        <g>
          <circle cx={bx} cy={by} r={14} fill="#EDE7F4" />
          <circle cx={bx - 7} cy={by + 5} r={9} fill="#B9AECF" />
          <path d={`M ${bx - 18} ${by + 16} q 18 10 36 0`} stroke="#B9AECF" strokeWidth={3.4} fill="none" opacity={0.5} />
        </g>
      ) : null}
    </g>
  );
};

// ---------- S6: medium (tighter than S5), the snowball war at 23:58; the ball lands on Mo, puffs, gone ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { ...hip(910, 1.0), x: 750, yaw: 0.45, look: 0.8, armR: { a: 148, b: -16 }, armL: { a: -20, b: -60 }, headTilt: 4 } },
    { f: 8, p: { armR: { a: 62, b: 20 }, headTilt: -4 }, ease: easeOut },
  ]);
  const mo = poseAt(t, [
    { f: 0, p: { ...basePose, ...hip(912, 0.92), x: 1050, yaw: -0.45, look: -0.8, tilt: -8, armL: { a: 122, b: 50 }, armR: { a: 30, b: -10 }, headTilt: -6 } },
    { f: 10, p: { tilt: 2, headTilt: 3 } },
    { f: 21, p: { tilt: -4, headTilt: -8, look: 0.2 }, ease: easeOut },
    { f: 25, p: { tilt: 7, headTilt: 10, squash: 0.045 }, ease: easeOut },
    { f: 33, p: { tilt: -3, headTilt: -2, squash: 0 } },
  ]);
  const hold = toWorld(pip, joints(pip).armR.end);
  const flown = t >= 8;
  const hit = t >= 24;
  const bx = flown ? kf(t, [[8, hold.x], [24, 1095]]) : hold.x;
  const by = flown ? kf(t, [[8, hold.y], [16, 540], [24, 612]]) : hold.y;
  return (
    <g transform={camT(kf(t, [[0, 930], [len, 948]]), 616, kf(t, [[0, 1.56], [len, 1.62]]))}>
      <Icefield t={t + 90} id="ice6" sunX={1520} sunY={616} sunR={140} wind={0.8} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy'], [10, 'smug']]), handR: flown ? 'open' : 'point' }} rimId="rimR" shadow={0} />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'happy'], [12, 'smug'], [24, 'shock'], [34, 'smug']]) }} rimId="rimR" shadow={0.5} />
      {/* the ball in flight, then a snow puff where it lands on Mo - it never freezes on his face */}
      {flown && !hit ? (
        <g>
          <circle cx={bx} cy={by} r={13} fill="#EDE7F4" />
          <circle cx={bx + 6} cy={by + 6} r={8} fill="#B9AECF" />
        </g>
      ) : null}
      {hit && t < 48 ? (
        <g opacity={clamp(1 - (t - 24) / 22)}>
          {[[-1, 0], [1, 0], [0, -1], [-1, -1], [1, -1]].map(([dx, dy], i) => {
            const q = t - 24;
            return (
              <circle key={i} cx={1095 + dx * (8 + q * 4.5)} cy={612 + dy * (6 + q * 3.6) - q * 0.8} r={7 + q * 0.55 - i * 0.9} fill="#EDE7F4" opacity={0.8 - i * 0.08} />
            );
          })}
        </g>
      ) : null}
      <Penguin x={1330} y={948} s={0.8} mood="idle" facing={-1} t={t} />
      <HudChip f={t} label="PUKUL 23:58" icon="dot" />
      <Foreground blur={10}>
        <path d="M -60 1080 L 120 940 Q 300 950 420 1080 Z" fill="#241C38" />
      </Foreground>
    </g>
  );
};

// ---------- S7: close-up: the throw stops; Pip stares at a sky that will not darken ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.4 * (1 + 0.04 * clamp(t / len));
  const head = { x: 1140, y: 620 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.3, look: kf(t, [[0, 0.7], [8, 0.85]]), armL: { a: 20, b: -10 }, armR: { a: 16, b: -8 }, headTilt: kf(t, [[0, 8], [10, -2]]), ...faceAt(t, [[0, 'happy'], [9, 'tired']]) };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-560 -260) scale(2)">
          <Icefield t={t + 33} id="ice7" sunX={1300} sunY={560} wind={0.7} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.22} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      {/* focus rings, scaled down about the head so they stay an eye-blink of a size at zoom 3.4 */}
      <g transform={`translate(${head.x} ${head.y}) scale(0.45) translate(${-head.x} ${-head.y})`}>
        <FocusRings x={head.x} y={head.y} t={t - 10} r0={70} />
      </g>
      <HudChip f={t} label="PUKUL 03:12" icon="dot" />
    </g>
  );
};

// ---------- S8: the title, wide on the station; Pip plants a pennant on the drift ----------
const MOUND = { x: 940, top: 868 };
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...hip(MOUND.top, 1.04), x: MOUND.x, yaw: 0.15, look: 0.2, armR: { a: 60, b: 20 }, armL: { a: 20, b: -10 } } },
    { f: 10, p: { armR: { a: 96, b: 8 } }, ease: easeOut },
    { f: 16, p: { armR: { a: 84, b: 30 } } },
    { f: 24, p: { armL: { a: 150, b: 12 }, headTilt: -3 }, ease: easeOut },
  ]);
  const hold = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 930], [len, 944]]), kf(t, [[0, 600], [len, 588]]), kf(t, [[0, 0.92], [len, 1.0]]))}>
      <Icefield t={t} id="ice8" sunX={620} sunY={596} />
      {/* the mound he stands on, planted after every move */}
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.6} />
      {t >= 12 ? (
        <g>
          <path d={`M ${hold.x} ${hold.y} L ${hold.x + 4} ${hold.y + 44}`} stroke="#241C30" strokeWidth={5} strokeLinecap="round" />
          <path d={`M ${hold.x + 5} ${hold.y + 2} l 34 5 l -34 7 Z`} fill="#D9534F" transform={`rotate(${Math.sin(t / 3) * 7} ${hold.x + 5} ${hold.y + 4})`} />
        </g>
      ) : null}
      {/* the mound: drawn after so his feet sink into fresh snow */}
      <path d="M 820 918 Q 900 862 1040 912 Q 1080 920 1090 924 L 800 924 Z" fill="#A9A0C4" />
      <path d="M 820 918 Q 900 862 1040 912" stroke="#FFD9A0" strokeWidth={4} fill="none" opacity={0.4} />
      <TitleCard t={t} lines={['BAGAIMANA JIKA KAMU', 'DI ANTARTIKA 30 HARI?']} accent="30" accentT={40} size={84} y={168} />
      <Penguin x={700} y={948} s={0.75} mood="idle" facing={1} t={t} />
    </g>
  );
};

// ---------- S9: medium, action: Pip sleds down the drift, penguins tobogganing after him ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 640], [len, 1160]]);
  const y = kf(t, [[0, 872], [12, 862], [len, 918]]) + settle(t - 12, 3, 1.4, 9) * 0.6;
  const pose: Pose = {
    ...basePose, x, y, scale: 1.02, yaw: 0.85, facing: 1, tilt: -4, headTilt: 8,
    legL: { a: 80, b: -32 }, legR: { a: 72, b: -28 },
    armL: { a: -58, b: -44 }, armR: { a: -64, b: -50 },
    expr: 'happy', look: 0.5, sway: 1, blink: 0,
  };
  const spray = settle(t - 2, 1, 0.4, 4);
  return (
    <g transform={camT(x + 110, 636, kf(t, [[0, 1.5], [len, 1.56]]))}>
      <Icefield t={t + 40} id="ice9" sunX={1650} sunY={600} sunR={145} wind={0.9} />
      {/* the sledge under him: the deck, two runners, the rope at the back */}
      <g>
        <path d={`M ${x - 10} ${y + 12} L ${x + 96} ${y + 12} L ${x + 104} ${y - 6} L ${x - 6} ${y - 6} Z`} fill="#7A5C4E" />
        <path d={`M ${x - 10} ${y + 12} L ${x + 96} ${y + 12}`} stroke="#9A7A64" strokeWidth={4} />
        <path d={`M ${x - 16} ${y + 20} L ${x + 108} ${y + 20}`} stroke="#3A303E" strokeWidth={6} strokeLinecap="round" />
        <path d={`M ${x - 24} ${y + 16} q -18 6 -26 16`} stroke="#5E4A44" strokeWidth={4.4} fill="none" />
        {spray > 0 ? (
          <g opacity={clamp(spray)} style={{ mixBlendMode: 'screen' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <circle key={i} cx={x - 30 - i * 22} cy={y + 24 + Math.sin(t * 0.7 + i) * 10} r={5 + rnd(3, i) * 5} fill="#EDE7F4" opacity={0.7 - i * 0.1} />
            ))}
          </g>
        ) : null}
      </g>
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [22, 'dizzy']]) }} rimId="rimR" shadow={0} />
      <Penguin x={kf(t, [[0, 900], [len, 1330]])} y={944} s={0.75} mood="slide" facing={1} t={t} />
      <Penguin x={kf(t, [[0, 990], [len, 1400]])} y={952} s={0.62} mood="slide" facing={1} t={t} />
      <Foreground blur={10}>
        <path d="M 1350 1080 L 1600 950 Q 1800 970 1900 1080 Z" fill="#241C38" />
      </Foreground>
    </g>
  );
};

// ---------- S10: medium, the bunk hut: Pip on the bunk's edge, the sun blazing through the window ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const seat = bunkSeat();
  const pose = poseAt(t, [
    { f: 0, p: { x: seat.x, y: seat.y - 60, scale: 1.02, yaw: 0.62, facing: 1, tilt: 3, legL: { a: 84, b: -78 }, legR: { a: 76, b: -74 }, armL: { a: 18, b: -10 }, armR: { a: 26, b: -14 }, headTilt: 5, look: -0.3, sway: 0.8 } },
    { f: 14, p: { tilt: 5, headTilt: 8, look: -0.1 } },
    { f: 26, p: { tilt: 4, sway: 1 } },
  ]);
  const face = faceAt(t, [[0, 'tired'], [18, 'worried']]);
  const poseAll = { ...pose, ...face, blink: kf(t, [[0, 0], [10, 0], [12, 1], [14, 0]]) };
  const hp = toWorld(poseAll, { x: 0, y: HEAD.y * 0.62 });
  return (
    <g transform={camT(880, kf(t, [[0, 616], [len, 626]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Bunk t={t + 200} id="b10" veil={0.46} />
      <Hero look={PIP} pose={poseAll} rimId="rimR" shadow={0} />
      {/* the eye mask parked up on his forehead */}
      <g transform={`translate(${hp.x + 10} ${hp.y}) rotate(${(poseAll.headTilt ?? 0) * 0.8})`}>
        <path d="M -44 4 Q 0 -34 44 4 L 40 14 Q 0 -20 -40 14 Z" fill="#1D2033" stroke="#FFD39A" strokeWidth={2.6} opacity={0.95} />
        <rect x={-46} y={2} width={7} height={26} rx={3} fill="#1D2033" />
        <rect x={39} y={2} width={7} height={26} rx={3} fill="#1D2033" />
      </g>
      <Gauge x={1690} y={190} w={280} p={0.18} label="SISA ENERGI" />
    </g>
  );
};

// ---------- S11: schematic: the thermometer draws on, the dial sinks to the record ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const v = -89.2 * easeOut(clamp((t - 18) / 42));
  const shown = t >= 18;
  const lvl = shown ? 250 + (1 - Math.abs(v) / 89.2) * 356 : 250;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.04]])}) translate(-960 -540)`}>
      <Schematic t={t} id="sch11" />
      <SchLabel x={700} y={190} t={t - 2} text="REKOR DINGIN BUMI" size={50} />
      <SchLabel x={520} y={236} t={t - 8} text="CATATAN TERMOMETER DENGAN SAH" size={24} color={SCH.dim} />
      {/* the thermometer draws on: tube, bulb, then the mercury sinks */}
      <DrawOn d="M 826 236 L 826 620 Q 826 668 874 668 Q 922 668 922 620 L 922 236 Q 874 210 826 236 Z" t={t - 2} dur={14} width={4} />
      <circle cx={874} cy={668} r={40} fill={SCH.line} opacity={0.12} />
      <SchLabel x={470} y={300} t={t - 12} text="0" size={28} color={SCH.dim} anchor="middle" />
      <SchLabel x={470} y={440} t={t - 14} text="-50" size={28} color={SCH.dim} anchor="middle" />
      {shown ? <rect x={842} y={lvl} width={24} height={664 - lvl} rx={8} fill={SCH.live} style={{ filter: `drop-shadow(0 0 14px ${SCH.glow})` }} /> : null}
      <SchLabel x={1060} y={560} t={t - 16} text="-89,2" size={34} color={SCH.live} anchor="start" />
      <Arrow x0={960} y0={420} x1={1240} y1={420} t={t - 20} />
      <CountUp x={1520} y={470} t={t - 16} to={-89.2} dur={38} size={104} format={(q) => `${q.toFixed(1).replace('.', ',')}°C`} />
      <SchLabel x={1520} y={536} t={t - 20} text="VOSTOK · 21 JULI 1983" size={38} color={SCH.dim} />
      <Gauge x={1080} y={880} w={620} p={t >= 18 ? 1 : 0} label="PALING DINGIN YANG TERUKUR" danger={0.9} />
    </g>
  );
};

// ---------- S12: extreme close-up: "Itu nyata." — the record is real; the light starts to turn ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 6.6 * (1 + 0.04 * clamp(t / len));
  const head = { x: 960, y: 700 };
  const red = 0.4 * clamp(t / len);
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.1, look: -0.3, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, ...faceAt(t, [[0, 'worried'], [10, 'shock']]) };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-620 -520) scale(2.05)">
          <Icefield t={t + 300} id="ice12" sunX={1050} sunY={560} red={red} wind={1} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.2} />
      <Hero look={PIP} pose={pose} rimId={t > len * 0.55 ? 'rimRed' : 'rimR'} shadow={0} />
      {/* a frozen breath in front of the face */}
      {[0, 1, 2].map((i) => {
        const p = clamp(t / (14 + i * 5));
        if (p <= 0 || p >= 1) return null;
        return (
          <circle key={i} cx={920 + i * 26 + p * (40 + i * 10)} cy={430 - p * 90} r={7 + p * (13 - i * 3)} fill="#EADDF2" opacity={0.4 * (1 - p)} />
        );
      })}
    </g>
  );
};

// ---------- S13: wide, low angle: the sun sits on the horizon and still does not set; day 30 ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...hip(916, 1.18), x: 940, yaw: 0.1, look: -0.5, tilt: -3, armL: { a: 30, b: 40 }, armR: { a: 30, b: 40 }, headTilt: 3, sway: 1.2 } },
    { f: 18, p: { look: 0.4, headTilt: -2, tilt: 3 } },
    { f: 34, p: { look: -0.1, tilt: -2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 930], [len, 946]]), kf(t, [[0, 570], [len, 548]]), kf(t, [[0, 0.98], [len, 1.12]]))}>
      <Icefield t={t + 260} id="ice13" sunX={960} sunY={642} sunR={160} red={0.55} wind={1} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired'], [20, 'worried']]) }} rimId="rimRed" shadow={0.5} />
      <Penguin x={1160} y={946} s={0.9} mood="idle" facing={-1} t={t} />
      <HudChip x={130} y={150} f={t} label="HARI 30" icon="dot" />
      <Foreground blur={10}>
        <path d="M -60 1080 L 180 980 Q 400 1000 500 1080 Z" fill="#241C38" />
      </Foreground>
    </g>
  );
};
