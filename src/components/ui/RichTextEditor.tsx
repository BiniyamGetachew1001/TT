import React, { useState, useEffect } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, Link, Image, 
  AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Quote
} from 'lucide-react';

interface RichTextEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialValue,
  onChange,
  placeholder = 'Start typing...',
  minHeight = '200px'
}) => {
  const [editorContent, setEditorContent] = useState(initialValue || '');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  
  // Update parent component when content changes
  useEffect(() => {
    onChange(editorContent);
  }, [editorContent, onChange]);
  
  // Format handlers
  const handleFormat = (format: string) => {
    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `**${getSelectedText()}**`;
        break;
      case 'italic':
        formattedText = `*${getSelectedText()}*`;
        break;
      case 'underline':
        formattedText = `<u>${getSelectedText()}</u>`;
        break;
      case 'h1':
        formattedText = `# ${getSelectedText()}`;
        break;
      case 'h2':
        formattedText = `## ${getSelectedText()}`;
        break;
      case 'ul':
        formattedText = getSelectedText().split('\n').map(line => `- ${line}`).join('\n');
        break;
      case 'ol':
        formattedText = getSelectedText().split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
        break;
      case 'quote':
        formattedText = getSelectedText().split('\n').map(line => `> ${line}`).join('\n');
        break;
      case 'alignLeft':
        formattedText = `<div style="text-align: left">${getSelectedText()}</div>`;
        break;
      case 'alignCenter':
        formattedText = `<div style="text-align: center">${getSelectedText()}</div>`;
        break;
      case 'alignRight':
        formattedText = `<div style="text-align: right">${getSelectedText()}</div>`;
        break;
      default:
        formattedText = getSelectedText();
    }
    
    insertText(formattedText);
  };
  
  // Get selected text from textarea
  const getSelectedText = () => {
    const textarea = document.getElementById('rich-text-editor') as HTMLTextAreaElement;
    if (!textarea) return '';
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    return textarea.value.substring(start, end) || 'Text here';
  };
  
  // Insert text at cursor position
  const insertText = (text: string) => {
    const textarea = document.getElementById('rich-text-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    const newContent = beforeText + text + afterText;
    setEditorContent(newContent);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + text.length;
      textarea.selectionEnd = start + text.length;
    }, 0);
  };
  
  // Handle link insertion
  const handleInsertLink = () => {
    if (linkUrl && linkText) {
      const linkMarkdown = `[${linkText}](${linkUrl})`;
      insertText(linkMarkdown);
      setShowLinkInput(false);
      setLinkUrl('');
      setLinkText('');
    }
  };
  
  // Handle image insertion
  const handleInsertImage = () => {
    if (imageUrl) {
      const imageMarkdown = `![${imageAlt || 'Image'}](${imageUrl})`;
      insertText(imageMarkdown);
      setShowImageInput(false);
      setImageUrl('');
      setImageAlt('');
    }
  };
  
  return (
    <div className="rich-text-editor border border-[#7a4528]/50 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="bg-[#2d1e14] border-b border-[#7a4528]/50 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className="p-1.5 rounded hover:bg-[#3a2819] transition-colors"
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className="p-1.5 rounded hover:bg-[#3a2819] transition-colors"
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('underline')}
          className="p-1.5 rounded hover:bg-[#3a2819] transition-colors"
          title="Underline"
        >
          <Underline size={16} />
        </button>
        
        <div className="h-6 mx-1 border-r border-[#7a4528]/50"></div>
        
        <button
          type="button"
          onClick={() => handleFormat('h1')}
          className="p-1.5 rounded hover:bg-[#3a2819] transition-colors"
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('h2')}
          className="p-1.5 rounded hover:bg-[#3a2819] transition-colors"
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        
        <div className="h-6 mx-1 border-r border-[#7a4528]/50"></div>
        
        <button
          type="button"
          onClick={() => handleFormat('ul')}
          className="p-1.5 rounded hover:bg-[#3a2819] transition-colors"
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('ol')}
          className="p-1.5 rounded hover:bg-[#3a2819] transition-colors"
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('quote')}
          className="p-1.5 rounded hover:bg-[#3a2819] transition-colors"
          title="Quote"
        >
          <Quote size={16} />
        </button>
        
        <div className="h-6 mx-1 border-r border-[#7a4528]/50"></div>
        
        <button
          type="button"
          onClick={() => setShowLinkInput(true)}
          className="p-1.5 rounded hover:bg-[#3a2819] transition-colors"
          title="Insert Link"
        >
          <Link size={16} />
        </button>
        <button
          type="button"
          onClick={() => setShowImageInput(true)}
          className="p-1.5 rounded hover:bg-[#3a2819] transition-colors"
          title="Insert Image"
        >
          <Image size={16} />
        </button>
        
        <div className="h-6 mx-1 border-r border-[#7a4528]/50"></div>
        
        <button
          type="button"
          onClick={() => handleFormat('alignLeft')}
          className="p-1.5 rounded hover:bg-[#3a2819] transition-colors"
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('alignCenter')}
          className="p-1.5 rounded hover:bg-[#3a2819] transition-colors"
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('alignRight')}
          className="p-1.5 rounded hover:bg-[#3a2819] transition-colors"
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
      </div>
      
      {/* Link Input */}
      {showLinkInput && (
        <div className="bg-[#2d1e14] border-b border-[#7a4528]/50 p-2 flex flex-wrap gap-2 items-center">
          <input
            type="text"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="Link text"
            className="flex-1 min-w-[150px] rounded-md bg-[#3a2819] border border-[#7a4528]/50 px-3 py-1 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
          />
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="URL"
            className="flex-1 min-w-[150px] rounded-md bg-[#3a2819] border border-[#7a4528]/50 px-3 py-1 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
          />
          <button
            type="button"
            onClick={handleInsertLink}
            className="px-3 py-1 bg-[#c9a52c] text-white rounded hover:bg-[#d9b53c] transition-colors"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            className="px-3 py-1 bg-[#3a2819] text-white rounded hover:bg-[#4a3829] transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
      
      {/* Image Input */}
      {showImageInput && (
        <div className="bg-[#2d1e14] border-b border-[#7a4528]/50 p-2 flex flex-wrap gap-2 items-center">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL"
            className="flex-1 min-w-[150px] rounded-md bg-[#3a2819] border border-[#7a4528]/50 px-3 py-1 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
          />
          <input
            type="text"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder="Alt text (optional)"
            className="flex-1 min-w-[150px] rounded-md bg-[#3a2819] border border-[#7a4528]/50 px-3 py-1 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
          />
          <button
            type="button"
            onClick={handleInsertImage}
            className="px-3 py-1 bg-[#c9a52c] text-white rounded hover:bg-[#d9b53c] transition-colors"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => setShowImageInput(false)}
            className="px-3 py-1 bg-[#3a2819] text-white rounded hover:bg-[#4a3829] transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
      
      {/* Editor */}
      <textarea
        id="rich-text-editor"
        value={editorContent}
        onChange={(e) => setEditorContent(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#2d1e14] px-3 py-2 text-white focus:outline-none"
        style={{ minHeight }}
      />
      
      {/* Preview (optional) */}
      {/* <div className="border-t border-[#7a4528]/50 p-3 bg-[#2d1e14]">
        <h3 className="text-sm font-medium text-gray-400 mb-2">Preview</h3>
        <div className="prose prose-invert max-w-none">
          {/* Render markdown preview here */}
        {/* </div>
      </div> */}
    </div>
  );
};

export default RichTextEditor;
