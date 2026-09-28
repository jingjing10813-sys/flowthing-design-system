import { useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';

function renderTokens(tokens, prefix = '') {
  return tokens.map((token, index) => {
    if (typeof token === 'string') return token;
    const aliases = Array.isArray(token.alias) ? token.alias : [token.alias];
    return <span key={`${prefix}-${index}`} className={['syntax-token', `syntax-${token.type}`, ...aliases.filter(Boolean).map(alias => `syntax-${alias}`)].join(' ')}>{typeof token.content === 'string' ? token.content : renderTokens(Array.isArray(token.content) ? token.content : [token.content], `${prefix}-${index}`)}</span>;
  });
}

export default function SourceCode({ source }) {
  const highlighted = useMemo(() => renderTokens(Prism.tokenize(source, Prism.languages.jsx)), [source]);
  return <pre className="source-editor" tabIndex={0} aria-label="JSX 구현 코드"><code>{highlighted}</code></pre>;
}
