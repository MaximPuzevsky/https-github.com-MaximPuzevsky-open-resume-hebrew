import { ResumeData } from '../types/resume';

/**
 * Standard High-Quality Hebrew Technical Resume Sample.
 * Demonstrates:
 * - Default typography: David 11pt
 * - Natural bidirectional mixed Hebrew/English terminology
 *   (e.g., "Spectrum Analyzer", "Python", "L2/L3", "AWS", "Kubernetes", "Docker")
 * - Classic Israeli CV sections: Profile, Summary, Experience, Military Service, Education, Skills, Languages
 */
export const defaultHebrewResume: ResumeData = {
  profile: {
    name: 'מקסים פוזבסקי',
    title: 'מהנדס תוכנה ומערכות תקשורת בכיר (Senior Software & Systems Engineer)',
    email: 'maxim.puzevsky@example.com',
    phone: '054-9876543',
    location: 'תל אביב - יפו, ישראל',
    url: 'https://maxim-tech.dev',
    linkedin: 'https://linkedin.com/in/maxim-puzevsky',
    github: 'https://github.com/MaximPuzevsky',
    summary:
      'מהנדס תוכנה ומומחה מערכות מנוסה עם מעל 8 שנות ניסיון בפיתוח תשתיות Low-Level, מערכות זמן אמת (Embedded Linux) ותקשורת נתונים L2/L3. מומחה בעבודה עם צב״ד ומערכות RF כולל Spectrum Analyzer ו-Oscilloscope. בעל יכולת הובלה טכנולוגית, ארכיטקטורת ענן מבוזרת ב-AWS ואינטגרציית מודלים מורכבים בשפות Python ו-C++.',
  },
  settings: {
    fontFamily: 'David', // David font family as global DEFAULT
    fontSizePt: 11, // 11pt base font size as DEFAULT
    themeColor: '#1e3a8a', // Deep corporate Israeli navy
    lineSpacing: 1.48,
    documentSize: 'A4',
    showMilitaryService: true,
    showProjects: true,
    showLanguages: true,
  },
  workExperiences: [
    {
      id: 'job-1',
      company: 'אלביט מערכות תקשוב וסייבר',
      jobTitle: 'ארכיטקט תוכנה ומוביל צוות פיתוח מערכות תקשורת L2/L3',
      date: '2021 - נוכחי',
      location: 'נתניה / הרצליה',
      descriptions: [
        'הובלת פיתוח מערכת ניתוב רשת מתקדמת ופרוטוקולי L2/L3 בסביבת Linux Kernel ו-C++ תוך עמידה ב-Latency נמוך מ-2ms.',
        'ביצוע בדיקות ואינטגרציה מעבדתית מקיפה באמצעות Spectrum Analyzer, Vector Signal Generator ו-Wireshark לניתוח שגיאות RF.',
        'תכנון ומימוש כלי אוטומציה ואנליזה ב-Python המקצרים את זמני הבדיקות ב-40% ומבצעים Parsing של Log Streams בזמן אמת.',
        'הטמעת תשתיות CI/CD מודרניות מבוססות Docker, Kubernetes ו-GitLab CI עבור צוות של 14 מהנדסים.',
      ],
    },
    {
      id: 'job-2',
      company: 'סיסקו מערכות (Cisco Systems Israel)',
      jobTitle: 'מהנדס תוכנה בכיר - Embedded Linux & Networking',
      date: '2018 - 2021',
      location: 'תל אביב',
      descriptions: [
        'פיתוח מודולי ליבה עבור מתגי תקשורת מתקדמים (Enterprise Switches) בשפות C ו-Python בסביבת Multi-threaded.',
        'עבודה הדוקה מול מהנדסי חומרה לאפיון וכיול ממשקי תקשורת מהירים באמצעות בדיקות בדיקת חומרה עם Logic Analyzer ו-Spectrum Analyzer.',
        'מיגרציית שירותי ניטור מקומיים לענן AWS באמצעות AWS Lambda, CloudWatch ו-Grafana Dashboards לניטור זמינות 99.99%.',
      ],
    },
    {
      id: 'job-3',
      company: 'אורקה אבטחת מידע וסייבר',
      jobTitle: 'מפתח Backend & Infrastructure',
      date: '2016 - 2018',
      location: 'תל אביב',
      descriptions: [
        'בניית Microservices לניתוח תעבורת רשת בזמן אמת באמצעות Python, Redis ו-PostgreSQL.',
        'הטמעת אלגוריתמי זיהוי חריגות ו-Intrusion Detection מותאמים אישית ברמת ה-Packet Capture.',
      ],
    },
  ],
  militaryService: [
    {
      id: 'mil-1',
      role: 'קצין ומפקד צוות פיתוח מערכות תקשוב מבצעיות (רס״ן במיל׳)',
      unit: 'יחידה טכנולוגית מבצעית, אגף התקשוב / חיל האוויר',
      date: '2012 - 2016',
      descriptions: [
        'הובלת צוות של 8 מפתחים וטכנאי רשת בפרויקט אסטרטגי לפיתוח מערכות C4I מבצעיות תחת תנאי שטח ולחץ גבוה.',
        'קבלת אות הצטיינות מפקד היחידה על תכנון והקמת תשתית תקשורת מוצפנת בעלת שרידות גבוהה.',
      ],
    },
  ],
  educations: [
    {
      id: 'edu-1',
      school: 'הטכניון - מכון טכנולוגי לישראל',
      degree: 'B.Sc. בהנדסת תוכנה ומערכות מידע',
      date: '2012 - 2016',
      gpa: 'ממוצע 91 (בהצטיינות)',
      descriptions: [
        'התמחות ברשתות תקשורת מחשבים ומערכות מבוזרות.',
        'פרויקט גמר: תכנון אלגוריתם Dynamic Routing מתקדם בסביבת SDN מבוססת OpenFlow.',
      ],
    },
  ],
  skills: [
    {
      id: 'skill-1',
      categoryName: 'שפות תכנות וליבה',
      skills: 'Python, C++, C, Go, Bash, TypeScript, SQL',
    },
    {
      id: 'skill-2',
      categoryName: 'תקשורת, פרוטוקולים וציוד מעבדה',
      skills: 'L2/L3 Networking, TCP/IP, BGP, OSPF, VLAN, Wireshark, Spectrum Analyzer, Oscilloscope, RF Signal Generator',
    },
    {
      id: 'skill-3',
      categoryName: 'ענן, תשתיות ו-DevOps',
      skills: 'Linux Kernel, Embedded Linux, Docker, Kubernetes, AWS (EC2, S3, Lambda, CloudWatch), CI/CD, Git',
    },
    {
      id: 'skill-4',
      categoryName: 'מתודולוגיות וכלים',
      skills: 'Agile/Scrum, System Architecture, Code Review, Jira, Confluence, Microservices',
    },
  ],
  languages: [
    {
      id: 'lang-1',
      language: 'עברית',
      proficiency: 'שפת אם',
    },
    {
      id: 'lang-2',
      language: 'אנגלית',
      proficiency: 'רמה מקצועית שוטפת (כולל כתיבת מפרטים טכניים והצגת מצגות בינלאומיות)',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'NetTrace-Analyzer - כלי קוד פתוח לניתוח ביצועי L2/L3',
      date: '2023',
      url: 'https://github.com/MaximPuzevsky/nettrace-analyzer',
      descriptions: [
        'כלי מבוסס Python ו-C++ לפענוח קובצי PCAP בזמן אמת והפקת דוחות ביצועים גרפיים עם זיהוי אנומליות ו-Packet Loss.',
      ],
    },
  ],
};
