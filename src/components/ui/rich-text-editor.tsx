import React from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
  id?: string;
  name?: string;
  error?: string;
}

/**
 * Simple Rich Text Editor component
 *
 * This component provides a basic textarea with some styling.
 * A more advanced WYSIWYG editor can be implemented later.
 */
const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  height = 400,
  placeholder = 'Start typing...',
  id,
  name,
  error
}) => {
  return (
    <div className="rich-text-editor">
      {/* Simple Textarea Editor */}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Start typing...'}
        style={{
          height: `${height}px`,
          width: '100%',
          backgroundColor: '#2d1e14',
          color: 'white',
          borderRadius: '0.375rem',
          border: '1px solid #7a4528',
          padding: '0.5rem',
          fontFamily: 'Inter, Arial, sans-serif',
          resize: 'vertical'
        }}
        className={`w-full rounded-md bg-[#2d1e14] border ${error ? 'border-red-500' : 'border-[#7a4528]/50'} px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]`}
      />

      {/* Error message */}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default RichTextEditor;
