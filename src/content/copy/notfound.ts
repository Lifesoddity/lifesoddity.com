// Two small pages of the magazine: the killed story (404) and the page a waitlist sign-up
// lands on when JavaScript did not run (/joined). Short, second person, a little loud.

export const notfound = {
  /** The headline reads "Story killed": STORY in giant type, KILLED as the rubber stamp. */
  story: 'Story',
  killed: 'Killed',
  deck: 'This page got pulled before it went to print. The cover story is still running.',
  deckNoPiece: 'This page got pulled before it went to print. The rest of the issue is still here.',
  tape: 'still out now',
  see: 'See the piece',
  shop: 'All the pieces',
  home: 'Back to the cover',
};

export const joined = {
  title: 'You’re on the list.',
  /** When the next drop has no name or date yet (today). */
  deck: 'When the next drop gets a name and a date, you’ll be the first to know.',
  /** When it has one: "Next drop: NAME, DATE." comes first. */
  deckNamed: (name: string, date: string | null) => `Next drop: ${name}${date ? `, ${date}` : ''}. You’ll be the first to know.`,
  tape: 'while you wait',
  see: 'See the piece',
  shop: 'All the pieces',
  home: 'Back to the cover',
};
