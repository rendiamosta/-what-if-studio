const fs = require('fs');
const path = require('path');
const { ElevenLabsClient } = require('elevenlabs');
require('dotenv').config();

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

async function generateAudio() {
  const timelinePath = path.join(__dirname, 'src/episodes/kutub-utara/timeline.json');
  const timeline = JSON.parse(fs.readFileSync(timelinePath, 'utf8'));
  
  const text = timeline.segments.map(s => s.line).join(' ');
  const outputDir = path.join(__dirname, 'public/elevenlabs');
  
  if (!fs.existsSync(outputDir)){
      fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Generating audio from timeline...');
  
  const audio = await client.textToSpeech.convert("21m00Tcm4TlvDq8ikWAM", {
    text: text,
    model_id: "eleven_multilingual_v2",
    output_format: "mp3_44100_128",
  });

  const outputPath = path.join(outputDir, 'kutub-utara.mp3');
  const fileStream = fs.createWriteStream(outputPath);
  
  audio.pipe(fileStream);
  
  fileStream.on('finish', () => {
    console.log('Audio saved to public/elevenlabs/kutub-utara.mp3');
  });
}

generateAudio().catch(console.error);