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
    <div className="space-y-6 animate-fade-in-up">
      <div className="relative h-64 sm:h-80 -mx-6 -mt-6 mb-8">
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

      <div className="prose prose-lg text-slate-600 max-w-none px-2">
        <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center">
            <svg className="h-5 w-5 mr-2 text-welfare-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About Us
        </h3>
        <p className="leading-relaxed mb-6">
            {listing.description}
            <br /><br />
            We take pride in being a part of the Welfare School community. Our commitment goes beyond just providing a service; we aim to build lasting relationships with every family we serve. Whether you are looking for quality, reliability, or expert advice, we are here to help you every step of the way.
        </p>

        <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center">
             <svg className="h-5 w-5 mr-2 text-welfare-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Why Choose Us?
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0 list-none mb-8">
            <li className="flex items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="h-2 w-2 rounded-full bg-welfare-blue mr-3"></span>
                Community Trusted
            </li>
            <li className="flex items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="h-2 w-2 rounded-full bg-welfare-blue mr-3"></span>
                School Discounts
            </li>
            <li className="flex items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="h-2 w-2 rounded-full bg-welfare-blue mr-3"></span>
                Expert Staff
            </li>
            <li className="flex items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="h-2 w-2 rounded-full bg-welfare-blue mr-3"></span>
                Local & Convenient
            </li>
        </ul>
      </div>

      <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 flex items-start space-x-4">
         <div className="shrink-0 bg-white p-2 rounded-full shadow-sm text-welfare-blue">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
         </div>
         <div>
            <h4 className="font-semibold text-slate-900">Verified Member</h4>
            <p className="text-sm text-slate-600 mt-1">
                This business has been verified by the Welfare School Parent Association.
            </p>
         </div>
      </div>
    </div>
  );

  const ContactView = () => (
     <div className="space-y-4 sm:space-y-6 animate-fade-in-up pt-6 sm:pt-10 px-0 sm:px-8">
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

  return (
    <>
        {/* Backdrop */}
        <div 
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        ></div>

        {/* Slide-over Panel */}
        <div 
            className={`fixed inset-y-0 right-0 z-[110] w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            {/* Close Button - Floating */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 p-2 bg-white/80 backdrop-blur rounded-full text-slate-500 hover:text-slate-900 shadow-sm border border-slate-100 hover:scale-105 transition-all"
            >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Content Container */}
            <div className="h-full flex flex-col">
                 {/* Scrollable Area */}
                 <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pb-28 sm:px-10 sm:pb-24">
                    {listing && (view === 'details' ? <DetailView /> : <ContactView />)}
                 </div>

                 {/* Sticky Footer */}
                 <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-100 p-4 sm:p-6 sm:px-10 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                    {view === 'details' ? (
                        <div className="flex gap-4">
                            <button 
                                type="button" 
                                onClick={() => setView('contact')}
                                className="flex-1 bg-welfare-blue text-white font-bold py-3 sm:py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center text-base sm:text-lg"
                            >
                                Contact Business
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                            <button 
                                type="button" 
                                onClick={() => !isSuccess && setView('details')}
                                className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 sm:py-4 rounded-xl hover:bg-slate-200 transition-all active:scale-95 text-base sm:text-lg"
                            >
                                {isSuccess ? 'Close' : 'Back'}
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
                    )}
                 </div>
            </div>
        </div>
    </>
  );
};

export default ListingDetailModal;
