import React, { useState, useRef } from 'react';
import { ResumeData, PDFParseDiagnostic } from '../../types/resume';
import { extractPDFRawLines, parseHebrewResumeLines } from '../../lib/pdfParser';
import { defaultHebrewResume } from '../../lib/sampleResume';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  RefreshCw,
  Eye,
  FileCheck,
  Code,
} from 'lucide-react';

interface PDFImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (resume: ResumeData) => void;
}

export const PDFImportModal: React.FC<PDFImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [parsedResume, setParsedResume] = useState<ResumeData | null>(null);
  const [diagnostic, setDiagnostic] = useState<PDFParseDiagnostic | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<'parsed' | 'raw'>('parsed');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setErrorMsg(null);
    setParsedResume(null);
    setDiagnostic(null);

    try {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        const text = await file.text();
        const json = JSON.parse(text) as ResumeData;
        if (!json.profile) {
          throw new Error('קובץ ה-JSON אינו במבנה קורות חיים מוכר.');
        }
        setParsedResume(json);
        setDiagnostic({
          totalPages: 1,
          totalTextItems: 100,
          detectedReversedHebrew: false,
          detectedSections: ['profile', 'experience', 'education', 'skills'],
          extractedJobCount: json.workExperiences?.length || 0,
          extractedBulletCount: json.workExperiences?.reduce((acc, j) => acc + (j.descriptions?.length || 0), 0) || 0,
          rawTextPreview: JSON.stringify(json.profile, null, 2),
        });
        setIsProcessing(false);
        return;
      }

      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const buffer = await file.arrayBuffer();
        const { lines, diagnostic: rawDiag } = await extractPDFRawLines(buffer);

        if (lines.length === 0) {
          throw new Error('לא נמצאו תווים הניתנים לחילוץ בקובץ PDF זה (יתכן שמדובר במסמך סרוק ללא שכבת טקסט OCR).');
        }

        const { data, diagnostic: parseDiag } = parseHebrewResumeLines(lines);

        // Merge parsed data with default settings
        const fullResume: ResumeData = {
          ...defaultHebrewResume,
          ...data,
          profile: {
            ...defaultHebrewResume.profile,
            ...(data.profile || {}),
          },
          workExperiences: data.workExperiences || [],
          educations: data.educations || [],
          skills: data.skills || [],
          militaryService: data.militaryService || [],
          languages: data.languages || [],
          projects: data.projects || [],
          settings: {
            ...defaultHebrewResume.settings,
            fontFamily: 'David',
            fontSizePt: 11,
          },
        };

        setParsedResume(fullResume);
        setDiagnostic({
          totalPages: rawDiag.totalPages || 1,
          totalTextItems: rawDiag.totalTextItems || lines.length,
          detectedReversedHebrew: !!rawDiag.detectedReversedHebrew,
          detectedSections: parseDiag.detectedSections || [],
          extractedJobCount: parseDiag.extractedJobCount || 0,
          extractedBulletCount: parseDiag.extractedBulletCount || 0,
          rawTextPreview: rawDiag.rawTextPreview || '',
        });
      } else {
        throw new Error('סוג קובץ לא נתמך. אנא בחר קובץ PDF או קובץ JSON.');
      }
    } catch (err: any) {
      console.error('PDF parsing error:', err);
      setErrorMsg(err.message || 'אירעה שגיאה בעיבוד הקובץ.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleApply = () => {
    if (parsedResume) {
      onImport(parsedResume);
      onClose();
    }
  };

  const handleLoadSample = () => {
    setParsedResume(defaultHebrewResume);
    setDiagnostic({
      totalPages: 1,
      totalTextItems: 340,
      detectedReversedHebrew: false,
      detectedSections: ['תמצית', 'ניסיון מקצועי', 'שירות צבאי', 'השכלה', 'מיומנויות', 'שפות', 'פרויקטים'],
      extractedJobCount: defaultHebrewResume.workExperiences.length,
      extractedBulletCount: defaultHebrewResume.workExperiences.reduce((a, b) => a + b.descriptions.length, 0),
      rawTextPreview: 'מקסים פוזבסקי | מהנדס תוכנה ומערכות תקשורת L2/L3 | Spectrum Analyzer',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div
        dir="rtl"
        className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden flex flex-col my-8 text-right"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gray-100 text-gray-700 rounded-lg">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">יבוא קורות חיים (Import Resume)</h2>
              <p className="text-xs text-gray-500">
                העלאת קובץ PDF או JSON לפענוח אוטומטי ומילוי הטופס
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Upload Dropzone */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 hover:border-blue-500 hover:bg-blue-50/40 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.json"
              className="hidden"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  processFile(e.target.files[0]);
                }
              }}
            />
            <div className="w-12 h-12 rounded-full bg-stone-100 group-hover:bg-blue-100 text-stone-600 group-hover:text-blue-700 flex items-center justify-center transition-colors">
              {isProcessing ? (
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              ) : (
                <FileText className="w-6 h-6" />
              )}
            </div>
            <div className="text-sm font-semibold text-stone-800">
              {isProcessing ? 'מעבד ומנתח קובץ בעברית...' : 'גרור לכאן קובץ PDF או JSON, או לחץ לבחירה'}
            </div>
            <p className="text-xs text-stone-500 max-w-md">
              תומך בקובצי PDF בעברית מכל מקור (כולל עברית הפוכה, טבלאות, עמודות וטקסט טכני משולב אנגלית).
            </p>

            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                handleLoadSample();
              }}
              className="mt-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              הדגם פענוח על קובץ קו״ח טכנולוגי (Sample CV)
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div>
                <strong>שגיאה בפענוח:</strong> {errorMsg}
              </div>
            </div>
          )}

          {/* Diagnostic & Parsed Results Box */}
          {diagnostic && parsedResume && (
            <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50/50">
              {/* Diagnostic Badges */}
              <div className="p-3 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>הפענוח הושלם בהצלחה</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                    עמודים: {diagnostic.totalPages}
                  </span>
                  <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                    מקומות עבודה: {diagnostic.extractedJobCount}
                  </span>
                  <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                    נקודות Bullet: {diagnostic.extractedBulletCount}
                  </span>
                  {diagnostic.detectedReversedHebrew && (
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300 font-medium">
                      עברית הפוכה (Visual) תוקנה אוטומטית ל-Logical
                    </span>
                  )}
                </div>
              </div>

              {/* Section Tags */}
              <div className="px-4 py-2 bg-stone-100/60 border-b border-stone-200 flex items-center gap-2 text-xs text-stone-600">
                <span className="font-semibold text-stone-700">סעיפים שזוהו:</span>
                <div className="flex flex-wrap gap-1">
                  {diagnostic.detectedSections.map((s, i) => (
                    <span key={i} className="bg-white border border-stone-300 px-2 py-0.5 rounded text-[11px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Parsed Summary Preview */}
              <div className="p-4 bg-white text-xs space-y-2 max-h-48 overflow-y-auto">
                <div className="font-bold text-stone-900 text-sm">
                  {parsedResume.profile.name} — {parsedResume.profile.title}
                </div>
                {parsedResume.profile.summary && (
                  <p className="text-stone-700 line-clamp-2" dir="auto">
                    {parsedResume.profile.summary}
                  </p>
                )}
                <div className="pt-2 border-t border-stone-100 text-stone-600 space-y-1">
                  <div className="font-semibold text-stone-800">דוגמה לתפקידים שחולצו:</div>
                  {parsedResume.workExperiences.slice(0, 3).map((job, idx) => (
                    <div key={idx} className="flex items-baseline gap-2">
                      <span className="text-blue-700 font-bold">•</span>
                      <span className="font-semibold text-stone-800">{job.jobTitle}</span>
                      <span className="text-stone-500">({job.company}, {job.date})</span>
                      <span className="text-stone-400 text-[11px] font-mono">[{job.descriptions.length} bullets]</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg transition-colors"
          >
            ביטול
          </button>
          <button
            type="button"
            disabled={!parsedResume}
            onClick={handleApply}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-40 disabled:hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            <FileCheck className="w-4 h-4" />
            החל קורות חיים אלו על העורך
          </button>
        </div>
      </div>
    </div>
  );
};
