import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface BiDiBulletEditorProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
  label?: string;
  placeholder?: string;
}

export const BiDiBulletEditor: React.FC<BiDiBulletEditorProps> = ({
  bullets = [],
  onChange,
  label = 'נקודות מפתח והישגים (Bullet Points)',
  placeholder = 'לדוגמה: פיתוח מודולים ב-Python ו-C++ תוך אינטגרציה עם Spectrum Analyzer...',
}) => {
  const handleBulletChange = (index: number, val: string) => {
    const updated = [...bullets];
    updated[index] = val;
    onChange(updated);
  };

  const handleAddBullet = () => {
    onChange([...bullets, '']);
  };

  const handleDeleteBullet = (index: number) => {
    const updated = bullets.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= bullets.length) return;
    const updated = [...bullets];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-2 text-right">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-stone-700 select-none">
          {label} ({bullets.length})
        </label>
        <button
          type="button"
          onClick={handleAddBullet}
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          הוסף נקודה (Bullet)
        </button>
      </div>

      <div className="space-y-2">
        {bullets.length === 0 ? (
          <div className="p-3 text-center border border-dashed border-stone-300 rounded-md bg-stone-50 text-xs text-stone-500">
            אין נקודות תיאור עדיין.{' '}
            <button
              type="button"
              onClick={handleAddBullet}
              className="text-blue-600 hover:underline font-medium"
            >
              לחץ כאן להוספת נקודת מפתח ראשונה
            </button>
          </div>
        ) : (
          bullets.map((bullet, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 bg-stone-50/70 p-2 rounded-md border border-stone-200/80 group hover:border-stone-300 transition-colors"
            >
              <div className="flex items-center gap-0.5 pt-2 text-stone-400">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="p-1 rounded hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent"
                  title="הזז למעלה"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  disabled={idx === bullets.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-1 rounded hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent"
                  title="הזז למטה"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1">
                <textarea
                  rows={2}
                  dir="auto"
                  style={{ unicodeBidi: 'plaintext' }}
                  value={bullet}
                  onChange={e => handleBulletChange(idx, e.target.value)}
                  placeholder={placeholder}
                  className="w-full text-sm bg-white border border-stone-200 rounded p-2 text-stone-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-y"
                />
              </div>

              <button
                type="button"
                onClick={() => handleDeleteBullet(idx)}
                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors mt-2"
                title="מחק נקודה זו"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
