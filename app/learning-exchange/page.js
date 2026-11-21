import { LearningExchange } from "./LearningExchange";

// The Learning Exchange: visitors recommend learning materials
// (courses, books, podcasts…) to each other. This part of the
// feature stores submissions in the BROWSER's LocalStorage, so
// the whole page runs client-side — the server only delivers
// the code.
export const metadata = {
  title: "Learning Exchange",
  description:
    "Community-recommended learning materials: courses, books, podcasts, and more — save your favorites to your personal list.",
};

export default function LearningExchangePage() {
  return <LearningExchange />;
}
