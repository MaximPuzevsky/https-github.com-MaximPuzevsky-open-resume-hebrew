/**
 * Robust Hebrew Resume PDF Parsing Engine.
 * Extracts text with spatial line-grouping, bidirectional Hebrew/English correction,
 * bullet point binding to specific job blocks, and strict section boundary preservation.
 */

import * as pdfjsLib from 'pdfjs-dist';
import { ResumeData, WorkExperience, Education, SkillCategory, LanguageItem, MilitaryService, PDFParseDiagnostic } from '../types/resume';
import { isVisualHebrew, reverseHebrewTokensOnly, normalizeHebrewText, sanitizeBulletText } from './bidi';

// Initialize PDF.js worker
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
  } catch {
    // Worker initialization fallback
  }
}

interface PDFTextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  hasEOL?: boolean;
}

interface GroupedLine {
  y: number;
  items: PDFTextItem[];
  text: string;
}

type SectionType = 'profile' | 'summary' | 'experience' | 'military' | 'education' | 'skills' | 'languages' | 'projects' | 'unknown';

const SECTION_MATCHERS: Record<SectionType, RegExp[]> = {
  summary: [
    /^(?:תמצית|תמצית\s+מקצועית|סיכום\s+מקצועי|פרופיל\s+מקצועי|פרופיל|אודות|על\s+עצמי|תקציר)(?:\s*[:\-])?$/i,
    /^(?:professional\s+summary|summary|profile|about\s+me)$/i,
  ],
  experience: [
    /^(?:ניסיון\s+מקצועי|ניסיון\s+תעסוקתי|ניסיון\s+עבודה|ניסיון\s+בעבודה|ניסיון)(?:\s*[:\-])?$/i,
    /^(?:work\s+experience|professional\s+experience|experience|employment\s+history)$/i,
  ],
  military: [
    /^(?:שירות\s+צבאי(?:\s*\/\s*(?:לאומי|בטחוני))?|שירות\s+בטחוני|שירות\s+לאומי)(?:\s*[:\-])?$/i,
    /^(?:military\s+service|military\s+experience|national\s+service)$/i,
  ],
  education: [
    /^(?:השכלה(?:\s+והסמכות)?|לימודים|השכלה\s+אקדמית|תארים\s+והסמכות)(?:\s*[:\-])?$/i,
    /^(?:education(?:\s+and\s+certifications)?|academic\s+background)$/i,
  ],
  skills: [
    /^(?:מיומנויות(?:\s+טכניות)?|כישורים(?:\s+טכנולוגיים)?|ידע\s+טכני|טכנולוגיות(?:\s+וכלים)?|כלים\s+וטכנולוגיות|שפות\s+תכנות)(?:\s*[:\-])?$/i,
    /^(?:technical\s+skills|skills|technologies|tools\s+&\s+technologies)$/i,
  ],
  languages: [
    /^(?:שפות|שליטה\s+בשפות|ידיעת\s+שפות)(?:\s*[:\-])?$/i,
    /^(?:languages|language\s+skills)$/i,
  ],
  projects: [
    /^(?:פרויקטים(?:\s+(?:אישיים|נבחרים|נוספים))?|פרויקטי\s+קוד\s+פתוח)(?:\s*[:\-])?$/i,
    /^(?:projects|personal\s+projects|open\s+source\s+projects)$/i,
  ],
  profile: [],
  unknown: [],
};

const BULLET_PREFIX_REGEX = /^[\s•*·–—▪▫➢●✓\-\d.]+/;

/**
 * Extracts raw text items with coordinates from PDF buffer
 */
