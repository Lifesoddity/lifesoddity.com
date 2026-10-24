// The About page: the profile. Life's Oddity in his own three lines, the acts as a dated
// timeline, the crew his captions credit, and how to reach him. Facts come from site.ts and
// acts.ts; this file holds only the page's own words.
//
// FOR THE OWNER: his own story is missing (who is behind the label, where, since when). The
// page shows an UNCONFIRMED stamp in its place, and promises nothing. Nothing here guesses it.
// Sources of the credits under each line: .bunshin/harvest/facts.md ("The brand").

export const about = {
  /** The pink script over the title card. */
  script: 'the profile',
  /** Where the tagline comes from: his Instagram name and his TikTok bio. */
  titleCredit: 'His words: the name on his Instagram, the bio on his TikTok.',
  /** The issue line under the title: parts joined with middle dots. */
  issueLead: 'The profile issue',
  /** The span of the acts, first to latest: "Party Animal to She Devil". */
  issueSpan: (first: string, last: string) => (first === last ? first : `${first} to ${last}`),

  who: {
    /** On the black print where his photo would be. */
    print: 'Who is he?',
    tape: 'no pics yet',
    /** Beside the UNCONFIRMED stamp. */
    line: 'Who he is, where he is from, when it started: not on the record yet.',
    label: 'No photo of him yet',
  },

  /** His two other lines, set as pull quotes. `hit` is printed in pink. */
  quotes: [
    { key: 'line', hit: 'oddities', credit: 'His Instagram bio' },
    { key: 'bio', hit: 'nightmare', credit: 'His Instagram bio' },
  ] as const,
  quotesLabel: 'In his words',

  timeline: {
    title: 'How it went down',
    deck: 'The acts so far, on the day each one dropped.',
    pieces: 'In it:',
    /** The act's pieces as one phrase: "the Showtime hoodie, the Spotlight tee and the Party Animal jacket". */
    pieceList: (names: readonly string[]) => {
      const the = names.map((n) => (/^the /i.test(n) ? `the ${n.slice(4)}` : `the ${n}`));
      return the.length > 1 ? `${the.slice(0, -1).join(', ')} and ${the[the.length - 1]}` : (the[0] ?? '');
    },
    seePics: 'See the pics',
    seePiece: 'See the piece',
    radio: "Life's Oddity radio: the sound behind the collection",
    radioAlt: "Illustrated cover for Life's Oddity radio: a house party under two spotlights, PARTY ANIMAL bunting",
    next: {
      title: 'Next drop',
      line: 'No name and no date yet. Be the first to know.',
      cta: 'Get on the list',
    },
  },

  crew: {
    title: 'The crew',
    deck: 'The people behind the shoots.',
    on: 'on Instagram',
  },

  reach: {
    title: 'Got a tip?',
    deck: 'Reach him where he posts.',
    profiles: 'Where he posts',
    /** His handles as they read on each profile (facts.md, "Channels"). */
    handles: {
      Instagram: '@lifesoddity',
      TikTok: '@lifes.oddity',
      Pinterest: 'lifesoddity',
    } as Record<string, string>,
  },
};
