import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Preloader from '../components/Preloader';
import logo from '../assets/logo.png';

const RegisterBusiness = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    surname: '',
    email: '',
    showEmail: false,
    phone: '',
    showPhone: false,
    businessName: '',
    category: '',
    description: '',
    website: ''
  });
  const [aiReviewData, setAiReviewData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  
  // Tag adding state
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInputValue, setNewTagInputValue] = useState("");
  
  // Mouse position state for interactive background
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const totalSteps = 4;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleNext = () => {
    if (step === 3) {
      // Trigger AI generation simulation
      setIsGeneratingAi(true);
      setTimeout(() => {
        setAiReviewData({
          optimizedDescription: `✨ AI Enhanced: ${formData.description} We are a family-owned business dedicated to excellence in ${formData.category}, serving the Welfare community with pride.`,
          suggestedImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", // Generic office placeholder
          tags: ["Community Verified", "Family Owned", "Top Rated"]
        });
        setIsGeneratingAi(false);
        setStep(4);
      }, 2000);
    } else {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
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
    navigate('/');
  };

  // Helper to reset form fully
  const resetForm = () => {
    setIsSuccess(false);
    setStep(1);
    setFormData({ 
        surname: '', 
        email: '', 
        showEmail: false, 
        phone: '', 
        showPhone: false, 
        businessName: '', 
        category: '', 
        description: '', 
        website: '' 
    });
    setAiReviewData(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        setAiReviewData(prev => ({
            ...prev,
            suggestedImage: imageUrl
        }));
    }
  };

  const handleAddTag = () => {
    if (newTagInputValue.trim()) {
        setAiReviewData(prev => ({
            ...prev,
            tags: [...prev.tags, newTagInputValue.trim()]
        }));
        setNewTagInputValue("");
        setIsAddingTag(false);
    }
  };

  const categories = [
    "Technology & IT",
    "Health & Wellness", 
    "Education & Tutoring", 
    "Food & Beverage", 
    "Professional Services", 
    "Creative & Arts",
    "Retail & Shopping",
    "Manufacturing & Industry",
    "Construction & Trades",
    "Automotive",
    "Real Estate",
    "Finance & Insurance",
    "Legal Services",
    "Personal Care & Beauty",
    "Entertainment & Events",
    "Travel & Tourism",
    "Agriculture & Farming",
    "Non-Profit",
    "Other"
  ];

  if (isSubmitting) {
    return <Preloader 
      onFinish={handleAnimationFinish} 
      title="Registration Complete"
      subtitle="Your business is now listed"
    />;
  }

  if (isGeneratingAi) {
     return <Preloader 
      onFinish={() => {}} // No-op, managed by timeout
      title="AI Optimizing"
      subtitle="Generating the best profile for you..."
    />;
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-10">
      {[1, 2, 3, 4].map((s) => (
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
          {s < 4 && (
            <div className={`w-8 sm:w-16 h-1 mx-1 rounded transition-all duration-500 ${
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
                <img src={logo} alt="" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="absolute top-40 right-20 w-24 h-24 opacity-15 animate-elegant-float [animation-delay:1s] pointer-events-none">
                <img src={logo} alt="" className="w-full h-full object-contain brightness-0 invert -rotate-12" />
            </div>
            <div className="absolute bottom-40 right-20 w-32 h-32 opacity-10 animate-elegant-float [animation-delay:2s] pointer-events-none">
                <img src={logo} alt="" className="w-full h-full object-contain brightness-0 invert rotate-12" />
            </div>
            <div className="absolute bottom-10 left-1/3 w-20 h-20 opacity-15 animate-elegant-float [animation-delay:3s] pointer-events-none">
                <img src={logo} alt="" className="w-full h-full object-contain brightness-0 invert rotate-45" />
            </div>
            <div className="absolute top-1/2 left-[-50px] w-48 h-48 opacity-5 animate-spin-slower pointer-events-none blur-sm">
                <img src={logo} alt="" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="absolute top-[-40px] right-[20%] w-40 h-40 opacity-5 animate-spin-slow-reverse pointer-events-none blur-sm">
                <img src={logo} alt="" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="absolute bottom-[-20px] right-[-20px] w-56 h-56 opacity-5 animate-pulse pointer-events-none blur-md">
                <img src={logo} alt="" className="w-full h-full object-contain brightness-0 invert" />
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

        <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
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
                            onClick={resetForm}
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
                    
                    <form 
                        onSubmit={handleSubmit} 
                        className="space-y-6 mt-2"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                                e.preventDefault();
                                // Optionally trigger next step if validation passes, but simpler to just block
                                // blocking accidental submits is the primary goal
                            }
                        }}
                    >
                        
                        {/* STEP 1: Family Info */}
                        {step === 1 && (
                            <div className="space-y-6 animate-pop-in">
                                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">Step 1: Contact & Verification</h2>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-slate-50 focus:bg-white transition-all"
                                            placeholder="you@example.com"
                                        />
                                        <div className="mt-2 flex items-center">
                                            <input
                                                type="checkbox"
                                                name="showEmail"
                                                id="showEmail"
                                                checked={formData.showEmail}
                                                onChange={handleChange}
                                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="showEmail" className="ml-2 text-xs text-slate-600 cursor-pointer">Display publicly on listing</label>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            id="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-slate-50 focus:bg-white transition-all"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                        <div className="mt-2 flex items-center">
                                            <input
                                                type="checkbox"
                                                name="showPhone"
                                                id="showPhone"
                                                checked={formData.showPhone}
                                                onChange={handleChange}
                                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="showPhone" className="ml-2 text-xs text-slate-600 cursor-pointer">Display publicly on listing</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-800 flex items-start">
                                    <svg className="w-4 h-4 mr-2 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p>We use this information to verify your identity as a parent. You can choose to display different contact details on your public listing later.</p>
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

                        {/* STEP 3: Description */}
                        {step === 3 && (
                            <div className="space-y-6 animate-pop-in">
                                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">Step 3: Description</h2>
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
                            </div>
                        )}

                        {/* STEP 4: AI Review & Approval */}
                        {step === 4 && aiReviewData && (
                            <div className="space-y-6 animate-pop-in">
                                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center">
                                    <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    Step 4: AI Review
                                </h2>
                                
                                <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                    <div className="h-40 bg-slate-200 relative group">
                                        <img src={aiReviewData.suggestedImage} alt="AI Suggestion" className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90" />
                                        <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                                            AI Selected
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => fileInputRef.current.click()}
                                            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                                        >
                                            <div className="bg-white/20 backdrop-blur-md border border-white/50 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center shadow-lg hover:bg-white/30 transition-colors">
                                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Change Image
                                            </div>
                                        </button>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Optimized Description</h3>
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        setIsGeneratingAi(true);
                                                        setTimeout(() => {
                                                            setAiReviewData(prev => ({
                                                                ...prev,
                                                                optimizedDescription: `✨ New Version: We pride ourselves on delivering top-tier ${formData.category} services. Our commitment to the Welfare family is unwavering. Come visit us!`,
                                                                suggestedImage: `https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80&random=${Math.random()}`
                                                            }));
                                                            setIsGeneratingAi(false);
                                                        }, 1500);
                                                    }}
                                                    className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center"
                                                >
                                                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    Regenerate
                                                </button>
                                            </div>
                                            <textarea 
                                                className="w-full mt-1 text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none text-sm"
                                                rows="4"
                                                value={aiReviewData.optimizedDescription}
                                                onChange={(e) => setAiReviewData(prev => ({...prev, optimizedDescription: e.target.value}))}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Suggested Tags</h3>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {aiReviewData.tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium relative group cursor-default">
                                                        {tag}
                                                    </span>
                                                ))}
                                                
                                                {isAddingTag ? (
                                                    <div className="flex items-center">
                                                        <input 
                                                            type="text" 
                                                            value={newTagInputValue}
                                                            onChange={(e) => setNewTagInputValue(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                                            className="w-24 px-2 py-1 text-xs border border-blue-300 rounded-l-full focus:outline-none focus:border-blue-500 h-6"
                                                            autoFocus
                                                            placeholder="New tag..."
                                                        />
                                                        <button 
                                                            type="button" 
                                                            onClick={handleAddTag}
                                                            className="px-2 py-1 bg-blue-600 text-white rounded-r-full text-xs hover:bg-blue-700 h-6 flex items-center"
                                                        >
                                                            ✓
                                                        </button>
                                                         <button 
                                                            type="button" 
                                                            onClick={() => setIsAddingTag(false)}
                                                            className="ml-1 text-slate-400 hover:text-slate-600 h-6 w-6 flex items-center justify-center rounded-full hover:bg-slate-100"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        type="button"
                                                        onClick={() => setIsAddingTag(true)}
                                                        className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium hover:bg-slate-200 transition-colors flex items-center border border-slate-200 border-dashed"
                                                    >
                                                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                        </svg>
                                                        Add
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="terms"
                                            name="terms"
                                            type="checkbox"
                                            checked={hasAcceptedTerms}
                                            onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                                            className="h-5 w-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                        />
                                    </div>
                                    <div className="text-sm">
                                        <label htmlFor="terms" className="font-medium text-slate-900 cursor-pointer select-none">
                                            I authorize the commercial use of this data.
                                        </label>
                                        <p className="text-slate-500 mt-1">
                                            By checking this box, I agree to the <Link to="/privacy" target="_blank" className="text-purple-600 hover:text-purple-800 underline font-semibold">Privacy Policy & Commercial Terms</Link>, granting permission to store and use my business information for directory and marketing purposes.
                                        </p>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-500 text-center">
                                    Review the AI-enhanced details above. You can proceed with these changes or go back to edit your original input.
                                </p>
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
                                        (step === 1 && (!formData.surname || !formData.email || !formData.phone)) ||
                                        (step === 2 && (!formData.businessName || !formData.category)) ||
                                        (step === 3 && !formData.description)
                                    }
                                    className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {step === 3 ? 'Generate AI Preview' : 'Next Step'}
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !hasAcceptedTerms}
                                    className={`px-8 py-3 rounded-xl text-white font-bold shadow-lg transition-all ${
                                        isSubmitting || !hasAcceptedTerms
                                        ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none' 
                                        : 'bg-green-500 hover:bg-green-600 shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-0.5'
                                    }`}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Approve & Register'}
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
