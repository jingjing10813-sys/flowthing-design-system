import { createElement, useState } from 'react';
import { icons } from './iconography-icons';
import sunAsset from '../assets/icon-sun.svg';
import moonAsset from '../assets/icon-moon.svg';
import './Iconography.css';

export default function Iconography() {
  const [query, setQuery] = useState('');
  const [library, setLibrary] = useState('all');
  const [size, setSize] = useState(24);
  const [message, setMessage] = useState('');
  const filtered = icons.filter(item => (library === 'all' || library === item.library) && `${item.name} ${item.library} ${item.files.join(' ')}`.toLowerCase().includes(query.toLowerCase().trim()));
  async function copy(item) {
    try {
      await navigator.clipboard.writeText(`import { ${item.name} } from '${item.library}';\n\n<${item.name} width={${size}} height={${size}} strokeWidth={1.5} />`);
      setMessage(`${item.name} 사용 코드를 복사했어요.`);
    } catch {
      setMessage('클립보드에 복사할 수 없습니다. 아이콘 이름과 출처를 확인하세요.');
    }
  }
  return <>
    <div className="eyebrow">DESIGN FOUNDATIONS</div>
    <h1>Iconography</h1>
    <p className="lead">Flowthing의 기기 화면, 컴포넌트, AI 도구에서 사용하는 아이콘을 모았습니다.</p>
    <section id="icon-library">
      <h2>Icon library</h2>
      <p>아이콘을 누르면 가져오기 코드와 사용 예시를 복사합니다. 이름 또는 사용 파일로 검색할 수 있어요.</p>
      <div className="iconography-toolbar">
        <input type="search" placeholder="Search icons…" aria-label="아이콘 이름 또는 사용 파일 검색" value={query} onChange={event => setQuery(event.target.value)} />
        <select aria-label="아이콘 라이브러리" value={library} onChange={event => setLibrary(event.target.value)}><option value="all">All libraries</option><option value="iconoir-react">Iconoir</option><option value="lucide-react">Lucide</option></select>
        <select aria-label="아이콘 미리보기 크기" value={size} onChange={event => setSize(Number(event.target.value))}>{[16,24,32].map(value => <option key={value} value={value}>{value}px</option>)}</select>
      </div>
      <div className="iconography-status" role="status">{message || `${filtered.length} icons`}</div>
      <div className="iconography-grid">{filtered.map(({ Icon, ...item }) => <button className="iconography-card" key={`${item.library}/${item.name}`} onClick={() => copy(item)} title={`사용 위치: ${item.files.join(', ')}`} aria-label={`${item.name}, ${item.library}, 사용 코드 복사`}><span className="iconography-preview" aria-hidden="true">{createElement(Icon, {width:size,height:size,strokeWidth:1.5})}</span><span className="iconography-name">{item.name}</span></button>)}</div>
      {!filtered.length && <p>검색 결과가 없습니다. 다른 이름으로 검색해보세요.</p>}
    </section>
    <section id="icon-assets"><h2>SVG assets</h2><p>프로젝트에 보관된 SVG 파일입니다. 라이브러리 아이콘과 별도로 확인할 수 있습니다.</p><div className="iconography-grid">{[['Sun',sunAsset,'icon-sun.svg'],['Half Moon',moonAsset,'icon-moon.svg']].map(([name,src,file]) => <a className="iconography-card" href={src} download={file} key={file}><span className="iconography-preview"><img src={src} width={size} height={size} alt="" /></span><span className="iconography-name">{name}</span><small>Download SVG</small></a>)}</div></section>
    <div className="page-pagination"><a href="#/foundations">← Foundations</a></div>
  </>;
}
