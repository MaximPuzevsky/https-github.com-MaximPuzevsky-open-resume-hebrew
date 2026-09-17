import React from 'react';

interface BiDiTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  containerClassName?: string;
}

export const BiDiTextarea: React.FC<BiDiTextareaProps> = ({
  label,
  helperText,
  id,
  value = '',
  onChange,
  className = '',
  containerClassName = '',
  placeholder,
  rows = 3,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-gray-700 select-none">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        dir="auto"
        style={{ unicodeBidi: 'plaintext' }}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-md border border-gray-300 bg-white p-3 text-sm text-gray-900 leading-relaxed transition-colors focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 ${className}`}
        {...props}
      />
      {helperText && <p className="text-[11px] text-gray-500">{helperText}</p>}
    </div>
  );
};