export async function extractPDFRawLines(fileBuffer: ArrayBuffer): Promise<{ lines: string[]; diagnostic: Partial<PDFParseDiagnostic> }> {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(fileBuffer),
    cMapUrl: 'https://unpkg.com/pdfjs-dist@4.10.38/cmaps/',
    cMapPacked: true,
  });

  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  const allLines: string[] = [];
  let totalItemsCount = 0;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items as any[];
    totalItemsCount += items.length;

    // Filter valid text items with coordinates
    const textItems: PDFTextItem[] = items
      .filter(item => item.str && item.str.trim().length > 0)
      .map(item => ({
        str: item.str,
        x: item.transform[4],
        y: item.transform[5],
        width: item.width || 0,
        height: item.height || 0,
        hasEOL: item.hasEOL,
      }));

    // Group items into lines based on Y coordinate tolerance
    const lineMap: GroupedLine[] = [];
    const Y_TOLERANCE = 3.5;

    for (const item of textItems) {
      let matchedLine = lineMap.find(l => Math.abs(l.y - item.y) <= Y_TOLERANCE);
      if (!matchedLine) {
        matchedLine = { y: item.y, items: [], text: '' };
        lineMap.push(matchedLine);
      }
      matchedLine.items.push(item);
    }

    // Sort lines top-to-bottom (PDF Y starts from bottom, so higher Y is higher on the page)
    lineMap.sort((a, b) => b.y - a.y);

    for (const line of lineMap) {
      // Sort items on the line:
      // In RTL contexts, rightmost items have greater X coordinate.
      // However, if the PDF already laid them in reading order, standard sort or LTR sort applies.
      // We sort primarily by X coordinate.
      line.items.sort((a, b) => a.x - b.x);
      
      const lineStr = line.items.map(it => it.str).join(' ');
      const cleanLine = normalizeHebrewText(lineStr);
      if (cleanLine.length > 0) {
        allLines.push(cleanLine);
      }
    }
  }

  // Detect whether entire extracted text is in visual (reversed) Hebrew
  const sampleText = allLines.slice(0, 40).join(' ');
  const detectedReversed = isVisualHebrew(sampleText);

  // Correct lines if reversed Hebrew was detected
  const processedLines = allLines.map(line => {
    if (detectedReversed) {
      return reverseHebrewTokensOnly(line);
    }
    return line;
  });

  return {
    lines: processedLines,
    diagnostic: {
      totalPages: numPages,
      totalTextItems: totalItemsCount,
      detectedReversedHebrew: detectedReversed,
      rawTextPreview: processedLines.slice(0, 15).join('\n'),
    },
  };
}

/**
 * Checks if a line matches a known section title
 */
