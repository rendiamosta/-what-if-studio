import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';
import { STUDIO } from '../studio.config';

// Three faces: a heavy display face for the title card, a mono for on-screen readouts (timers, labels, chips),
// and a handwriting face for chalk and notes. All three live in public/fonts/ (latin subsets downloaded once),
// so a long render never depends on the network — fonts.gstatic mid-render outages used to kill the tab.
// Same family names as the Google versions, so every usage keeps working.
const local = (file: string, family: string, weight: string) =>
  loadFont({ family, url: staticFile(`fonts/${file}`), weight });
local('BricolageGrotesque-600.woff2', 'Bricolage Grotesque', '600');
local('BricolageGrotesque-700.woff2', 'Bricolage Grotesque', '700');
local('BricolageGrotesque-800.woff2', 'Bricolage Grotesque', '800');
local('FragmentMono-400.woff2', 'Fragment Mono', '400');
local('Kalam-400.woff2', 'Kalam', '400');
local('Kalam-700.woff2', 'Kalam', '700');
if (STUDIO.titleFont) loadFont({ family: STUDIO.titleFont.family, url: staticFile(STUDIO.titleFont.file), weight: STUDIO.titleFont.weight });

export const FONT = {
  title: STUDIO.titleFont ? STUDIO.titleFont.family : 'Bricolage Grotesque',
  ui: 'Fragment Mono',
  hand: 'Kalam',
};
