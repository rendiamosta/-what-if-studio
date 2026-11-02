import React from 'react';
import { ShotProps, Icefield, Schematic, TitleCard } from '../../engine';

export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Icefield t={t} id="arctic1" sunX={960} sunY={200} />
    <TitleCard t={t} lines={['BAGAIMANA JIKA', 'KUTUB UTARA MENCAIR?']} size={60} y={540} />
  </g>
);

export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Icefield t={t} id="arctic2" sunX={960} sunY={200} />
    <text x="960" y="900" fill="white" fontSize="40" textAnchor="middle">Es mencair, panas diserap laut.</text>
  </g>
);

export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <Schematic t={t} id="sch1" />
);

export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Icefield t={t} id="arctic4" sunX={960} sunY={200} />
    <text x="960" y="900" fill="white" fontSize="40" textAnchor="middle">Siklus pemanasan global.</text>
  </g>
);