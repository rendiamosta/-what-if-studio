import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13 } from './shots';

// The power of this episode is not a button - it is the place: the polar day. The genre's power chip is carried by
// the HARI / PUKUL readouts drawn inside the shots; the sun never sets, so there is no on/off look to grade in -
// the turn grades itself into red through the set's `red`.

export const antartika = defineEpisode('Antartika', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13 },
});
