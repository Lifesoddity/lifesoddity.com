// The About page: the profile. Life's Oddity in its own three lines, beside a photo from its
// latest campaign; the acts as a dated timeline; the crew its captions credit; how to reach it.
// Facts come from site.ts and acts.ts; this file holds only the page's own words. The site
// speaks as Life's Oddity: no third person about the founder, no source attributions (D5).
//
// FOR THE OWNER: the story behind the label (who, where, since when) has not been given. The
// page leaves it out (D1); nothing here guesses it. When it is written, it can open this page.

export const about = {
  /** The issue line under the title: parts joined with middle dots. */
  issueLead: 'The profile issue',
  /** The span of the acts, first to latest: "Party Animal to She Devil". */
  issueSpan: (first: string, last: string) => (first === last ? first : `${first} to ${last}`),

  /** The caption beside the opening photo: the act it comes from, its date, its real credit. */
  photo: {
    actName: (n: number | null, title: string) => (n ? `Act ${n}: ${title}` : title),
    /** How screen readers name the photo's link to the act's pictures in the lookbook. */
    see: (act: string) => `${act}, see the pics`,
  },

  /** The brand's two other lines, set as pull quotes. `hit` is printed in pink. */
  quotes: [
    { key: 'line', hit: 'oddities' },
    { key: 'bio', hit: 'nightmare' },
  ] as const,
  /** How screen readers name the pull quotes. */
  quotesLabel: "Life's Oddity, in its own lines",

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
    deck: 'The people behind the acts.',
    on: 'on Instagram',
  },

  reach: {
    title: 'Got a tip?',
    profiles: "Follow Life's Oddity",
    /** The handles as they read on each profile (facts.md, "Channels"). */
    handles: {
      Instagram: '@lifesoddity',
      TikTok: '@lifes.oddity',
      Pinterest: 'lifesoddity',
    } as Record<string, string>,
  },
};
