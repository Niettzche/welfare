import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Preloader from '../components/Preloader';

const RegisterBusiness = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    surname: '',
    businessName: '',
    category: '',
    description: '',
    website: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Mouse position state for interactive background
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const totalSteps = 3;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // The actual state change to success will happen when the Preloader finishes
  };

  const handleAnimationFinish = () => {
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ surname: '', businessName: '', category: '', description: '', website: '' });
  };

  const categories = [
    "Health", "Education", "Food", "Professional", "Creative", "Other"
  ];

  if (isSubmitting) {
    return <Preloader 
      onFinish={handleAnimationFinish} 
      title="Registration Complete"
      subtitle="Your business is now listed"
    />;
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-10">
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
            step === s 
              ? 'border-white bg-white text-blue-900 scale-110 shadow-[0_0_20px_rgba(255,255,255,0.5)]' 
              : step > s 
                ? 'border-green-400 bg-green-400 text-white shadow-lg' 
                : 'border-white/30 text-white/50 bg-transparent'
          }`}>
            {step > s ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="font-semibold">{s}</span>
            )}
          </div>
          {s < 3 && (
            <div className={`w-16 sm:w-24 h-1 mx-2 rounded transition-all duration-500 ${
              step > s ? 'bg-green-400' : 'bg-white/20'
            }`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center py-12 relative overflow-hidden font-sans">
        
        {/* Dynamic & Interactive Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Base Gradient - Lighter, Brand Aligned */}
            <div className="absolute inset-0 bg-gradient-to-br from-welfare-blue via-blue-600 to-indigo-500"></div>
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            
            {/* Ambient Moving Blobs - Lighter tones */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/20 rounded-full mix-blend-overlay filter blur-[80px] animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-300/30 rounded-full mix-blend-overlay filter blur-[80px] animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-300/30 rounded-full mix-blend-overlay filter blur-[80px] animate-blob animation-delay-4000"></div>

            {/* Floating Logos */}
            <div className="absolute top-20 left-10 w-16 h-16 opacity-20 animate-elegant-float pointer-events-none">
                <img src="/src/assets/logo.png" alt="" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="absolute top-40 right-20 w-24 h-24 opacity-15 animate-elegant-float [animation-delay:1s] pointer-events-none">
                <img src="/src/assets/logo.png" alt="" className="w-full h-full object-contain brightness-0 invert -rotate-12" />
            </div>
            <div className="absolute bottom-40 right-20 w-32 h-32 opacity-10 animate-elegant-float [animation-delay:2s] pointer-events-none">
                <img src="/src/assets/logo.png" alt="" className="w-full h-full object-contain brightness-0 invert rotate-12" />
            </div>
            <div className="absolute bottom-10 left-1/3 w-20 h-20 opacity-15 animate-elegant-float [animation-delay:3s] pointer-events-none">
                <img src="/src/assets/logo.png" alt="" className="w-full h-full object-contain brightness-0 invert rotate-45" />
            </div>
            <div className="absolute top-1/2 left-[-50px] w-48 h-48 opacity-5 animate-spin-slower pointer-events-none blur-sm">
                <img src="/src/assets/logo.png" alt="" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="absolute top-[-40px] right-[20%] w-40 h-40 opacity-5 animate-spin-slow-reverse pointer-events-none blur-sm">
                <img src="/src/assets/logo.png" alt="" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="absolute bottom-[-20px] right-[-20px] w-56 h-56 opacity-5 animate-pulse pointer-events-none blur-md">
                <img src="/src/assets/logo.png" alt="" className="w-full h-full object-contain brightness-0 invert" />
            </div>

            {/* Interactive Cursor Glow */}
            <div 
                className="absolute w-[600px] h-[600px] bg-white/10 rounded-full pointer-events-none mix-blend-overlay filter blur-[60px] transition-transform duration-100 ease-out will-change-transform"
                style={{
                    left: -300,
                    top: -300,
                    transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
                }}
            ></div>
        </div>

        <section className="w-full max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="mb-8 text-center text-white">
                <h1 className="text-4xl font-black tracking-tight mb-2 drop-shadow-md">
                    Register Your Business
                </h1>
                <p className="text-blue-100 text-lg font-medium">
                    Join the Welfare School network today.
                </p>
            </div>

            {!isSuccess && renderStepIndicator()}

            {isSuccess ? (
                <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 text-center animate-fade-in-up shadow-2xl">
                    <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">You're All Set!</h2>
                    <p className="text-slate-600 mb-8 text-lg">Thank you for registering <strong>{formData.businessName}</strong>. <br/>Your listing is under review and will be live shortly.</p>
                    <div className="flex justify-center gap-4">
                        <Link 
                            to="/"
                            className="inline-flex justify-center rounded-xl bg-white border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
                        >
                            Return Home
                        </Link>
                        <button 
                            onClick={() => { setIsSuccess(false); setStep(1); setFormData({ surname: '', businessName: '', category: '', description: '', website: '' }); }}
                            className="inline-flex justify-center rounded-xl bg-welfare-blue px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-welfare-hover transition-all"
                        >
                            Register Another
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-10 animate-fade-in-up relative overflow-hidden">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600"></div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 mt-2">
                        
                        {/* STEP 1: Family Info */}
                        {step === 1 && (
                            <div className="space-y-6 animate-pop-in">
                                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">Step 1: Family Information</h2>
                                <div>
                                    <label htmlFor="surname" className="block text-sm font-semibold text-slate-700 mb-2">Family Name (Apellido)</label>
                                    <input
                                        type="text"
                                        name="surname"
                                        id="surname"
                                        required
                                        value={formData.surname}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-slate-50 focus:bg-white transition-all"
                                        placeholder="e.g. Familia Pérez"
                                        autoFocus
                                    />
                                    <p className="text-xs text-slate-500 mt-2">This helps parents recognize you within the school community.</p>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Business Info */}
                        {step === 2 && (
                            <div className="space-y-6 animate-pop-in">
                                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">Step 2: Business Details</h2>
                                <div>
                                    <label htmlFor="businessName" className="block text-sm font-semibold text-slate-700 mb-2">Business Name</label>
                                    <input
                                        type="text"
                                        name="businessName"
                                        id="businessName"
                                        required
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-slate-50 focus:bg-white transition-all"
                                        placeholder="e.g. Pérez Construction"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                                    <select
                                        name="category"
                                        id="category"
                                        required
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-slate-50 focus:bg-white transition-all"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="website" className="block text-sm font-semibold text-slate-700 mb-2">Website URL <span className="text-slate-400 font-normal">(Optional)</span></label>
                                    <input
                                        type="url"
                                        name="website"
                                        id="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-slate-50 focus:bg-white transition-all"
                                        placeholder="https://www.example.com"
                                    />
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Description & Review */}
                        {step === 3 && (
                            <div className="space-y-6 animate-pop-in">
                                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">Step 3: Description & Review</h2>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        id="description"
                                        rows="5"
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-slate-50 focus:bg-white transition-all resize-none"
                                        placeholder="Describe your services and what you offer to the community..."
                                        autoFocus
                                    ></textarea>
                                </div>
                                
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm space-y-2">
                                    <p><strong className="text-blue-900">Family:</strong> {formData.surname}</p>
                                    <p><strong className="text-blue-900">Business:</strong> {formData.businessName}</p>
                                    <p><strong className="text-blue-900">Category:</strong> {formData.category}</p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="px-6 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-semibold transition-colors"
                                >
                                    Back
                                </button>
                            ) : (
                                <div></div> // Spacer
                            )}

                            {step < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={
                                        (step === 1 && !formData.surname) ||
                                        (step === 2 && (!formData.businessName || !formData.category))
                                    }
                                    className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next Step
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !formData.description}
                                    className={`px-8 py-3 rounded-xl text-white font-bold shadow-lg transition-all ${
                                        isSubmitting 
                                        ? 'bg-blue-300 cursor-not-allowed' 
                                        : 'bg-green-500 hover:bg-green-600 shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-0.5'
                                    }`}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </section>
    </div>
  );
};

export default RegisterBusiness;