function identifySection(line: string): SectionType | null {
  const clean = line.replace(/[:\-–—#_]+$/, '').trim();
  for (const [section, matchers] of Object.entries(SECTION_MATCHERS) as [SectionType, RegExp[]][]) {
    for (const regex of matchers) {
      if (regex.test(clean)) {
        return section;
      }
    }
  }
  return null;
}

/**
 * Checks if a line is a bullet point
 */
function isBulletLine(line: string): boolean {
  return BULLET_PREFIX_REGEX.test(line) || line.trim().startsWith('-') || line.trim().startsWith('•');
}

/**
 * Extracts phone, email, urls, and location from text
 */
function extractContactDetails(lines: string[]) {
  const joined = lines.join(' ');
  
  // Email
  const emailMatch = joined.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // Phone (Israeli format support)
  const phoneMatch = joined.match(/(?:\+972[\s-]?)?0?5\d(?:[\s-]?\d{7}|[\s-]?\d{3}[\s-]?\d{4})|0[23489][\s-]?\d{7}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // LinkedIn
  const linkedinMatch = joined.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const linkedin = linkedinMatch ? `https://${linkedinMatch[0]}` : '';

  // GitHub
  const githubMatch = joined.match(/github\.com\/[a-zA-Z0-9_-]+/i);
  const github = githubMatch ? `https://${githubMatch[0]}` : '';

  return { email, phone, linkedin, github };
}

/**
 * Parse date ranges like "2020 - נוכחי" or "03/2019 - 05/2022"
 */
function extractDatesFromLine(line: string): { dates: string; rest: string } {
  const dateRegex = /(?:(?:\d{2}\/)?\d{4}\s*[-–—]\s*(?:(?:\d{2}\/)?\d{4}|נוכחי|היום|כיום|Present|Current))|(?:(?:19|20)\d{2}\s*[-–—]\s*(?:(?:19|20)\d{2}|נוכחי|היום|כיום))/i;
  const match = line.match(dateRegex);
  if (match) {
    const dates = match[0].trim();
    const rest = line.replace(dateRegex, '').replace(/[|•,]/g, ' ').trim();
    return { dates, rest };
  }
  return { dates: '', rest: line };
}

/**
 * Main parser: takes extracted lines and builds structured ResumeData
 */
export function parseHebrewResumeLines(lines: string[]): { data: Partial<ResumeData>; diagnostic: Partial<PDFParseDiagnostic> } {
  let currentSection: SectionType = 'profile';
  const detectedSections: string[] = [];

  const profileLines: string[] = [];
  const summaryLines: string[] = [];
  const experienceLines: string[] = [];
  const militaryLines: string[] = [];
  const educationLines: string[] = [];
  const skillsLines: string[] = [];
  const languageLines: string[] = [];
  const projectLines: string[] = [];

  // 1. Segment lines by detected sections
  for (const line of lines) {
    const matchedSection = identifySection(line);
    if (matchedSection) {
      currentSection = matchedSection;
      if (!detectedSections.includes(matchedSection)) {
        detectedSections.push(matchedSection);
      }
      continue;
    }

    switch (currentSection) {
      case 'profile':
        profileLines.push(line);
        break;
      case 'summary':
        summaryLines.push(line);
        break;
      case 'experience':
        experienceLines.push(line);
        break;
      case 'military':
        militaryLines.push(line);
        break;
      case 'education':
        educationLines.push(line);
        break;
      case 'skills':
        skillsLines.push(line);
        break;
      case 'languages':
        languageLines.push(line);
        break;
      case 'projects':
        projectLines.push(line);
        break;
      default:
        break;
    }
  }

  // 2. Parse Profile
  const contact = extractContactDetails(lines.slice(0, 15));
  let candidateName = '';
  let candidateTitle = '';
  let candidateLocation = '';

  for (let i = 0; i < Math.min(profileLines.length, 5); i++) {
    const line = profileLines[i];
    // Skip if line is an email, phone, or url
    if (line.includes('@') || /0\d{8,9}/.test(line) || line.includes('http') || line.includes('www')) {
      continue;
    }
    if (!candidateName && line.length < 35) {
      candidateName = line;
      continue;
    }
    if (!candidateTitle && line.length < 50) {
      candidateTitle = line;
      continue;
    }
    if (!candidateLocation && (line.includes('תל אביב') || line.includes('חיפה') || line.includes('ירושלים') || line.includes('מרכז') || line.includes('ישראל'))) {
      candidateLocation = line;
    }
  }

  // 3. Parse Work Experience with strict bullet binding
  const workExperiences: WorkExperience[] = [];
  let currentJob: WorkExperience | null = null;
  let bulletCount = 0;

  for (const line of experienceLines) {
    const isBullet = isBulletLine(line);
    const { dates, rest } = extractDatesFromLine(line);

    // If it has a date range or pipe separator and isn't clearly a bullet, it's likely a job header
    if ((dates.length > 0 || line.includes('|')) && !isBullet) {
      if (currentJob) {
        workExperiences.push(currentJob);
      }

      // Parse Company and Title from header
      let company = '';
      let jobTitle = rest;

      if (rest.includes('|')) {
        const parts = rest.split('|').map(p => p.trim());
        company = parts[0] || '';
        jobTitle = parts[1] || parts[0];
      } else if (rest.includes('-')) {
        const parts = rest.split('-').map(p => p.trim());
        company = parts[0] || '';
        jobTitle = parts.slice(1).join(' ') || parts[0];
      } else {
        company = rest;
        jobTitle = 'תפקיד מקצועי';
      }

      currentJob = {
        id: `job-${Date.now()}-${workExperiences.length + 1}`,
        company: company || 'חברה',
        jobTitle: jobTitle || 'מהנדס / מפתח',
        date: dates || '2021 - נוכחי',
        location: '',
        descriptions: [],
      };
      continue;
    }

    if (currentJob) {
      if (isBullet) {
        const cleanBullet = sanitizeBulletText(line);
        if (cleanBullet.length > 0) {
          currentJob.descriptions.push(cleanBullet);
          bulletCount++;
        }
      } else if (currentJob.descriptions.length > 0) {
        // Multi-line wrap continuation of the last bullet
        const lastIdx = currentJob.descriptions.length - 1;
        currentJob.descriptions[lastIdx] += ' ' + line.trim();
      } else {
        // Header subtitle or description
        currentJob.descriptions.push(line.trim());
        bulletCount++;
      }
    } else {
      // Create an initial job container if no explicit header line matched yet
      currentJob = {
        id: `job-${Date.now()}-1`,
        company: 'חברה / ארגון',
        jobTitle: 'ניסיון מקצועי',
        date: dates || '2020 - נוכחי',
        location: '',
        descriptions: [sanitizeBulletText(line)],
      };
      bulletCount++;
    }
  }
  if (currentJob) {
    workExperiences.push(currentJob);
  }

  // 4. Parse Education
  const educations: Education[] = [];
  let currentEdu: Education | null = null;

  for (const line of educationLines) {
    const isBullet = isBulletLine(line);
    const { dates, rest } = extractDatesFromLine(line);

    if (dates.length > 0 || line.includes('|') || (!isBullet && line.length < 60 && !currentEdu)) {
      if (currentEdu) {
        educations.push(currentEdu);
      }
      let school = rest;
      let degree = 'תואר ראשון / לימודים';
      if (rest.includes('|')) {
        const parts = rest.split('|').map(p => p.trim());
        school = parts[0];
        degree = parts[1] || degree;
      }
      currentEdu = {
        id: `edu-${Date.now()}-${educations.length + 1}`,
        school: school || 'מוסד לימודים',
        degree: degree,
        date: dates || '2017 - 2020',
        descriptions: [],
      };
      continue;
    }

    if (currentEdu) {
      currentEdu.descriptions.push(sanitizeBulletText(line));
    }
  }
  if (currentEdu) {
    educations.push(currentEdu);
  }

  // 5. Parse Skills
  const skills: SkillCategory[] = [];
  if (skillsLines.length > 0) {
    // Check if skills lines contain category headers (e.g. "שפות תכנות: Python, TypeScript")
    for (let i = 0; i < skillsLines.length; i++) {
      const line = skillsLines[i];
      if (line.includes(':')) {
        const [categoryName, skillsList] = line.split(':');
        skills.push({
          id: `skill-${i + 1}`,
          categoryName: categoryName.trim(),
          skills: skillsList.trim(),
        });
      } else {
        skills.push({
          id: `skill-${i + 1}`,
          categoryName: 'מיומנויות וכלים',
          skills: line.trim(),
        });
      }
    }
  }

  // 6. Parse Military Service
  const militaryService: MilitaryService[] = [];
  if (militaryLines.length > 0) {
    const { dates, rest } = extractDatesFromLine(militaryLines[0] || '');
    const bullets = militaryLines.slice(1).map(sanitizeBulletText).filter(b => b.length > 0);
    militaryService.push({
      id: 'mil-1',
      role: rest || 'שירות צבאי / בטחוני',
      unit: 'צה״ל',
      date: dates || '2014 - 2017',
      descriptions: bullets.length > 0 ? bullets : ['שירות צבאי משמעותי בתחום הטכנולוגי והמבצעי.'],
    });
  }

  // 7. Parse Languages
  const languages: LanguageItem[] = [];
  for (let i = 0; i < languageLines.length; i++) {
    const line = languageLines[i];
    const parts = line.split(/[-:–|]/).map(p => p.trim());
    languages.push({
      id: `lang-${i + 1}`,
      language: parts[0] || line,
      proficiency: parts[1] || 'רמה מקצועית שוטפת',
    });
  }

  return {
    data: {
      profile: {
        name: candidateName || 'ישראל ישראלי',
        title: candidateTitle || 'מהנדס תוכנה / מומחה מערכות',
        email: contact.email || 'israel.israeli@example.com',
        phone: contact.phone || '054-1234567',
        location: candidateLocation || 'תל אביב, ישראל',
        url: '',
        linkedin: contact.linkedin || '',
        github: contact.github || '',
        summary: summaryLines.join(' ') || '',
      },
      workExperiences,
      educations,
      skills,
      militaryService,
      languages,
    },
    diagnostic: {
      detectedSections,
      extractedJobCount: workExperiences.length,
      extractedBulletCount: bulletCount,
    },
  };
}
