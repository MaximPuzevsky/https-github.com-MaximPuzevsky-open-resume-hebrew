export type FontFamily = 'David' | 'Frank Ruhl' | 'Heebo' | 'Rubik' | 'Assistant';
export type DocumentSize = 'A4' | 'Letter';

export interface ResumeProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  url: string;
  linkedin: string;
  github: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  jobTitle: string;
  date: string;
  location: string;
  descriptions: string[];
}

export interface MilitaryService {
  id: string;
  role: string;
  unit: string;
  date: string;
  descriptions: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  date: string;
  gpa?: string;
  descriptions: string[];
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: string; // Comma separated or free text with technical terms
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  date?: string;
  url?: string;
  descriptions: string[];
}

export interface ResumeSettings {
  fontFamily: FontFamily;
  fontSizePt: number; // Default 11
  themeColor: string; // Accent color e.g. #1e3a8a or #2563eb
  lineSpacing: number; // e.g. 1.45
  documentSize: DocumentSize; // Default A4
  showMilitaryService: boolean;
  showProjects: boolean;
  showLanguages: boolean;
}

export interface ResumeData {
  profile: ResumeProfile;
  workExperiences: WorkExperience[];
  militaryService: MilitaryService[];
  educations: Education[];
  skills: SkillCategory[];
  languages: LanguageItem[];
  projects: ProjectItem[];
  settings: ResumeSettings;
}

export interface PDFParseDiagnostic {
  totalPages: number;
  totalTextItems: number;
  detectedReversedHebrew: boolean;
  detectedSections: string[];
  extractedJobCount: number;
  extractedBulletCount: number;
  rawTextPreview: string;
}
