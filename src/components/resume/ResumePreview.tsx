import React from 'react';
import { ResumeData } from '../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface ResumePreviewProps {
  resume: ResumeData;
  className?: string;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ resume, className = '' }) => {
  const { profile, workExperiences, educations, skills, militaryService, languages, projects, settings } = resume;
  const { fontFamily, fontSizePt, themeColor, lineSpacing, documentSize } = settings;

  // Font family class mapping
  const fontClass =
    fontFamily === 'David'
      ? 'font-david'
      : fontFamily === 'Frank Ruhl'
      ? 'font-frank'
      : fontFamily === 'Heebo'
      ? 'font-heebo'
      : fontFamily === 'Rubik'
      ? 'font-rubik'
      : 'font-assistant';

  // Proportional typography scales based on base fontSizePt (default 11pt)
  const baseSize = fontSizePt || 11;
  const nameSize = `${baseSize * 1.95}pt`; // ~21.5pt
  const subtitleSize = `${baseSize * 1.15}pt`; // ~12.6pt
  const sectionHeaderSize = `${baseSize * 1.22}pt`; // ~13.4pt
  const itemTitleSize = `${baseSize * 1.05}pt`; // ~11.5pt
  const bodySize = `${baseSize}pt`; // exactly 11pt
  const smallSize = `${baseSize * 0.9}pt`; // ~9.9pt

  return (
    <div
      id="resume-document"
      dir="rtl"
      className={`a4-page shadow-md border border-stone-200 transition-all text-stone-900 ${fontClass} ${className}`}
      style={{
        lineHeight: lineSpacing || 1.48,
        padding: '16mm 18mm 16mm 18mm',
        minHeight: documentSize === 'A4' ? '297mm' : '11in',
        width: documentSize === 'A4' ? '210mm' : '8.5in',
      }}
    >
      {/* 1. Header / Profile Details */}
      <header className="border-b-2 pb-4 mb-4" style={{ borderColor: themeColor }}>
        <h1
          className="font-bold tracking-tight text-stone-950 mb-1"
          style={{ fontSize: nameSize, lineHeight: 1.15 }}
          dir="auto"
        >
          {profile.name}
        </h1>

        {profile.title && (
          <p
            className="font-semibold text-stone-700 mb-2.5"
            style={{ fontSize: subtitleSize }}
            dir="auto"
          >
            {profile.title}
          </p>
        )}

        {/* Contact Strip */}
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-stone-600"
          style={{ fontSize: smallSize }}
        >
          {profile.phone && (
            <div className="inline-flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span dir="ltr" className="font-mono">{profile.phone}</span>
            </div>
          )}

          {profile.email && (
            <div className="inline-flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <a href={`mailto:${profile.email}`} dir="ltr" className="hover:underline">
                {profile.email}
              </a>
            </div>
          )}

          {profile.location && (
            <div className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span dir="auto">{profile.location}</span>
            </div>
          )}

          {profile.linkedin && (
            <div className="inline-flex items-center gap-1">
              <Linkedin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <a
                href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                target="_blank"
                rel="noreferrer"
                dir="ltr"
                className="hover:underline"
              >
                {profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'in/')}
              </a>
            </div>
          )}

          {profile.github && (
            <div className="inline-flex items-center gap-1">
              <Github className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <a
                href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`}
                target="_blank"
                rel="noreferrer"
                dir="ltr"
                className="hover:underline"
              >
                {profile.github.replace(/^https?:\/\/(www\.)?github\.com\//, 'gh/')}
              </a>
            </div>
          )}

          {profile.url && (
            <div className="inline-flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <a
                href={profile.url.startsWith('http') ? profile.url : `https://${profile.url}`}
                target="_blank"
                rel="noreferrer"
                dir="ltr"
                className="hover:underline"
              >
                {profile.url.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>
      </header>

      {/* 2. Professional Summary (תמצית מקצועית) */}
      {profile.summary && (
        <section className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b border-stone-200"
            style={{ fontSize: sectionHeaderSize, color: themeColor }}
          >
            תמצית מקצועית
          </h2>
          <p
            dir="auto"
            style={{ fontSize: bodySize, unicodeBidi: 'plaintext' }}
            className="text-stone-800 text-justify leading-relaxed"
          >
            {profile.summary}
          </p>
        </section>
      )}

      {/* 3. Work Experience (ניסיון מקצועי) */}
      {workExperiences.length > 0 && (
        <section className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider mb-2 pb-0.5 border-b border-stone-200"
            style={{ fontSize: sectionHeaderSize, color: themeColor }}
          >
            ניסיון מקצועי
          </h2>

          <div className="space-y-3">
            {workExperiences.map(job => (
              <div key={job.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline gap-2 mb-0.5">
                  <div className="flex flex-wrap items-baseline gap-1.5" dir="auto">
                    <span className="font-bold text-stone-900" style={{ fontSize: itemTitleSize }}>
                      {job.jobTitle}
                    </span>
                    <span className="text-stone-400 font-normal">|</span>
                    <span className="font-semibold text-stone-800" style={{ fontSize: bodySize }}>
                      {job.company}
                    </span>
                    {job.location && (
                      <span className="text-stone-500 text-xs font-normal">({job.location})</span>
                    )}
                  </div>
                  <div
                    className="shrink-0 text-stone-600 font-medium font-mono text-left"
                    style={{ fontSize: smallSize }}
                    dir="ltr"
                  >
                    {job.date}
                  </div>
                </div>

                {/* Bullet Points with strict RTL marker and BiDi content isolation */}
                {job.descriptions && job.descriptions.length > 0 && (
                  <ul className="mt-1 space-y-1">
                    {job.descriptions.map((desc, i) => (
                      <li key={i} className="resume-bullet-item" style={{ fontSize: bodySize }}>
                        <span className="resume-bullet-marker" style={{ color: themeColor }}>•</span>
                        <div
                          className="resume-bullet-content"
                          dir="auto"
                          style={{ unicodeBidi: 'plaintext' }}
                        >
                          {desc}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Military Service (שירות צבאי / לאומי) */}
      {settings.showMilitaryService && militaryService && militaryService.length > 0 && (
        <section className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider mb-2 pb-0.5 border-b border-stone-200"
            style={{ fontSize: sectionHeaderSize, color: themeColor }}
          >
            שירות צבאי / בטחוני
          </h2>

          <div className="space-y-2">
            {militaryService.map(mil => (
              <div key={mil.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline gap-2 mb-0.5">
                  <div className="flex flex-wrap items-baseline gap-1.5" dir="auto">
                    <span className="font-bold text-stone-900" style={{ fontSize: itemTitleSize }}>
                      {mil.role}
                    </span>
                    {mil.unit && (
                      <>
                        <span className="text-stone-400 font-normal">|</span>
                        <span className="font-medium text-stone-800" style={{ fontSize: bodySize }}>
                          {mil.unit}
                        </span>
                      </>
                    )}
                  </div>
                  <div
                    className="shrink-0 text-stone-600 font-medium font-mono text-left"
                    style={{ fontSize: smallSize }}
                    dir="ltr"
                  >
                    {mil.date}
                  </div>
                </div>

                {mil.descriptions && mil.descriptions.length > 0 && (
                  <ul className="mt-1 space-y-1">
                    {mil.descriptions.map((desc, i) => (
                      <li key={i} className="resume-bullet-item" style={{ fontSize: bodySize }}>
                        <span className="resume-bullet-marker" style={{ color: themeColor }}>•</span>
                        <div
                          className="resume-bullet-content"
                          dir="auto"
                          style={{ unicodeBidi: 'plaintext' }}
                        >
                          {desc}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Education (השכלה) */}
      {educations.length > 0 && (
        <section className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider mb-2 pb-0.5 border-b border-stone-200"
            style={{ fontSize: sectionHeaderSize, color: themeColor }}
          >
            השכלה והסמכות
          </h2>

          <div className="space-y-2">
            {educations.map(edu => (
              <div key={edu.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline gap-2 mb-0.5">
                  <div className="flex flex-wrap items-baseline gap-1.5" dir="auto">
                    <span className="font-bold text-stone-900" style={{ fontSize: itemTitleSize }}>
                      {edu.degree}
                    </span>
                    <span className="text-stone-400 font-normal">|</span>
                    <span className="font-semibold text-stone-800" style={{ fontSize: bodySize }}>
                      {edu.school}
                    </span>
                    {edu.gpa && (
                      <span className="text-stone-600 font-medium text-xs">({edu.gpa})</span>
                    )}
                  </div>
                  <div
                    className="shrink-0 text-stone-600 font-medium font-mono text-left"
                    style={{ fontSize: smallSize }}
                    dir="ltr"
                  >
                    {edu.date}
                  </div>
                </div>

                {edu.descriptions && edu.descriptions.length > 0 && (
                  <ul className="mt-1 space-y-1">
                    {edu.descriptions.map((desc, i) => (
                      <li key={i} className="resume-bullet-item" style={{ fontSize: bodySize }}>
                        <span className="resume-bullet-marker" style={{ color: themeColor }}>•</span>
                        <div
                          className="resume-bullet-content"
                          dir="auto"
                          style={{ unicodeBidi: 'plaintext' }}
                        >
                          {desc}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Skills (מיומנויות וטכנולוגיות) */}
      {skills.length > 0 && (
        <section className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider mb-2 pb-0.5 border-b border-stone-200"
            style={{ fontSize: sectionHeaderSize, color: themeColor }}
          >
            מיומנויות וטכנולוגיות
          </h2>

          <div className="space-y-1.5">
            {skills.map(sk => (
              <div key={sk.id} className="flex items-baseline gap-2" style={{ fontSize: bodySize }}>
                <span className="font-bold text-stone-900 shrink-0 select-none" dir="auto">
                  {sk.categoryName}:
                </span>
                <span
                  className="text-stone-800"
                  dir="auto"
                  style={{ unicodeBidi: 'plaintext' }}
                >
                  {sk.skills}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Projects (פרויקטים נוספים) */}
      {settings.showProjects && projects && projects.length > 0 && (
        <section className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider mb-2 pb-0.5 border-b border-stone-200"
            style={{ fontSize: sectionHeaderSize, color: themeColor }}
          >
            פרויקטים נבחרים
          </h2>

          <div className="space-y-2">
            {projects.map(proj => (
              <div key={proj.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline gap-2 mb-0.5">
                  <div className="flex flex-wrap items-baseline gap-1.5" dir="auto">
                    <span className="font-bold text-stone-900" style={{ fontSize: itemTitleSize }}>
                      {proj.title}
                    </span>
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 hover:underline text-xs"
                        dir="ltr"
                      >
                        ({proj.url.replace(/^https?:\/\//, '')})
                      </a>
                    )}
                  </div>
                  {proj.date && (
                    <div
                      className="shrink-0 text-stone-600 font-medium font-mono text-left"
                      style={{ fontSize: smallSize }}
                      dir="ltr"
                    >
                      {proj.date}
                    </div>
                  )}
                </div>

                {proj.descriptions && proj.descriptions.length > 0 && (
                  <ul className="mt-1 space-y-1">
                    {proj.descriptions.map((desc, i) => (
                      <li key={i} className="resume-bullet-item" style={{ fontSize: bodySize }}>
                        <span className="resume-bullet-marker" style={{ color: themeColor }}>•</span>
                        <div
                          className="resume-bullet-content"
                          dir="auto"
                          style={{ unicodeBidi: 'plaintext' }}
                        >
                          {desc}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Languages (שפות) */}
      {settings.showLanguages && languages && languages.length > 0 && (
        <section className="mb-2">
          <h2
            className="font-bold uppercase tracking-wider mb-2 pb-0.5 border-b border-stone-200"
            style={{ fontSize: sectionHeaderSize, color: themeColor }}
          >
            שפות
          </h2>

          <div className="flex flex-wrap gap-x-6 gap-y-1" style={{ fontSize: bodySize }}>
            {languages.map(lang => (
              <div key={lang.id} className="inline-flex items-baseline gap-1.5" dir="auto">
                <span className="font-bold text-stone-900">{lang.language}:</span>
                <span className="text-stone-700">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
