import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { useLanguage } from '../i18n/context.js';

const ListingDetailModal = ({ isOpen, onClose, listing }) => {
  const { t } = useLanguage();
  const [view, setView] = useState('details'); // 'details' or 'contact'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setView('details'); // Reset view on open
      setIsSuccess(false);
      setFormData({ name: '', email: '', message: '' });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset after success message
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };

  const DetailView = () => (
    <div className="space-y-10 animate-fade-in-up relative">
      {/* Header Image */}
	      <div className="relative h-64 sm:h-80 lg:h-[420px] overflow-hidden rounded-3xl shadow-xl group">
	        <img 
	            src={listing.imageUrl} 
	            alt={listing.title} 
	            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
	        />
	        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
	        
	        <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full z-10 text-white">
	            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
	              {listing.title}
	            </h2>
	            <div className="flex flex-wrap gap-2">
	                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium backdrop-blur-md border bg-white/20 text-white border-white/20">
	                    {listing.category}
	                </span>
	                {listing.subCategory && (
	                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium backdrop-blur-md border bg-white/20 text-white border-white/20">
	                        {listing.subCategory}
	                    </span>
	                )}
	            </div>
	        </div>
	      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Left Column: Description */}
	        <div className="lg:col-span-2 prose prose-lg max-w-none text-slate-600">
	            <h3 className="text-xl font-bold mb-4 flex items-center text-slate-900">
		                <svg className="h-6 w-6 mr-2 text-welfare-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
		                </svg>
		                {t('listingDetail.aboutUs')}
		            </h3>
            <p className="leading-relaxed whitespace-pre-line">
                {listing.description}
            </p>
        </div>

        {/* Right Column: Contact Info & Animated Logo */}
	        <div className="lg:col-span-1 space-y-6">
		            {/* Contact Card */}
		            <div className="rounded-2xl p-6 border shadow-sm bg-slate-50 border-slate-100">
		                <h4 className="text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2 text-slate-400 border-slate-200">
		                    {t('listingDetail.businessDetails')}
		                </h4>
		                
		                <div className="space-y-6">
		                    <div>
		                        <span className="text-xs font-semibold uppercase block mb-1 text-welfare-blue">{t('listingDetail.familyOwner')}</span>
		                        <p className="font-medium text-lg text-slate-900">
		                            {listing.surname ? listing.surname : <span className="text-slate-400 italic font-normal text-base">{t('listingDetail.notListed')}</span>}
		                        </p>
		                    </div>

		                    <div>
		                        <span className="text-xs font-semibold uppercase block mb-2 text-welfare-blue">{t('listingDetail.contactInfo')}</span>
		                        {(listing.email || listing.phone || listing.website) ? (
		                            <ul className="space-y-3 text-sm text-slate-700">
	                                {listing.email && (
	                                    <li className="flex items-start group">
	                                        <div className="p-1.5 rounded-md shadow-sm mr-3 transition-colors border bg-white border-slate-100 text-slate-400 group-hover:text-welfare-blue">
	                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
	                                        </div>
	                                        <span className="mt-1 break-all">{listing.email}</span>
	                                    </li>
	                                )}
	                                {listing.phone && (
	                                    <li className="flex items-start group">
	                                        <div className="p-1.5 rounded-md shadow-sm mr-3 transition-colors border bg-white border-slate-100 text-slate-400 group-hover:text-welfare-blue">
	                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 12.284 3 6V5z" /></svg>
	                                        </div>
	                                        <span className="mt-1">{listing.phone}</span>
	                                    </li>
	                                )}
	                                {listing.website && (
	                                    <li className="flex items-start group">
	                                        <div className="p-1.5 rounded-md shadow-sm mr-3 transition-colors border bg-white border-slate-100 text-slate-400 group-hover:text-welfare-blue">
	                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
	                                        </div>
	                                        <a href={listing.website} target="_blank" rel="noopener noreferrer" className="mt-1 hover:underline transition-colors text-welfare-blue hover:text-blue-700">
	                                            Visit Website
	                                        </a>
	                                    </li>
	                                )}
		                            </ul>
		                        ) : (
		                            <p className="text-slate-400 italic text-sm bg-white p-3 rounded-lg border border-slate-100 text-center">{t('listingDetail.contactNotPublic')}</p>
		                        )}
		                    </div>

		                    <div className="pt-1 border-t border-slate-200">
		                        <span className="text-xs font-semibold uppercase block mb-2 text-welfare-blue">{t('listingDetail.communityDiscount')}</span>
		                        {listing.discount ? (
		                            <div className="inline-flex items-center px-3 py-2 rounded-xl font-semibold text-sm shadow-sm border bg-green-50 text-green-700 border-green-100">
		                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l2 2 4-4m-2-9a9 9 0 11-6.219 15.643L3 21l1.357-3.781A9 9 0 0113 3z" />
		                                </svg>
		                                {t('listingDetail.discountForFamilies', { discount: listing.discount })}
		                            </div>
		                        ) : (
		                            <p className="text-slate-400 italic text-sm">{t('listingDetail.noDiscount')}</p>
		                        )}
		                    </div>
		                </div>
		            </div>

		            {/* Animated Logo Branding Filler */}
		            <div className="flex flex-col items-center justify-center p-8 opacity-50 hover:opacity-80 transition-opacity duration-700">
		                <div className="w-24 h-24 relative animate-elegant-float">
		                    <div className="absolute inset-0 rounded-full filter blur-xl opacity-50 animate-pulse bg-blue-100"></div>
		                    <img src={logo} alt="Welfare" className="relative w-full h-full object-contain" />
		                </div>
		                <span className="text-xs font-bold uppercase tracking-[0.3em] mt-6 text-blue-200">{t('listingDetail.welfareCommunity')}</span>
		            </div>
		        </div>
      </div>
    </div>
  );

	  const ContactView = () => (
	     <div className="space-y-4 sm:space-y-6 animate-fade-in-up pt-6 sm:pt-10 max-w-3xl mx-auto w-full">
	        <div className="text-center mb-6 sm:mb-8">
	            <div className="inline-flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full mb-4 bg-blue-50 text-welfare-blue">
	                <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
	                </svg>
	            </div>
	            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{t('listingDetail.getInTouch')}</h3>
	            <p className="text-sm sm:text-base mt-2 text-slate-500">
	              {t('listingDetail.sendDirectMessageTo', { name: listing.title })}
	            </p>
	        </div>

	        {isSuccess ? (
	             <div className="flex flex-col items-center justify-center py-8 sm:py-12 space-y-4 sm:space-y-6 rounded-2xl border p-4 bg-green-50 border-green-100">
	                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center shadow-sm bg-green-100 text-green-600">
	                    <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
	                    </svg>
		                </div>
		                <div className="text-center px-2 sm:px-6">
		                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-slate-900">{t('listingDetail.messageSent')}</h3>
		                    <p className="text-sm sm:text-base text-slate-600">{t('listingDetail.messageSentBody')}</p>
		                </div>
		            </div>
	        ) : (
	            <form id="contact-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-lg mx-auto">
	                <div>
	                    <label htmlFor="name" className="block text-sm font-semibold mb-1 text-slate-700">{t('listingDetail.yourName')}</label>
	                    <input 
	                        type="text" 
	                        name="name" 
	                        id="name" 
                        required
	                        value={formData.name}
	                        onChange={handleChange}
	                        className="block w-full rounded-xl border shadow-sm py-2.5 sm:py-3 px-4 transition-colors focus:ring-2 bg-slate-50 border-slate-300 focus:bg-white focus:border-welfare-blue focus:ring-welfare-blue"
	                        placeholder={t('listingDetail.namePlaceholder')}
	                    />
	                </div>
	                <div>
	                    <label htmlFor="email" className="block text-sm font-semibold mb-1 text-slate-700">{t('listingDetail.emailAddress')}</label>
	                    <input 
	                        type="email" 
	                        name="email" 
	                        id="email" 
                        required
	                        value={formData.email}
	                        onChange={handleChange}
	                        className="block w-full rounded-xl border shadow-sm py-2.5 sm:py-3 px-4 transition-colors focus:ring-2 bg-slate-50 border-slate-300 focus:bg-white focus:border-welfare-blue focus:ring-welfare-blue"
	                        placeholder={t('listingDetail.emailPlaceholder')}
	                    />
	                </div>
	                <div>
	                    <label htmlFor="message" className="block text-sm font-semibold mb-1 text-slate-700">{t('listingDetail.message')}</label>
	                    <textarea 
	                        name="message" 
	                        id="message" 
                        rows="4" 
                        required
	                        value={formData.message}
	                        onChange={handleChange}
	                        className="block w-full rounded-xl border shadow-sm py-2.5 sm:py-3 px-4 transition-colors resize-none focus:ring-2 bg-slate-50 border-slate-300 focus:bg-white focus:border-welfare-blue focus:ring-welfare-blue"
	                        placeholder={t('listingDetail.messagePlaceholder')}
	                    ></textarea>
                </div>
            </form>
        )}
     </div>
  );

  const contentPadding = view === 'contact' ? 'pb-36 sm:pb-32' : 'pb-16 sm:pb-20';

  return (
    <>
	        {/* Backdrop */}
	        <div 
	            className={`fixed inset-0 z-[100] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} bg-black/60 backdrop-blur-sm`}
	            onClick={onClose}
	        ></div>

	        {/* Slide-over Panel */}
	        <div 
	            className={`fixed inset-y-0 right-0 z-[110] w-full h-full max-w-2xl shadow-2xl overflow-hidden transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'} bg-white`}
	        >
	            <button 
	                onClick={onClose}
	                className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 p-2 rounded-full shadow-sm border hover:scale-105 transition-all backdrop-blur bg-white/90 text-slate-500 border-slate-100 hover:text-slate-900"
		            >
	                <span className="sr-only">{t('listingDetail.close')}</span>
	                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
	                </svg>
	            </button>

            {/* Content Container */}
            <div className="h-full flex flex-col relative">
                 {/* Scrollable Area */}
                 <div className={`flex-1 overflow-y-auto custom-scrollbar ${contentPadding}`}>
                    <div className="w-full px-5 sm:px-8 pt-8 sm:pt-10">
                        {listing && (view === 'details' ? <DetailView /> : <ContactView />)}
                    </div>
                 </div>

	                 {/* Sticky Footer */}
	                 {view === 'contact' && (
	                    <div className="absolute bottom-0 left-0 w-full backdrop-blur-md border-t p-4 sm:p-6 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] bg-white/95 border-slate-100">
	                        <div className="w-full px-5 sm:px-8">
	                            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
	                                <button 
	                                    type="button" 
	                                    onClick={() => (isSuccess ? onClose() : setView('details'))}
	                                    className="flex-1 font-bold py-3 sm:py-4 rounded-xl transition-all active:scale-95 text-base sm:text-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
		                                >
	                                    {isSuccess ? t('listingDetail.backToListing') : t('listingDetail.back')}
		                                </button>
                                {!isSuccess && (
                                    <button 
                                        type="submit"
                                        form="contact-form"
                                        disabled={isSubmitting}
                                        className={`flex-1 font-bold py-3 sm:py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center text-base sm:text-lg ${
                                          isSubmitting 
                                          ? 'opacity-50 cursor-not-allowed' 
                                          : 'bg-welfare-blue text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1'
                                        }`}
	                                    >
	                                        {isSubmitting ? t('listingDetail.sending') : t('listingDetail.sendMessage')}
	                                    </button>
	                                )}
		                            </div>
		                        </div>
		                    </div>
                 )}
            </div>
        </div>
    </>
  );
};

export default ListingDetailModal;
