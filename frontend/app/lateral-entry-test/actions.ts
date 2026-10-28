'use server'

// This file runs ONLY on the server. It strips all answer fields before
// returning data to the client — questions are safe from browser inspection.

import { VENTUREX_QUESTIONS } from '@/data/ventureXQuestions'

export interface SafeQuestion {
  id: string
  questionText: string
  options: string[] // shuffled, no answer field
  category: string
  difficulty: string
  durationSeconds: number
  index: number // 1-based display number
}

/** Fisher-Yates shuffle — works on any array. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Returns all 20 questions with:
 *  - Randomized question order
 *  - Randomized option order per question
 *  - Answer field STRIPPED — never leaves the server
 */
export async function getRandomizedQuestions(): Promise<SafeQuestion[]> {
  const shuffledQuestions = shuffle(VENTUREX_QUESTIONS)

  return shuffledQuestions.map((q, idx) => ({
    id: q.id,
    questionText: q.questionText,
    options: shuffle(q.options), // answers positional order randomised
    category: q.category,
    difficulty: q.difficulty,
    durationSeconds: q.durationSeconds,
    index: idx + 1,
  }))
}
