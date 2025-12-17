import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Preloader from '../components/Preloader';

import { API_BASE } from '../config';
import { useLanguage } from '../i18n/context.js';

const ParentingAcademy = () => {
  const { t } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorKey, setErrorKey] = useState('');
  
  const itemsPerPage = 3; 
  const tagKeys = ['academy.tags.behavior', 'academy.tags.growth', 'academy.tags.health', 'academy.tags.psychology'];
  const fallbackThumbs = [
    'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1498079022511-d15614cb1c02?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  ];

  const fetchMeta = async (url, idx = 0) => {
    try {
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const d = await res.json();
        return {
          title: d.title || 'Video',
          thumbnail: d.thumbnail_url || fallbackThumbs[idx % fallbackThumbs.length],
        };
      }
    } catch (e) {
      console.warn('oEmbed error', e);
    }
    return {
      title: 'Video',
      thumbnail: fallbackThumbs[idx % fallbackThumbs.length],
    };
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${API_BASE}/videos`);
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        const enrichedData = await Promise.all(
          data.map(async (video, idx) => {
            const meta = await fetchMeta(video.url, idx);
            return {
              id: video.id,
              url: video.url,
              title: meta.title,
              thumbnail: meta.thumbnail,
              tagKey: tagKeys[idx % 4],
              color: ["bg-yellow-300", "bg-pink-300", "bg-green-300", "bg-purple-300", "bg-blue-300", "bg-orange-300"][idx % 6]
            };
          })
        );

        setCourses(enrichedData);
      } catch (err) {
        console.error(err);
        setErrorKey('academy.errorLoad');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = courses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(courses.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  if (isLoading) return <Preloader onFinish={() => {}} title={t('academy.preloaderTitle')} subtitle={t('academy.preloaderSubtitle')} />;

  return (
    <Layout>
      <div className="flex-1 min-h-screen bg-[#f0f0f0] bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] bg-[length:30px_30px] font-sans">
        
        {/* Massive Hero Section */}
        <div className="w-full border-b-4 border-slate-900 bg-white relative overflow-hidden group">
            {/* Animated Background Text */}
            <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-9xl select-none pointer-events-none animate-pulse">
                {t('academy.heroBg')}
            </div>
            
            <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
                <div className="inline-block bg-yellow-300 border-2 border-slate-900 px-4 py-1 font-bold text-slate-900 mb-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transform -rotate-2 animate-fade-in-up">
                    {t('academy.badge')}
                </div>
                
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8 animate-reveal-up">
                    {t('academy.heroLine1')}<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 stroke-black text-stroke-2 animate-elegant-float inline-block">{t('academy.heroLine2')}</span>
                </h1>
                
                <p className="text-xl md:text-2xl font-bold text-slate-700 max-w-2xl leading-relaxed border-l-8 border-blue-600 pl-6 bg-slate-50/80 p-4 backdrop-blur-sm animate-fade-in-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
                    {t('academy.heroLead1')} <br/>
                    {t('academy.heroLead2')}
                </p>
            </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-6 py-12 relative">
            
            {errorKey ? (
                <div className="text-center py-20 animate-fade-in-up">
                    <h3 className="text-2xl font-bold text-slate-900">{t(errorKey)}</h3>
                    <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:scale-105 transition-transform">{t('academy.retry')}</button>
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-20 bg-white border-4 border-slate-900 rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] animate-fade-in-up">
                    <div className="inline-block p-4 bg-yellow-300 rounded-full border-2 border-slate-900 mb-4 animate-bounce">
                        <svg className="w-8 h-8 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">{t('academy.emptyTitle')}</h3>
                    <p className="text-slate-600 mt-2 font-medium">{t('academy.emptySubtitle')}</p>
                </div>
            ) : (
                /* Pagination Controls & Grid */
                <div className="relative">
                    {/* Prev Arrow */}
	                    <button 
	                        onClick={prevPage}
	                        disabled={currentPage === 1}
	                        className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-12 z-20 p-4 bg-slate-900 text-white rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] border-2 border-white hover:scale-110 hover:bg-blue-600 transition-all disabled:opacity-0 disabled:pointer-events-none hover:rotate-12`}
	                        aria-label={t('academy.prevPage')}
	                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Video Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 px-2 min-h-[500px]">
                        {currentItems.map((course, idx) => (
                            <div 
                                key={course.id} 
                                className="group relative bg-white border-4 border-slate-900 rounded-2xl p-4 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] transition-all duration-300 hover:-translate-y-2 flex flex-col h-full animate-fade-in-up"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-900 mb-5 group-hover:grayscale-[20%] transition-all shrink-0">
	                                    <img 
	                                        src={course.thumbnail || t('academy.noThumbnail')} 
	                                        alt={course.title} 
	                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
	                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                                        <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                            <svg className="h-8 w-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                    
	                                    {/* Tag Badge */}
	                                    <div className={`absolute top-2 left-2 ${course.color || 'bg-blue-300'} border-2 border-slate-900 px-3 py-1 text-xs font-black uppercase tracking-wider transform -rotate-2 group-hover:rotate-0 transition-transform duration-300 shadow-sm`}>
	                                        {course.tagKey ? t(course.tagKey) : t('academy.tagNew')}
	                                    </div>
	                                </div>

                                {/* Details */}
                                <div className="flex flex-col flex-1 justify-between">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight line-clamp-3 group-hover:text-blue-700 transition-colors">
                                            {course.title}
                                        </h3>
                                    </div>
                                    
	                                    <a 
	                                        href={course.url} 
	                                        target="_blank" 
	                                        rel="noopener noreferrer"
	                                        className="w-full block text-center bg-slate-900 text-white font-black py-3 px-4 rounded-xl border-2 border-transparent hover:bg-white hover:text-slate-900 hover:border-slate-900 transition-all uppercase tracking-wide relative z-20 active:scale-95 active:shadow-inner hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
	                                    >
	                                        {t('academy.watchVideo')}
	                                    </a>
	                                </div>
	                            </div>
	                        ))}
                    </div>

                    {/* Next Arrow */}
	                    <button 
	                        onClick={nextPage}
	                        disabled={currentPage === totalPages}
	                        className={`absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-12 z-20 p-4 bg-slate-900 text-white rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] border-2 border-white hover:scale-110 hover:bg-blue-600 transition-all disabled:opacity-0 disabled:pointer-events-none hover:-rotate-12`}
	                        aria-label={t('academy.nextPage')}
	                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Brutalist Footer Banner */}
            <div className="w-full bg-blue-600 border-4 border-slate-900 rounded-2xl p-8 md:p-12 text-center shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500 animate-fade-in-up [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                {/* Decorative circles */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 relative z-10 drop-shadow-md">
                    {t('academy.footerTitle')}
                </h2>
                <p className="text-blue-100 font-bold text-lg md:text-xl relative z-10 max-w-2xl mx-auto">
                    {t('academy.footerBody')}
                </p>
            </div>

        </div>
      </div>
    </Layout>
  );
};

export default ParentingAcademy;
