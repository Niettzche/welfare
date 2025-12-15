import React, { useEffect, useState } from 'react';

const ListingDetailModal = ({ isOpen, onClose, listing }) => {
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
    <div className="space-y-10 animate-fade-in-up">
      {/* Header Image */}
      <div className="relative h-64 sm:h-80 lg:h-[420px] overflow-hidden rounded-3xl shadow-xl">
        <img 
            src={listing.imageUrl} 
            alt={listing.title} 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white w-full">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">{listing.title}</h2>
            <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-md text-white border border-white/20">
                    {listing.category}
                </span>
                {listing.subCategory && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-md text-white border border-white/20">
                        {listing.subCategory}
                    </span>
                )}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Left Column: Description */}
        <div className="lg:col-span-2 prose prose-lg text-slate-600 max-w-none">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <svg className="h-6 w-6 mr-2 text-welfare-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About Us
            </h3>
            <p className="leading-relaxed whitespace-pre-line">
                {listing.description}
            </p>
        </div>

        {/* Right Column: Contact Info & Animated Logo */}
        <div className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                    Business Details
                </h4>
                
                <div className="space-y-6">
                    <div>
                        <span className="text-xs font-semibold text-welfare-blue uppercase block mb-1">Family Owner</span>
                        <p className="text-slate-900 font-medium text-lg">
                            {listing.surname ? listing.surname : <span className="text-slate-400 italic font-normal text-base">Not listed</span>}
                        </p>
                    </div>

                    <div>
                        <span className="text-xs font-semibold text-welfare-blue uppercase block mb-2">Contact Info</span>
                        {(listing.email || listing.phone || listing.website) ? (
                            <ul className="space-y-3 text-sm text-slate-700">
                                {listing.email && (
                                    <li className="flex items-start group">
                                        <div className="p-1.5 bg-white rounded-md shadow-sm mr-3 text-slate-400 group-hover:text-welfare-blue transition-colors border border-slate-100">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <span className="mt-1 break-all">{listing.email}</span>
                                    </li>
                                )}
                                {listing.phone && (
                                    <li className="flex items-start group">
                                        <div className="p-1.5 bg-white rounded-md shadow-sm mr-3 text-slate-400 group-hover:text-welfare-blue transition-colors border border-slate-100">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 12.284 3 6V5z" /></svg>
                                        </div>
                                        <span className="mt-1">{listing.phone}</span>
                                    </li>
                                )}
                                {listing.website && (
                                    <li className="flex items-start group">
                                        <div className="p-1.5 bg-white rounded-md shadow-sm mr-3 text-slate-400 group-hover:text-welfare-blue transition-colors border border-slate-100">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                        </div>
                                        <a href={listing.website} target="_blank" rel="noopener noreferrer" className="mt-1 text-welfare-blue hover:underline hover:text-blue-700 transition-colors">
                                            Visit Website
                                        </a>
                                    </li>
                                )}
                            </ul>
                        ) : (
                            <p className="text-slate-400 italic text-sm bg-white p-3 rounded-lg border border-slate-100 text-center">Contact details not publicly available</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Animated Logo Branding Filler */}
            <div className="flex flex-col items-center justify-center p-8 opacity-50 hover:opacity-80 transition-opacity duration-700">
                <div className="w-24 h-24 relative animate-elegant-float">
                    <div className="absolute inset-0 bg-blue-100 rounded-full filter blur-xl opacity-50 animate-pulse"></div>
                    <img src="/src/assets/logo.png" alt="Welfare" className="relative w-full h-full object-contain" />
                </div>
                <span className="text-xs font-bold text-blue-200 uppercase tracking-[0.3em] mt-6">Welfare Community</span>
            </div>
        </div>
      </div>
    </div>
  );

  const ContactView = () => (
     <div className="space-y-4 sm:space-y-6 animate-fade-in-up pt-6 sm:pt-10 max-w-3xl mx-auto w-full">
        <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-blue-50 text-welfare-blue mb-4">
                <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Get in Touch</h3>
            <p className="text-sm sm:text-base text-slate-500 mt-2">Send a direct message to <span className="font-semibold text-slate-700">{listing.title}</span></p>
        </div>

        {isSuccess ? (
             <div className="flex flex-col items-center justify-center py-8 sm:py-12 space-y-4 sm:space-y-6 bg-green-50 rounded-2xl border border-green-100 p-4">
                <div className="h-16 w-16 sm:h-20 sm:w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-sm">
                    <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="text-center px-2 sm:px-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                    <p className="text-sm sm:text-base text-slate-600">Your inquiry has been successfully sent. The business owner will contact you shortly via email.</p>
                </div>
            </div>
        ) : (
            <form id="contact-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-lg mx-auto">
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">Your Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-welfare-blue focus:ring-welfare-blue py-2.5 sm:py-3 px-4 bg-slate-50 focus:bg-white transition-colors"
                        placeholder="e.g. Sarah Smith"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-welfare-blue focus:ring-welfare-blue py-2.5 sm:py-3 px-4 bg-slate-50 focus:bg-white transition-colors"
                        placeholder="sarah@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
                    <textarea 
                        name="message" 
                        id="message" 
                        rows="4" 
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-welfare-blue focus:ring-welfare-blue py-2.5 sm:py-3 px-4 bg-slate-50 focus:bg-white transition-colors resize-none"
                        placeholder="Hello, I would like to know more about..."
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
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        ></div>

        {/* Slide-over Panel */}
        <div 
            className={`fixed inset-y-0 right-0 z-[110] w-full h-full max-w-2xl bg-white shadow-2xl overflow-hidden transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 p-2 bg-white/90 backdrop-blur rounded-full text-slate-500 hover:text-slate-900 shadow-sm border border-slate-100 hover:scale-105 transition-all"
            >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Content Container */}
            <div className="h-full flex flex-col">
                 {/* Scrollable Area */}
                 <div className={`flex-1 overflow-y-auto custom-scrollbar ${contentPadding}`}>
                    <div className="w-full px-5 sm:px-8 pt-8 sm:pt-10">
                        {listing && (view === 'details' ? <DetailView /> : <ContactView />)}
                    </div>
                 </div>

                 {/* Sticky Footer */}
                 {view === 'contact' && (
                    <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 sm:p-6 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                        <div className="w-full px-5 sm:px-8">
                            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                                <button 
                                    type="button" 
                                    onClick={() => (isSuccess ? onClose() : setView('details'))}
                                    className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 sm:py-4 rounded-xl hover:bg-slate-200 transition-all active:scale-95 text-base sm:text-lg"
                                >
                                    {isSuccess ? 'Back to listing' : 'Back'}
                                </button>
                                {!isSuccess && (
                                    <button 
                                        type="submit"
                                        form="contact-form"
                                        disabled={isSubmitting}
                                        className={`flex-1 font-bold py-3 sm:py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center text-base sm:text-lg ${isSubmitting ? 'bg-blue-300 text-white cursor-not-allowed' : 'bg-welfare-blue text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1'}`}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
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
