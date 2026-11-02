import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4 } from './shots';

export const kutubUtara = defineEpisode('kutub-utara', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4 },
});