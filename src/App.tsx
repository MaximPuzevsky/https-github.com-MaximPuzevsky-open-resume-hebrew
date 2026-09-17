import React, { useState, useEffect } from 'react';
import { ResumeData } from './types/resume';
import { defaultHebrewResume } from './lib/sampleResume';
import { ResumeEditor } from './components/resume/ResumeEditor';
import { ResumePreview } from './components/resume/ResumePreview';
import { ResumeControlBar } from './components/resume/ResumeControlBar';
import { PDFImportModal } from './components/resume/PDFImportModal';
import { FileText, Eye, Edit3, Columns } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'open-resume-hebrew-data-v1';

export default function App() {
  // Navigation tab for OpenResume: Resume Builder vs Resume Parser
  const [navTab, setNavTab] = useState<'builder' | 'parser'>('builder');

  // Preview zoom scale state (default 100%)
  const [scale, setScale] = useState<number>(1.0);

  // Mobile/desktop view modes: split, editor, or preview
  const [activeView, setActiveView] = useState<'split' | 'editor' | 'preview'>('split');

  // Import PDF modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Initialize resume state with David 11pt default settings
  const [resume, setResume] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultHebrewResume,
          ...parsed,
          settings: {
            ...defaultHebrewResume.settings,
            fontFamily: 'David',
            fontSizePt: 11,
            ...(parsed.settings || {}),
          },
        };
      }
    } catch {
      // Fallback
    }
    return {
      ...defaultHebrewResume,
      settings: {
        ...defaultHebrewResume.settings,
        fontFamily: 'David',
        fontSizePt: 11,
      },
    };
  });

  // Auto-save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resume));
    } catch {
      // Ignore quota errors
    }
  }, [resume]);

  const handleResetResume = () => {
    if (window.confirm('האם לאפס את תוכן קורות החיים לדוגמה המקורית?')) {
      setResume({
        ...defaultHebrewResume,
        settings: {
          ...defaultHebrewResume.settings,
          fontFamily: 'David',
          fontSizePt: 11,
        },
      });
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      {/* 1. Standard OpenResume Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">OpenResume</span>
            </div>

            {/* Navigation Tabs matching original OpenResume */}
            <nav className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                onClick={() => setNavTab('builder')}
                className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  navTab === 'builder'
                    ? 'text-blue-600 font-semibold bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Resume Builder
              </button>
              <button
                type="button"
                onClick={() => {
                  setNavTab('parser');
                  setIsImportModalOpen(true);
                }}
                className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  navTab === 'parser'
                    ? 'text-blue-600 font-semibold bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Resume Parser
              </button>
            </nav>
          </div>

          {/* View Toggles for Responsive Screen sizes */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs">
            <button
              type="button"
              onClick={() => setActiveView('split')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                activeView === 'split' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                activeView === 'editor' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                activeView === 'preview' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Two-Column OpenResume Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Editor */}
          <div
            className={`transition-all ${
              activeView === 'split'
                ? 'lg:col-span-6 block'
                : activeView === 'editor'
                ? 'lg:col-span-12 block'
                : 'hidden'
            } no-print`}
          >
            <ResumeEditor resume={resume} onChange={setResume} />
          </div>

          {/* Right Column: PDF Preview with ResumeControlBar */}
          <div
            className={`transition-all ${
              activeView === 'split'
                ? 'lg:col-span-6 block'
                : activeView === 'preview'
                ? 'lg:col-span-12 block'
                : 'hidden'
            } flex flex-col gap-3`}
          >
            {/* Control Bar: Zoom slider + Import + Download PDF */}
            <div className="no-print">
              <ResumeControlBar
                scale={scale}
                setScale={setScale}
                resume={resume}
                onImportClick={() => setIsImportModalOpen(true)}
                onResetResume={handleResetResume}
              />
            </div>

            {/* Document Render Area with real-time scale */}
            <div className="flex justify-center overflow-x-auto p-2 bg-gray-200/50 rounded-lg border border-gray-200/70 min-h-[600px]">
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out',
                }}
              >
                <ResumePreview resume={resume} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 1:1 Vector Print Document Container */}
      <div className="print-only hidden">
        <ResumePreview resume={resume} />
      </div>

      {/* PDF / JSON Import Modal */}
      <PDFImportModal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setNavTab('builder');
        }}
        onImport={imported => {
          setResume({
            ...imported,
            settings: {
              ...imported.settings,
              fontFamily: 'David',
              fontSizePt: 11,
            },
          });
          setNavTab('builder');
        }}
      />
    </div>
  );
}
