import { getRandomizedQuestions } from './actions'
import TestClient from './TestClient'

// Server Component — pre-fetches randomised questions server-side.
// The questions payload (answer-stripped) is passed as a prop to the Client Component.
export default async function LateralEntryTestPage() {
  const questions = await getRandomizedQuestions()

  return <TestClient initialQuestions={questions} />
}
