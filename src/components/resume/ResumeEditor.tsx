import React, { useState } from 'react';
import { ResumeData, WorkExperience, Education, SkillCategory, MilitaryService, LanguageItem, ProjectItem } from '../../types/resume';
import { BiDiInput } from '../bidi/BiDiInput';
import { BiDiTextarea } from '../bidi/BiDiTextarea';
import { BiDiBulletEditor } from '../bidi/BiDiBulletEditor';
import {
  User,
  FileText,
  Briefcase,
  Shield,
  GraduationCap,
  Wrench,
  Languages,
  FolderGit2,
  Plus,
  Trash2,
} from 'lucide-react';

interface ResumeEditorProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
}

type TabType = 'profile' | 'summary' | 'experience' | 'military' | 'education' | 'skills' | 'languages' | 'projects';

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ resume, onChange }) => {
  const [activeTab, setActiveTab] = useState<TabType>('experience');

  const { profile, workExperiences, militaryService, educations, skills, languages, projects } = resume;

  // Profile update helper
  const updateProfile = (field: keyof typeof profile, val: string) => {
    onChange({
      ...resume,
      profile: {
        ...profile,
        [field]: val,
      },
    });
  };

  // Work Experience helpers
  const handleAddJob = () => {
    const newJob: WorkExperience = {
      id: `job-${Date.now()}`,
      company: '',
      jobTitle: '',
      date: '2022 - נוכחי',
      location: '',
      descriptions: [''],
    };
    onChange({
      ...resume,
      workExperiences: [newJob, ...workExperiences],
    });
  };

  const updateJob = (id: string, updated: Partial<WorkExperience>) => {
    onChange({
      ...resume,
      workExperiences: workExperiences.map(job => (job.id === id ? { ...job, ...updated } : job)),
    });
  };

  const deleteJob = (id: string) => {
    onChange({
      ...resume,
      workExperiences: workExperiences.filter(job => job.id !== id),
    });
  };

  // Military Service helpers
  const handleAddMilitary = () => {
    const newMil: MilitaryService = {
      id: `mil-${Date.now()}`,
      role: '',
      unit: '',
      date: '',
      descriptions: [''],
    };
    onChange({
      ...resume,
      militaryService: [...militaryService, newMil],
    });
  };

  const updateMilitary = (id: string, updated: Partial<MilitaryService>) => {
    onChange({
      ...resume,
      militaryService: militaryService.map(m => (m.id === id ? { ...m, ...updated } : m)),
    });
  };

  const deleteMilitary = (id: string) => {
    onChange({
      ...resume,
      militaryService: militaryService.filter(m => m.id !== id),
    });
  };

  // Education helpers
  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      school: '',
      degree: '',
      date: '',
      descriptions: [],
    };
    onChange({
      ...resume,
      educations: [...educations, newEdu],
    });
  };

  const updateEducation = (id: string, updated: Partial<Education>) => {
    onChange({
      ...resume,
      educations: educations.map(edu => (edu.id === id ? { ...edu, ...updated } : edu)),
    });
  };

  const deleteEducation = (id: string) => {
    onChange({
      ...resume,
      educations: educations.filter(edu => edu.id !== id),
    });
  };

  // Skills helpers
  const handleAddSkillCategory = () => {
    const newSkill: SkillCategory = {
      id: `skill-${Date.now()}`,
      categoryName: 'קטגוריית מיומנות חדשה',
      skills: '',
    };
    onChange({
      ...resume,
      skills: [...skills, newSkill],
    });
  };

  const updateSkillCategory = (id: string, updated: Partial<SkillCategory>) => {
    onChange({
      ...resume,
      skills: skills.map(s => (s.id === id ? { ...s, ...updated } : s)),
    });
  };

  const deleteSkillCategory = (id: string) => {
    onChange({
      ...resume,
      skills: skills.filter(s => s.id !== id),
    });
  };

  // Languages helpers
  const handleAddLanguage = () => {
    const newLang: LanguageItem = {
      id: `lang-${Date.now()}`,
      language: '',
      proficiency: 'רמה מקצועית שוטפת',
    };
    onChange({
      ...resume,
      languages: [...languages, newLang],
    });
  };

  const updateLanguage = (id: string, updated: Partial<LanguageItem>) => {
    onChange({
      ...resume,
      languages: languages.map(l => (l.id === id ? { ...l, ...updated } : l)),
    });
  };

  const deleteLanguage = (id: string) => {
    onChange({
      ...resume,
      languages: languages.filter(l => l.id !== id),
    });
  };

  // Projects helpers
  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: '',
      date: '',
      url: '',
      descriptions: [''],
    };
    onChange({
      ...resume,
      projects: [...projects, newProj],
    });
  };

  const updateProject = (id: string, updated: Partial<ProjectItem>) => {
    onChange({
      ...resume,
      projects: projects.map(p => (p.id === id ? { ...p, ...updated } : p)),
    });
  };

  const deleteProject = (id: string) => {
    onChange({
      ...resume,
      projects: projects.filter(p => p.id !== id),
    });
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'profile', label: 'פרטים אישיים', icon: <User className="w-4 h-4" /> },
    { id: 'summary', label: 'תמצית מקצועית', icon: <FileText className="w-4 h-4" /> },
    { id: 'experience', label: 'ניסיון מקצועי', icon: <Briefcase className="w-4 h-4" />, count: workExperiences.length },
    { id: 'military', label: 'שירות צבאי', icon: <Shield className="w-4 h-4" />, count: militaryService.length },
    { id: 'education', label: 'השכלה', icon: <GraduationCap className="w-4 h-4" />, count: educations.length },
    { id: 'skills', label: 'מיומנויות וכלים', icon: <Wrench className="w-4 h-4" />, count: skills.length },
    { id: 'languages', label: 'שפות', icon: <Languages className="w-4 h-4" />, count: languages.length },
    { id: 'projects', label: 'פרויקטים', icon: <FolderGit2 className="w-4 h-4" />, count: projects.length },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden flex flex-col h-full text-right">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-gray-50/80 overflow-x-auto p-1.5 gap-1 scrollbar-none">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all select-none ${
                isActive
                  ? 'bg-white text-blue-600 shadow-xs border border-gray-200 font-bold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Body */}
      <div className="p-5 overflow-y-auto max-h-[calc(100vh-220px)] space-y-4">
        {/* 1. Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <BiDiInput
                id="profile-name"
                label="שם מלא"
                value={profile.name}
                onChange={e => updateProfile('name', e.target.value)}
                placeholder="למשל: ישראל ישראלי"
              />
              <BiDiInput
                id="profile-title"
                label="תפקיד מקצועי / כותרת"
                value={profile.title}
                onChange={e => updateProfile('title', e.target.value)}
                placeholder="למשל: Senior Full Stack Engineer & Team Lead"
              />
              <BiDiInput
                id="profile-phone"
                label="טלפון"
                type="tel"
                value={profile.phone}
                onChange={e => updateProfile('phone', e.target.value)}
                placeholder="054-1234567"
              />
              <BiDiInput
                id="profile-email"
                label="דואר אלקטרוני"
                type="email"
                value={profile.email}
                onChange={e => updateProfile('email', e.target.value)}
                placeholder="israel@domain.com"
              />
              <BiDiInput
                id="profile-location"
                label="מיקום / עיר"
                value={profile.location}
                onChange={e => updateProfile('location', e.target.value)}
                placeholder="תל אביב, ישראל"
              />
              <BiDiInput
                id="profile-linkedin"
                label="קישור LinkedIn"
                value={profile.linkedin}
                onChange={e => updateProfile('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
              <BiDiInput
                id="profile-github"
                label="קישור GitHub"
                value={profile.github}
                onChange={e => updateProfile('github', e.target.value)}
                placeholder="https://github.com/username"
              />
              <BiDiInput
                id="profile-url"
                label="אתר אישי / תיק עבודות"
                value={profile.url}
                onChange={e => updateProfile('url', e.target.value)}
                placeholder="https://portfolio.dev"
              />
            </div>
          </div>
        )}

        {/* 2. Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-3">
            <BiDiTextarea
              id="profile-summary"
              label="תמצית מקצועית (Professional Summary)"
              rows={5}
              value={profile.summary}
              onChange={e => updateProfile('summary', e.target.value)}
              placeholder="פסקה תמציתית המציגה את מומחיותך, שנות ניסיון, תחומי הצטיינות וטכנולוגיות מרכזיות..."
              helperText="הטקסט יופיע בראש קורות החיים מתחת לפרטים האישיים."
            />
          </div>
        )}

        {/* 3. Work Experience Tab */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-700">מקומות עבודה ופרויקטים מקצועיים</h3>
              <button
                type="button"
                onClick={handleAddJob}
                className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                הוסף מקום עבודה
              </button>
            </div>

            {workExperiences.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-stone-200 rounded-lg text-stone-500 text-xs">
                לא הוזן ניסיון מקצועי עדיין. לחץ למעלה להוספת תפקיד ראשון.
              </div>
            ) : (
              workExperiences.map((job, idx) => (
                <div
                  key={job.id}
                  className="bg-stone-50/80 border border-stone-200 rounded-xl p-4 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <span className="text-xs font-bold text-stone-700">
                      תפקיד #{idx + 1}: {job.company || 'חברה חדשה'}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteJob(job.id)}
                      className="text-stone-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                      title="מחק מקום עבודה זה"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <BiDiInput
                      id={`job-title-${job.id}`}
                      label="כותרת תפקיד"
                      value={job.jobTitle}
                      onChange={e => updateJob(job.id, { jobTitle: e.target.value })}
                      placeholder="למשל: ארכיטקט תוכנה ומוביל צוות L2/L3"
                    />
                    <BiDiInput
                      id={`job-company-${job.id}`}
                      label="שם החברה / ארגון"
                      value={job.company}
                      onChange={e => updateJob(job.id, { company: e.target.value })}
                      placeholder="למשל: אלביט מערכות / סיסקו"
                    />
                    <BiDiInput
                      id={`job-date-${job.id}`}
                      label="תקופת עבודה (שנים / חודשים)"
                      value={job.date}
                      onChange={e => updateJob(job.id, { date: e.target.value })}
                      placeholder="2021 - נוכחי"
                    />
                    <BiDiInput
                      id={`job-loc-${job.id}`}
                      label="מיקום החברה"
                      value={job.location}
                      onChange={e => updateJob(job.id, { location: e.target.value })}
                      placeholder="תל אביב / הרצליה"
                    />
                  </div>

                  {/* Bullet Points specifically attached to this job block */}
                  <div className="pt-2 border-t border-stone-200/60">
                    <BiDiBulletEditor
                      bullets={job.descriptions}
                      onChange={bullets => updateJob(job.id, { descriptions: bullets })}
                      label="נקודות מפתח והישגים בתפקיד זה"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 4. Military Service Tab */}
        {activeTab === 'military' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-700">שירות צבאי / בטחוני / לאומי</h3>
              <button
                type="button"
                onClick={handleAddMilitary}
                className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                הוסף שירות צבאי
              </button>
            </div>

            {militaryService.map((mil, idx) => (
              <div key={mil.id} className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-xs font-bold text-stone-700">שירות #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => deleteMilitary(mil.id)}
                    className="text-stone-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <BiDiInput
                    id={`mil-role-${mil.id}`}
                    label="תפקיד צבאי / דרגה"
                    value={mil.role}
                    onChange={e => updateMilitary(mil.id, { role: e.target.value })}
                    placeholder="קצין ומפקד צוות פיתוח מערכות"
                  />
                  <BiDiInput
                    id={`mil-unit-${mil.id}`}
                    label="יחידה / חיל"
                    value={mil.unit}
                    onChange={e => updateMilitary(mil.id, { unit: e.target.value })}
                    placeholder="אגף התקשוב / 8200 / חיל האוויר"
                  />
                  <BiDiInput
                    id={`mil-date-${mil.id}`}
                    label="שנים"
                    value={mil.date}
                    onChange={e => updateMilitary(mil.id, { date: e.target.value })}
                    placeholder="2012 - 2016"
                  />
                </div>
                <div className="pt-2">
                  <BiDiBulletEditor
                    bullets={mil.descriptions}
                    onChange={bullets => updateMilitary(mil.id, { descriptions: bullets })}
                    label="פירוט תפקיד והישגים בשירות"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. Education Tab */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-700">השכלה, תארים והסמכות</h3>
              <button
                type="button"
                onClick={handleAddEducation}
                className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                הוסף מוסד לימודים
              </button>
            </div>

            {educations.map((edu, idx) => (
              <div key={edu.id} className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-xs font-bold text-stone-700">השכלה #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => deleteEducation(edu.id)}
                    className="text-stone-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <BiDiInput
                    id={`edu-deg-${edu.id}`}
                    label="תואר / תעודת הסמכה"
                    value={edu.degree}
                    onChange={e => updateEducation(edu.id, { degree: e.target.value })}
                    placeholder="B.Sc. בהנדסת תוכנה"
                  />
                  <BiDiInput
                    id={`edu-school-${edu.id}`}
                    label="מוסד לימודים"
                    value={edu.school}
                    onChange={e => updateEducation(edu.id, { school: e.target.value })}
                    placeholder="הטכניון / אוניברסיטת תל אביב"
                  />
                  <BiDiInput
                    id={`edu-date-${edu.id}`}
                    label="שנים"
                    value={edu.date}
                    onChange={e => updateEducation(edu.id, { date: e.target.value })}
                    placeholder="2012 - 2016"
                  />
                  <BiDiInput
                    id={`edu-gpa-${edu.id}`}
                    label="ציון / הצטיינות (אופציונלי)"
                    value={edu.gpa || ''}
                    onChange={e => updateEducation(edu.id, { gpa: e.target.value })}
                    placeholder="בהצטיינות (ממוצע 91)"
                  />
                </div>
                <div className="pt-2">
                  <BiDiBulletEditor
                    bullets={edu.descriptions}
                    onChange={bullets => updateEducation(edu.id, { descriptions: bullets })}
                    label="פרויקט גמר או קורסים בולטים"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 6. Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-700">מיומנויות וכלים טכנולוגיים</h3>
              <button
                type="button"
                onClick={handleAddSkillCategory}
                className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                הוסף קטגוריית כלים
              </button>
            </div>

            {skills.map((sk, idx) => (
              <div key={sk.id} className="bg-stone-50 border border-stone-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700">קטגוריה #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => deleteSkillCategory(sk.id)}
                    className="text-stone-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <BiDiInput
                      id={`skill-cat-${sk.id}`}
                      label="שם הקטגוריה"
                      value={sk.categoryName}
                      onChange={e => updateSkillCategory(sk.id, { categoryName: e.target.value })}
                      placeholder="שפות תכנות / תשתיות ענן"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <BiDiInput
                      id={`skill-val-${sk.id}`}
                      label="רשימת כלים (מופרדים בפסיקים)"
                      value={sk.skills}
                      onChange={e => updateSkillCategory(sk.id, { skills: e.target.value })}
                      placeholder="Python, C++, L2/L3, Spectrum Analyzer, Docker, AWS"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 7. Languages Tab */}
        {activeTab === 'languages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-700">שליטה בשפות</h3>
              <button
                type="button"
                onClick={handleAddLanguage}
                className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                הוסף שפה
              </button>
            </div>

            {languages.map((lang, idx) => (
              <div key={lang.id} className="flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-xl p-3">
                <div className="flex-1">
                  <BiDiInput
                    id={`lang-name-${lang.id}`}
                    label="שפה"
                    value={lang.language}
                    onChange={e => updateLanguage(lang.id, { language: e.target.value })}
                    placeholder="עברית / אנגלית"
                  />
                </div>
                <div className="flex-1">
                  <BiDiInput
                    id={`lang-prof-${lang.id}`}
                    label="רמת שליטה"
                    value={lang.proficiency}
                    onChange={e => updateLanguage(lang.id, { proficiency: e.target.value })}
                    placeholder="שפת אם / רמה מקצועית שוטפת"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => deleteLanguage(lang.id)}
                  className="text-stone-400 hover:text-red-600 p-2 rounded hover:bg-red-50 mt-4"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 8. Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-700">פרויקטים אישיים וקוד פתוח</h3>
              <button
                type="button"
                onClick={handleAddProject}
                className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                הוסף פרויקט
              </button>
            </div>

            {projects.map((proj, idx) => (
              <div key={proj.id} className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-xs font-bold text-stone-700">פרויקט #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => deleteProject(proj.id)}
                    className="text-stone-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <BiDiInput
                    id={`proj-title-${proj.id}`}
                    label="שם הפרויקט"
                    value={proj.title}
                    onChange={e => updateProject(proj.id, { title: e.target.value })}
                    placeholder="כלי ניתוח תעבורת רשת L2/L3"
                  />
                  <BiDiInput
                    id={`proj-url-${proj.id}`}
                    label="קישור (GitHub / אתר)"
                    value={proj.url || ''}
                    onChange={e => updateProject(proj.id, { url: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                  <BiDiInput
                    id={`proj-date-${proj.id}`}
                    label="תאריך"
                    value={proj.date || ''}
                    onChange={e => updateProject(proj.id, { date: e.target.value })}
                    placeholder="2023"
                  />
                </div>
                <div className="pt-2">
                  <BiDiBulletEditor
                    bullets={proj.descriptions}
                    onChange={bullets => updateProject(proj.id, { descriptions: bullets })}
                    label="תיאור הפרויקט והטכנולוגיות"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
