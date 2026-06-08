import React, { useState, useEffect } from 'react';
import { getPreviewHtml } from '../utils/generator';

const PAGES = [
  { id: 'index', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' }
];

const Preview = ({ formData }) => {
  const [device, setDevice] = useState('desktop');
  const [page, setPage] = useState('index');
  const [srcDoc, setSrcDoc] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setSrcDoc(getPreviewHtml(formData, page));
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [formData, page]);

  const devices = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
  };

  // Show all pages in nav except gallery if section is disabled
  const visiblePages = PAGES.filter(p => {
    if (p.id === 'gallery') return formData.sections?.gallery !== false;
    if (p.id === 'about') return formData.sections?.about !== false;
    if (p.id === 'services') return formData.sections?.services !== false;
    return true; // index and contact always visible
  });

  // If current page is hidden, switch to home
  if (!visiblePages.find(p => p.id === page)) {
    setPage('index');
  }

  return (
    <div className="h-full flex flex-col bg-surface/30 rounded-xl overflow-hidden border border-border">
      <div className="p-4 border-b border-border glass flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          {['desktop', 'tablet', 'mobile'].map(d => (
            <button 
              key={d}
              onClick={() => setDevice(d)}
              className={`p-2 rounded transition-all ${
                device === d 
                  ? 'bg-gold text-bg shadow-lg shadow-gold/20' 
                  : 'bg-bg text-muted hover:text-gold hover:border-gold/30'
              }`}
              title={d.charAt(0).toUpperCase() + d.slice(1)}
            >
              <DeviceIcon type={d} />
            </button>
          ))}
        </div>
        
        <div className="flex gap-1">
          {visiblePages.map(p => (
            <button 
              key={p.id}
              onClick={() => setPage(p.id)}
              className={`px-3 py-1.5 text-xs uppercase tracking-widest transition-all rounded ${
                page === p.id 
                  ? 'text-gold bg-gold/10' 
                  : 'text-muted hover:text-gold'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-black/40 flex justify-center items-start overflow-auto p-4 md:p-8">
        <div 
          className="bg-white shadow-2xl transition-all duration-500 rounded-sm overflow-hidden" 
          style={{ 
            width: devices[device], 
            minHeight: device === 'mobile' ? '667px' : '600px',
            maxWidth: '100%'
          }}
        >
          {isLoading ? (
            <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-[#0A0A0B]">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted text-xs uppercase tracking-widest">Rendering...</p>
              </div>
            </div>
          ) : (
            <iframe 
              srcDoc={srcDoc} 
              title="Preview" 
              className="w-full h-full border-none"
              style={{ minHeight: '600px' }}
              sandbox="allow-scripts allow-same-origin"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const DeviceIcon = ({ type }) => {
  if (type === 'desktop') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8"/>
      <path d="M12 17v4"/>
    </svg>
  );
  if (type === 'tablet') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/>
      <path d="M12 18h.01"/>
    </svg>
  );
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/>
      <path d="M12 18h.01"/>
    </svg>
  );
};

export default Preview;