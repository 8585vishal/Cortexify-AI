import React, { useState } from 'react';
import SyntaxHighlighter from './SyntaxHighlighter';
import { CopyIcon, CheckIcon } from './Icons';

interface MarkdownRendererProps {
  content: string;
}

// Helper to process inline markdown like bold, italic, links, and inline code.
const renderInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={index}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={index} className="bg-gray-700 text-pink-400 rounded-sm px-1.5 py-0.5 text-sm">{part.slice(1, -1)}</code>;
        }
        if (part.startsWith('[') && part.includes('](')) {
            const match = part.match(/\[(.*?)\]\((.*?)\)/);
            if (match) {
                return <a href={match[2]} key={index} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{match[1]}</a>;
            }
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
    });
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    const [copiedBlockIndex, setCopiedBlockIndex] = useState<number | null>(null);
    
    const handleCopy = (code: string, index: number) => {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedBlockIndex(index);
        setTimeout(() => {
          setCopiedBlockIndex(null);
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    };

    const renderContent = () => {
        // 1. Split by multi-line code blocks first
        const parts = content.split(/(```[\s\S]*?```)/g);

        return parts.map((part, index) => {
            // It's a code block
            if (part.startsWith('```')) {
                const codeBlockContent = part.slice(3, -3);
                const lines = codeBlockContent.split('\n');
                const lang = lines[0].trim().toLowerCase();
                const codeContent = lines.slice(1).join('\n');
                const isCopied = copiedBlockIndex === index;

                return (
                    <div key={index} className="bg-gray-800 rounded-md my-2 text-sm relative group">
                        <div className="flex justify-between items-center text-xs text-gray-400 px-4 py-2 border-b border-gray-700">
                           <span>{lang || 'code'}</span>
                        </div>
                        <button 
                            onClick={() => handleCopy(codeContent, index)}
                            className="absolute top-2 right-2 flex items-center text-xs px-2 py-1 rounded bg-gray-900/50 backdrop-blur-sm text-gray-300 hover:bg-gray-900/80 transition-all opacity-0 group-hover:opacity-100"
                        >
                            {isCopied ? (
                                <>
                                    <CheckIcon className="w-3 h-3 mr-1 text-green-400" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <CopyIcon className="w-3 h-3 mr-1" />
                                    <span>Copy</span>
                                </>
                            )}
                       </button>
                        <pre className="p-4 overflow-x-auto">
                            <SyntaxHighlighter code={codeContent} language={lang} />
                        </pre>
                    </div>
                );
            }

            if (part.trim() === '') return null;

            const lines = part.trim().split('\n');
            const elements: React.ReactNode[] = [];
            let currentList: { type: 'ul' | 'ol'; items: React.ReactNode[] } | null = null;
            let currentBlockquote: string[] | null = null;

            const flushBlocks = () => {
                if (currentList) {
                    const ListTag = currentList.type;
                    elements.push(
                        <ListTag key={`list-${elements.length}`} className={`${ListTag === 'ul' ? 'list-disc' : 'list-decimal'} pl-5 space-y-1 my-2`}>
                            {currentList.items}
                        </ListTag>
                    );
                    currentList = null;
                }
                if (currentBlockquote) {
                    elements.push(
                        <blockquote key={`quote-${elements.length}`} className="border-l-4 border-gray-500 pl-4 my-2 italic text-gray-400">
                            {currentBlockquote.map((q, i) => <p key={i}>{renderInline(q)}</p>)}
                        </blockquote>
                    );
                    currentBlockquote = null;
                }
            };
            
            lines.forEach((line, lineIndex) => {
                // Horizontal Rule
                if (/^(---|___|\*\*\*)$/.test(line.trim())) {
                    flushBlocks();
                    elements.push(<hr key={`hr-${elements.length}`} className="my-4 border-gray-600" />);
                    return;
                }

                // Unordered List
                const ulMatch = line.match(/^(\s*[-*+]\s+)(.*)/);
                if (ulMatch) {
                    if (currentList?.type !== 'ul' || currentBlockquote) flushBlocks();
                    if (!currentList) currentList = { type: 'ul', items: [] };
                    currentList.items.push(<li key={currentList.items.length}>{renderInline(ulMatch[2])}</li>);
                    return;
                }

                // Ordered List
                const olMatch = line.match(/^(\s*\d+\.\s+)(.*)/);
                if (olMatch) {
                    if (currentList?.type !== 'ol' || currentBlockquote) flushBlocks();
                    if (!currentList) currentList = { type: 'ol', items: [] };
                    currentList.items.push(<li key={currentList.items.length}>{renderInline(olMatch[2])}</li>);
                    return;
                }
                
                // Blockquote
                const bqMatch = line.match(/^>\s?(.*)/);
                if (bqMatch) {
                    if (currentList) flushBlocks();
                    if (!currentBlockquote) currentBlockquote = [];
                    currentBlockquote.push(bqMatch[1]);
                    return;
                }

                // Paragraph or empty line
                flushBlocks();
                if (line.trim()) {
                    elements.push(<p key={`p-${elements.length}-${lineIndex}`}>{renderInline(line)}</p>);
                }
            });

            flushBlocks(); // Flush any remaining blocks
            return <div key={index}>{elements}</div>;
        });
    };

    return <div className="prose prose-invert max-w-none break-words space-y-2">{renderContent()}</div>;
};

export default MarkdownRenderer;
