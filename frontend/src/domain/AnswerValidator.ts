import type { Practice } from '@/types';
import { Answer } from './Answer';

export class AnswerValidator {
  constructor(public practice: Practice) {}

  // ValidateAnswer(answer) -> boolean
  ValidateAnswer(answer: Answer): boolean {
    const norm = (s: string) => s.trim().toLowerCase().replace(/[^\w\s]/g, '');
    return norm(answer.voice) === norm(this.practice.correct_answer);
  }
}