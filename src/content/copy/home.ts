// The home page: the cover, the SPOTTED! story, the soundtrack page, WHO'S NEXT?
// Every line is his, from his captions and his bio, or plain labels.

export const home = {
  title: "Life's Oddity: Life Is Odd",
  description:
    'Streetwear released in acts, each with its own soundtrack. Out now: the She Devil tee, a black tee with a red devil and angel graphic.',
  cover: {
    strap: ['Hollywood', 'dream turned', 'nightmare'],
    /** The issue line: the live act, its date, the tagline. */
    issueSuffix: 'Life Is Odd',
    actLead: 'Act 1 is over',
    actBody: 'Gluttony: the excessive hunger for more than you need. All the pics inside.',
    quoteLead: 'Have you ever wanted to be',
    quoteHit: 'him?',
    playTitle: 'Press play',
    playLine: "Life's Oddity radio: the sound behind the collection",
    /** The same slot while no playlist link is in: a jump to the waitlist instead of PRESS PLAY. */
    nextTitle: 'Who’s next?',
    nextLine: 'The next drop is in the works. Get on the list.',
    pickSize: 'Pick a size first.',
    addToBag: 'Add to bag',
  },
  story: {
    label: 'Spotted',
    openWord: 'Spotted!',
    openLine: 'The She Devil tee is out now. Act 1 is in the archive.',
    buyLabel: 'Add to bag',
    sizesTitle: 'Pick your size',
    archive: 'Archive',
    act: (n: number) => `Act ${n}`,
    /** The script caption over each print of the opening card's strip: "spotted: the Showtime hoodie, Act 1". */
    spotted: (tag: string) => `spotted: ${tag.charAt(0).toLowerCase()}${tag.slice(1)}`.replace(/\bAct (\d+)/g, 'Act\u00a0$1'),
    /** One line per scene for screen readers: the pinned story hides every scene it is not showing. */
    summary: (title: string, state: string, line: string | null, pending: string | null) =>
      [`${title}: ${state}.`, line, pending].filter(Boolean).join(' '),
  },
  soundtrack: {
    label: 'On his playlist',
    lead: 'Press play.',
    follow: 'Showtime starts now.',
    deck: "Life's Oddity radio: the sound behind the collection.",
    bar: 'On his playlist',
    heardOn: 'Heard on the Gluttony reel:',
    play: 'Play',
    here: 'listen here',
    caption: "Spotify's player, in its own design.",
    honest: 'Not logged in to Spotify here? You’ll hear previews. Open in Spotify for the full songs.',
    open: 'Open in Spotify',
    error: "Spotify did not load here. Open the playlist in Spotify instead.",
    /** The script tag over the jacket print beside the headline. */
    spotted: 'spotted: the Party Animal jacket, Act 1',
    jacketAlt: 'Back of the Party Animal jacket: SECURITY and LIFE OF THE PARTY over a party collage',
  },
  next: {
    title: 'Who’s next?',
    deck: 'The next drop is in the works. Be the first to know.',
    /** The blank next-issue cover's issue line, until the next drop has a name and a date. */
    coverIssue: 'The next issue',
    coverDate: 'Date unconfirmed',
    coverNamed: (name: string) => `The ${name} issue`,
  },
};
