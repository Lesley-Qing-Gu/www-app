import { Emotion } from '@/universal/Emotion';

export class EmotionDetector {
  // Detect(answer) -> Emotion
  Detect(answerText: string): Emotion {
    const s = answerText.toLowerCase();
    if (!s.trim()) return Emotion.NEUTRAL;
    if (s.includes('great') || s.includes('!')) return Emotion.POSITIVE;
    if (s.includes('sad') || s.includes(':(')) return Emotion.NEGATIVE;
    return Emotion.NEUTRAL;
  }
}
