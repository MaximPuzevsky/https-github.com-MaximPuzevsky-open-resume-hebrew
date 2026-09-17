import React from 'react';
import { Download, Upload, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { ResumeData } from '../../types/resume';
import { defaultHebrewResume } from '../../lib/sampleResume';

interface ResumeControlBarProps {
  scale: number;
  setScale: (scale: number | ((prev: number) => number)) => void;
  resume: ResumeData;
  onImportClick: () => void;
  onResetResume: () => void;
}

export const ResumeControlBar: React.FC<ResumeControlBarProps> = ({
  scale,
  setScale,
  resume,
  onImportClick,
  onResetResume,
}) => {
  const handleZoomIn = () => {
    setScale(prev => Math.min(1.5, Math.round((prev + 0.1) * 10) / 10));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(0.5, Math.round((prev - 0.1) * 10) / 10));
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-xs gap-3">
      {/* Zoom controls */}
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={scale <= 0.5}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 transition-colors text-gray-700"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="font-mono text-xs font-semibold w-10 text-center select-none text-gray-800">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={handleZoomIn}
          disabled={scale >= 1.5}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 transition-colors text-gray-700"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Action buttons matching OpenResume: Import Resume & Export PDF */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onResetResume}
          className="p-1.5 rounded text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          title="Reset to sample resume"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onImportClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Import</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadPDF}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
};
