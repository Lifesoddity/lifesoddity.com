// The drop page: WHO'S NEXT? (the next issue and the waitlist), the issue on sale now, and the
// back issues. The acts' own words (titles, definitions, quotes, "This concludes Act 1.") come
// from content/acts.ts; this file holds the magazine's plain voice around them. Nothing here
// states what he has not given.
//
// FOR THE OWNER (pending, shown on the page as UNCONFIRMED, never guessed):
// - the next drop's name and date: set nextDrop in content/acts.ts. With a name, the page prints
//   it; with a date (`opens`, ISO with the Eastern offset, e.g. 2026-11-14T12:00:00-05:00) the
//   page shows "Opens <date> EST", the visitor's own time and a countdown that ends on "Out now".
// - whether Act 1 pieces ever come back (the restock line under BACK ISSUES).
// - the Spotify link of each act's playlist (content/acts.ts, playlist.spotify).

export const drop = {
  next: {
    title: 'Who’s next?',
    /** Under the title while the next drop has no name. */
    deck: 'The next drop is in the works. Be the first to know.',
    deckNamed: (name: string) => `The next drop: ${name}. Be the first to know.`,
    nameLabel: 'Name',
    namePending: 'Not on the record yet.',
    dateLabel: 'Date',
    datePending: 'No date on the record, so no countdown. Yet.',
    /** The issue line printed on the next issue's blank cover. */
    coverIssue: 'The next issue',
    coverDate: 'Date unconfirmed',
  },
  countdown: {
    opens: 'Opens',
    /** Once the time has passed. */
    opened: 'Opened',
    yourTime: 'Your time:',
    label: 'Time left before the drop opens',
    units: [
      { key: 'd', label: 'Days' },
      { key: 'h', label: 'Hrs' },
      { key: 'm', label: 'Min' },
      { key: 's', label: 'Sec' },
    ],
  },
  issue: {
    name: (title: string) => `The ${title} issue`,
    opened: (label: string) => `Opened ${label}`,
    act: (n: number) => `Act ${n}`,
    see: 'See the piece',
    seeLabel: (title: string) => `${title}, see the piece`,
    noPhoto: 'No pics yet.',
  },
  back: {
    title: 'Back issues',
    deck: 'Past drops, kept on file: every piece, its pics and its playlist.',
    restockLabel: 'Coming back?',
    restockPending: 'No word on a restock yet. We are watching.',
  },
};
