// The home page: the cover, the SPOTTED! story, the soundtrack page, WHO'S NEXT?
// The site speaks as Life's Oddity: the brand's own lines from its captions and bio, or plain
// labels. Nothing about the founder in the third person.

export const home = {
  title: "Life's Oddity: Life Is Odd",
  description:
    'Streetwear released in acts, each with its own soundtrack. Out now: the She Devil tee, a black tee with a red devil and angel graphic.',
  cover: {
    strap: ['Hollywood', 'dream turned', 'nightmare'],
    actLead: 'Act 1 is over',
    actBody: 'Gluttony: the excessive hunger for more than you need. All the pics inside.',
    quoteLead: 'Have you ever wanted to be',
    quoteHit: 'him?',
    playTitle: 'Press play',
    playLine: "Life's Oddity radio: the sound behind the collection",
    /** The same slot while no playlist link is in: a jump to the waitlist instead of PRESS PLAY. */
    nextTitle: 'Who’s next?',
    nextLine: 'The next drop is in the works. Get on the list.',
  },
  story: {
    label: 'Spotted',
    openWord: 'Spotted!',
    openLine: 'The She Devil tee is out now. Act 1 is in the archive.',
    buyLabel: 'Add to bag',
    sizesTitle: 'Pick your size',
    act: (n: number) => `Act ${n}`,
    /** The script caption over each print of the opening card's strip: "spotted: the Showtime hoodie, Act 1". */
    spotted: (tag: string) => `spotted: ${tag.charAt(0).toLowerCase()}${tag.slice(1)}`.replace(/\bAct (\d+)/g, 'Act $1'),
    /** One line per scene for screen readers: the pinned story hides every scene it is not showing. */
    summary: (title: string, state: string, line: string | null) => [`${title}: ${state}.`, line].filter(Boolean).join(' '),
  },
  soundtrack: {
    /** The section's name: the brand's own name for its soundtrack. */
    label: "Life's Oddity radio",
    /** Once the act's playlist link is in: the act's own call, with PLAY right beside it. */
    lead: 'Press play.',
    follow: 'Showtime starts now.',
    deck: "Life's Oddity radio: the sound behind the collection.",
    /** Until then nothing on the page plays, so the headline is the radio's own line, not a call. */
    quietLead: 'The sound',
    quietFollow: 'behind the collection.',
    quietDeck: (n: number | null, title: string) => (n ? `The soundtrack of Act ${n}: ${title}.` : `The soundtrack of ${title}.`),
  },
  next: {
    title: 'Who’s next?',
    deck: 'The next drop is in the works. Be the first to know.',
    /** The blank next-issue cover's issue line, until the next drop has a name and a date. */
    coverIssue: 'The next issue',
    coverNamed: (name: string) => `The ${name} issue`,
  },
};
