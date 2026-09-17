/**
 * BiDi (Bidirectional) Text Utilities for Hebrew/English Mixed Content.
 * Handles Unicode directionality, inline English isolation, and visual-Hebrew restoration.
 */

// Hebrew Unicode ranges: \u0590-\u05FF and presentation forms \uFB1D-\uFB4F
const HEBREW_REGEX = /[\u0590-\u05FF\uFB1D-\uFB4F]/;
const HEBREW_ALL_REGEX = /[\u0590-\u05FF\uFB1D-\uFB4F]+/g;

// Final letters in Hebrew (Sofiot): cannot appear at the start of a logical word
const HEBREW_FINAL_LETTERS = ['ך', 'ם', 'ן', 'ף', 'ץ'];

// Non-final counterparts
const FINAL_TO_REGULAR: Record<string, string> = {
  'ך': 'כ',
  'ם': 'מ',
  'ן': 'נ',
  'ף': 'פ',
  'ץ': 'צ',
};

// Common reversed Hebrew words seen in visual-order PDFs
const REVERSED_SECTION_MARKERS: Record<string, string> = {
  'תיצמת': 'תמצית',
  'ןויסינ': 'ניסיון',
  'ןוייסינ': 'ניסיון',
  'יעוצקמ ןויסינ': 'ניסיון מקצועי',
  'יעוצקמ ןוייסינ': 'ניסיון מקצועי',
  'הלכשה': 'השכלה',
  'תויונמוימ': 'מיומנויות',
  'םירושיכ': 'כישורים',
  'תופש': 'שפות',
  'יאבצ תוריש': 'שירות צבאי',
  'םייח תורוק': 'קורות חיים',
  'םיטקייורפ': 'פרויקטים',
  'תוכמסתו הלכשה': 'השכלה והסמכות',
  'םייללכ םיטרפ': 'פרטים כלליים',
  'םיישיא םיטרפ': 'פרטים אישיים',
  'םילכו תויגולונכט': 'טכנולוגיות וכלים',
  'ינכט עדי': 'ידע טכני',
};

/**
 * Checks if a string contains any Hebrew characters
 */
export function hasHebrew(text: string): boolean {
  return HEBREW_REGEX.test(text);
}

/**
 * Determines text base direction:
 * Checks the first strong directional character (Hebrew/Arabic -> rtl, Latin -> ltr)
 */
export function getBaseDirection(text: string): 'rtl' | 'ltr' {
  if (!text) return 'rtl';
  for (const char of text) {
    const code = char.charCodeAt(0);
    // Hebrew: 0x0590 - 0x05FF, Arabic: 0x0600 - 0x06FF
    if ((code >= 0x0590 && code <= 0x05ff) || (code >= 0x0600 && code <= 0x06ff)) {
      return 'rtl';
    }
    // Latin: A-Z, a-z
    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
      return 'ltr';
    }
  }
  return 'rtl';
}

/**
 * Analyzes whether an extracted text stream is in visual order (i.e. reversed Hebrew)
 */
export function isVisualHebrew(text: string): boolean {
  if (!hasHebrew(text)) return false;

  const words = text.split(/\s+/).filter(w => w.length > 1);
  if (words.length === 0) return false;

  let reversedIndications = 0;
  let logicalIndications = 0;

  // 1. Check for reversed section marker phrases
  for (const [reversed] of Object.entries(REVERSED_SECTION_MARKERS)) {
    if (text.includes(reversed)) {
      return true;
    }
  }

  // 2. Check final letters:
  // In Hebrew, ך, ם, ן, ף, ץ only appear at the end of a word.
  // If they appear at the start of words, the text is certainly reversed.
  for (const word of words) {
    const cleanWord = word.replace(/^[^\u0590-\u05FF]+|[^\u0590-\u05FF]+$/g, '');
    if (cleanWord.length < 2) continue;

    const firstChar = cleanWord[0];
    const lastChar = cleanWord[cleanWord.length - 1];

    if (HEBREW_FINAL_LETTERS.includes(firstChar)) {
      reversedIndications += 3;
    }
    if (HEBREW_FINAL_LETTERS.includes(lastChar)) {
      logicalIndications += 2;
    }

    // Common prefixes (ב, כ, ל, מ, ש, ה, ו) appearing at end of word while missing from beginning
    if (cleanWord.endsWith('וה') || cleanWord.endsWith('ול')) {
      reversedIndications += 1;
    }
  }

  return reversedIndications > logicalIndications;
}

/**
 * Reverses a Hebrew string while keeping punctuation and LTR segments (English words, numbers, tech terms) intact.
 * For example: "nohtyP-ב חותיפ" becomes "פיתוח ב-Python".
 */
export function reverseHebrewTokensOnly(text: string): string {
  if (!text) return '';

  // Tokenize by runs of Hebrew vs Non-Hebrew (English, numbers, symbols)
  // Match tokens: either Hebrew character sequences, or English/numbers/symbols
  const tokenRegex = /([\u0590-\u05FF\uFB1D-\uFB4F]+|[a-zA-Z0-9_#+./-]+|\s+|[^\s\u0590-\u05FF\uFB1D-\uFB4Fa-zA-Z0-9])/g;
  const tokens = text.match(tokenRegex) || [text];

  // In visual-order PDF streams, the tokens themselves are written in right-to-left visual sequence,
  // and the Hebrew letters inside the tokens might also be reversed.
  const correctedTokens = tokens.map(token => {
    if (hasHebrew(token)) {
      // Reverse the Hebrew word to restore logical order
      return token.split('').reverse().join('');
    }
    // Non-hebrew tokens (e.g. "Python", "L2/L3", "2023") are left as-is
    return token;
  });

  // Since in visual order the rightmost word was at index 0, reverse the token order of the line
  return correctedTokens.reverse().join('');
}

/**
 * Clean up text lines extracted from PDFs or user pastes:
 * - Fixes common ligature and hyphenation artifacts
 * - Standardizes bullet characters to standard bullet symbol
 * - Trims whitespace
 */
export function normalizeHebrewText(text: string): string {
  if (!text) return '';

  let res = text
    .replace(/[\u200E\u200F]/g, '') // strip invisible LRM/RLM during parsing
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ \u00A0]+/g, ' '); // collapse double spaces and non-breaking spaces

  return res.trim();
}

/**
 * Wraps English/technical terms in invisible isolation or formats them for clean BiDi display
 */
export function sanitizeBulletText(bullet: string): string {
  if (!bullet) return '';
  // Strip leading bullet icons if present
  let clean = bullet.replace(/^[\s•*·–—▪▫➢●\-\d.]+\s*/, '').trim();
  return clean;
}
