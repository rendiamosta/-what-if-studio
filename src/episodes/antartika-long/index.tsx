import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S14, S15, S16, S17, S10, S18, S19, S11, S12, S13 } from './shots';

// The long cut of Antartika (43 s): the polar day is the power; the katabatic wind, the guideline rope and the
// melatonin arrest are the cost. The turn grades itself into red through the set's `red`; Mo knocks at 04:15.

export const antartikaLong = defineEpisode('AntartikaLong', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S14, S15, S16, S17, S10, S18, S19, S11, S12, S13 },
});
