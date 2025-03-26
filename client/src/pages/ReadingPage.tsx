import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface ReadingContent {
  id: string;
  title: string;
  author: string;
  chapters: {
    title: string;
    content: string;
  }[];
}

// Temporary mock data
const mockReadingContent: ReadingContent = {
  id: '1',
  title: 'The Psychology of Money',
  author: 'Morgan Housel',
  chapters: [
    {
      title: 'Introduction: The Psychology of Money',
      content: `Money decisions are not just about numbers and calculations. They are deeply influenced by our personal history, unique experiences, and the way we think about the world. This book explores the complex relationship between money and human behavior, offering insights that go beyond traditional financial advice.

The way we think about money is shaped by our upbringing, cultural background, and life experiences. What works for one person might not work for another, and that's okay. The key is understanding our own psychology and how it affects our financial decisions.`,
    },
    {
      title: 'Chapter 1: No One\'s Crazy',
      content: `People make different financial decisions based on their unique experiences and perspectives. What seems irrational to one person might make perfect sense to another. This chapter explores how our personal history shapes our money decisions and why we should be more understanding of others' financial choices.

The key insight is that everyone's financial decisions are influenced by their own "money story" - the collection of experiences and beliefs that shape how they think about and handle money.`,
    },
    {
      title: 'Chapter 2: Luck & Risk',
      content: `Success and failure in finance (and life) are often attributed to skill or lack thereof, but luck and risk play a much larger role than we typically acknowledge. This chapter examines how these factors influence financial outcomes and why we should be more humble in our judgments.

The lesson is that we should be careful about attributing success solely to skill and failure solely to incompetence. Both luck and risk are powerful forces that can dramatically impact outcomes.`,
    },
  ],
};

const ReadingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const content = mockReadingContent; // In a real app, we would fetch this based on the ID
  const [currentChapter, setCurrentChapter] = useState(0);
  const [fontSize, setFontSize] = useState('base');
  const [theme, setTheme] = useState('light');

  const fontSizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const themeClasses = {
    light: 'bg-white text-gray-900',
    dark: 'bg-gray-900 text-white',
    sepia: 'bg-amber-50 text-gray-900',
  };

  return (
    <div className={`min-h-screen ${themeClasses[theme as keyof typeof themeClasses]}`}>
      {/* Reading Header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to={`/book-summaries/${id}`}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Summary
            </Link>
            <div className="flex items-center space-x-4">
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="px-2 py-1 border rounded"
              >
                <option value="sm">Small</option>
                <option value="base">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
              </select>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="px-2 py-1 border rounded"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="sepia">Sepia</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Reading Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
          <p className="text-xl text-gray-600 mb-8">by {content.author}</p>

          <div className={`${fontSizeClasses[fontSize as keyof typeof fontSizeClasses]} leading-relaxed`}>
            <h2 className="text-2xl font-semibold mb-6">
              {content.chapters[currentChapter].title}
            </h2>
            <div className="whitespace-pre-line">
              {content.chapters[currentChapter].content}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex justify-between">
            <button
              onClick={() => setCurrentChapter((prev) => Math.max(0, prev - 1))}
              disabled={currentChapter === 0}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous Chapter
            </button>
            <button
              onClick={() => setCurrentChapter((prev) => Math.min(content.chapters.length - 1, prev + 1))}
              disabled={currentChapter === content.chapters.length - 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next Chapter
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReadingPage; 