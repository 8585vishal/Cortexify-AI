import React from 'react';

interface SyntaxHighlighterProps {
  code: string;
  language?: string;
}

const TOKEN_STYLES: Record<string, string> = {
    keyword: 'text-purple-400',
    string: 'text-green-400',
    comment: 'text-gray-500 italic',
    number: 'text-orange-400',
    function: 'text-blue-400',
    punctuation: 'text-gray-400',
    tag: 'text-red-400',
    attribute: 'text-yellow-400',
    property: 'text-cyan-400',
    builtin: 'text-teal-400',
    'class-name': 'text-yellow-400',
    operator: 'text-pink-400',
    decorator: 'text-yellow-400',
    selector: 'text-green-400',
    variable: 'text-orange-400',
    default: 'text-gray-200',
};

const tokenPatterns: Record<string, { type: string; regex: RegExp }[]> = {
    javascript: [
        { type: 'comment', regex: /^\/\/.*/ },
        { type: 'comment', regex: /^\/\*[\s\S]*?\*\// },
        { type: 'string', regex: /^\/(?:\\.|[^/])+\/[gimuy]*/ }, // Regex literals
        { type: 'string', regex: /^`[^`]*`|^'[^']*'|^"[^"]*"/ },
        { type: 'keyword', regex: /^\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|import|export|from|async|await|try|catch|finally|class|extends|super|new|this|delete|void|in|instanceof|typeof)\b/ },
        { type: 'builtin', regex: /^\b(console|log|Math|JSON|Promise|Object|Array|String|Number|Boolean|document|window|setTimeout|setInterval|clearTimeout|clearInterval|fetch|localStorage|sessionStorage|Map|Set|WeakMap|WeakSet|Symbol)\b/ },
        { type: 'boolean', regex: /^\b(true|false)\b/ },
        { type: 'null', regex: /^\b(null|undefined)\b/ },
        { type: 'class-name', regex: /^\b[A-Z][a-zA-Z0-9_]*/ },
        { type: 'function', regex: /^[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/ },
        { type: 'number', regex: /^\b\d+\.?\d*\b/ },
        { type: 'operator', regex: /^[=+\-*\/%&|<>!~^?:]+|=>|\.\.\./ },
        { type: 'punctuation', regex: /^[(){}[\].,;]/ },
    ],
    python: [
        { type: 'comment', regex: /^#.*/ },
        { type: 'string', regex: /^[urf]*'''[\s\S]*?'''|^[urf]*"""[\s\S]*?"""|^[urf]*'[^']*'|^[urf]*"[^"]*"/ },
        { type: 'decorator', regex: /^@\w+/ },
        { type: 'keyword', regex: /^\b(def|return|if|elif|else|for|while|break|continue|import|from|as|try|except|finally|class|lambda|with|and|or|not|is|in|pass|yield|global|nonlocal|assert|del)\b/ },
        { type: 'builtin', regex: /^\b(print|len|str|int|float|list|dict|set|tuple|range|sum|min|max|abs|open)\b/ },
        { type: 'boolean', regex: /^\b(True|False)\b/ },
        { type: 'null', regex: /^\b(None)\b/ },
        { type: 'class-name', regex: /^\b[A-Z][a-zA-Z0-9_]*/ },
        { type: 'function', regex: /^[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/ },
        { type: 'number', regex: /^\b\d+\.?\d*\b/ },
        { type: 'operator', regex: /^[=+\-*\/%&|<>!~^@:]+/ },
        { type: 'punctuation', regex: /^[(){}[\].,;]/ },
    ],
    json: [
        { type: 'property', regex: /^"[^"]*"(?=\s*:)/ },
        { type: 'string', regex: /^"[^"]*"/ },
        { type: 'number', regex: /^\b-?\d+\.?\d*(e[+-]?\d+)?\b/i },
        { type: 'keyword', regex: /^\b(true|false|null)\b/ },
        { type: 'punctuation', regex: /^[\[\]{},:]/ },
    ],
    css: [
        { type: 'comment', regex: /^\/\*[\s\S]*?\*\// },
        { type: 'decorator', regex: /^@[\w-]+/ },
        { type: 'selector', regex: /^#[a-zA-Z0-9_-]+/ }, // IDs
        { type: 'selector', regex: /^\.[a-zA-Z0-9_-]+/ }, // classes
        { type: 'selector', regex: /^:[a-zA-Z-]+/ }, // pseudo-classes
        { type: 'selector', regex: /^::[a-zA-Z-]+/ }, // pseudo-elements
        { type: 'selector', regex: /^\b[a-zA-Z]+\b/ }, // tags
        { type: 'property', regex: /^[a-zA-Z-]+(?=\s*:)/ },
        { type: 'string', regex: /^'[^']*'|^"[^"]*"/ },
        { type: 'variable', regex: /^--[a-zA-Z0-9-]+/ },
        { type: 'number', regex: /^\b-?\d+\.?\d*(px|em|rem|%|vw|vh|deg|s|ms)?\b/ },
        { type: 'function', regex: /^\b(rgb|rgba|hsl|hsla|var|calc|url)\b/ },
        { type: 'punctuation', regex: /^[\[\]{},:;()]/ },
    ],
    sql: [
        { type: 'comment', regex: /^--.*/ },
        { type: 'keyword', regex: /^\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|DROP|INDEX|VIEW|JOIN|INNER|LEFT|RIGHT|OUTER|ON|GROUP|BY|ORDER|HAVING|LIMIT|AS|DISTINCT|CASE|WHEN|THEN|ELSE|END|AND|OR|NOT|IN|EXISTS|LIKE|COUNT|SUM|AVG|MAX|MIN|CAST)\b/i },
        { type: 'string', regex: /^'[^']*'/ },
        { type: 'number', regex: /^\b\d+\b/ },
        { type: 'operator', regex: /^[=<>!+\-*\/%]+/ },
        { type: 'punctuation', regex: /^[(),;]/ },
    ],
    yaml: [
        { type: 'comment', regex: /^#.*/ },
        { type: 'keyword', regex: /^\b(true|false|null|on|off|yes|no)\b/i },
        { type: 'string', regex: /^("|').*?\1/ },
        { type: 'number', regex: /^\b-?\d+\.?\d*\b/ },
        { type: 'property', regex: /^\s*[-\w\s.]+(?=:)/ },
        { type: 'punctuation', regex: /^[-:\[\]{},|>&*!]/ },
    ],
    markdown: [
        { type: 'keyword', regex: /^#{1,6}\s/ },
        { type: 'comment', regex: /^(\*{3,}|-{3,}|_{3,})\s*$/ },
        { type: 'keyword', regex: /^\s*([*+-]|\d+\.)\s/ },
        { type: 'punctuation', regex: /^>\s*/ },
        { type: 'string', regex: /`[^`]+`/ },
        { type: 'operator', regex: /!?\[/ },
        { type: 'string', regex: /\]\(.*?\)/ },
        { type: 'operator', regex: /\*\*|__|\*|_|~~/ },
    ]
};

const tokenizeLine = (line: string, lang: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    let currentPos = 0;
    const patterns = tokenPatterns[lang] || tokenPatterns['javascript'];

    while (currentPos < line.length) {
        let matchFound = false;
        for (const { type, regex } of patterns) {
            const match = line.slice(currentPos).match(regex);
            if (match) {
                const token = match[0];
                const style = TOKEN_STYLES[type] || TOKEN_STYLES.default;
                nodes.push(<span key={currentPos} className={style}>{token}</span>);
                currentPos += token.length;
                matchFound = true;
                break;
            }
        }
        if (!matchFound) {
            nodes.push(line[currentPos]);
            currentPos++;
        }
    }
    
    return nodes;
};

const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({ code, language = 'javascript' }) => {
    const lang = language.toLowerCase();
    // Normalize language aliases
    const resolvedLang = {
        js: 'javascript',
        jsx: 'javascript',
        ts: 'javascript',
        tsx: 'javascript',
        py: 'python',
        yml: 'yaml',
        md: 'markdown'
    }[lang] || lang;

    const lines = code.trimEnd().split('\n');

    return (
        <code className="whitespace-pre-wrap">
            {lines.map((line, i) => (
                <div key={i} className="flex">
                    <span className="text-gray-500 w-8 text-right pr-4 select-none">{i + 1}</span>
                    <span className="flex-1">{tokenizeLine(line, resolvedLang)}</span>
                </div>
            ))}
        </code>
    );
};

export default SyntaxHighlighter;