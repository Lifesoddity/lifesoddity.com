// The drop page: WHO'S NEXT? (the next issue and the waitlist), the issue on sale now, and the
// back issues. The acts' own words (titles, definitions, quotes, "This concludes Act 1.") come
// from content/acts.ts; this file holds the magazine's plain voice around them. Nothing here
// states a fact that has not been given, and nothing stands in for one (D1).
//
// FOR THE OWNER (what the page leaves out until it is given):
// - the next drop's name and date: set nextDrop in content/acts.ts. Until then the blank
//   next-issue cover carries the page's one UNCONFIRMED stamp. With a name, the deck and the cover
//   print it; with a date (`opens`, ISO with the Eastern offset, e.g. 2026-11-14T12:00:00-05:00)
//   the page shows "Opens <date> EST", the visitor's own time and a countdown that ends on "Out now".
// - whether Act 1 pieces ever come back: not mentioned until there is an answer.
// - the Spotify link of each act's playlist (content/acts.ts, playlist.spotify): the playlist
//   strip becomes the full box with PLAY by itself.

export const drop = {
  next: {
    title: 'Who’s next?',
    /** Under the title while the next drop has no name. */
    deck: 'The next drop is in the works. Be the first to know.',
    deckNamed: (name: string) => `The next drop: ${name}. Be the first to know.`,
    /** The issue line printed on the next issue's blank cover. */
    coverIssue: 'The next issue',
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
    opened: (label: string) => `Dropped ${label}`,
    act: (n: number) => `Act ${n}`,
    see: 'See the piece',
    seeLabel: (title: string) => `${title}, see the piece`,
    /** The heading over an act's credits, printed only in an issue that shows the photos they credit. */
    credits: 'Credits',
  },
  back: {
    title: 'Back issues',
    /** Add "and its playlist" back once the acts' playlist links are in. */
    deck: 'Past drops, kept on file: every piece and its pics.',
  },
};
