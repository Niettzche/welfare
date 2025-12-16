import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Preloader from '../components/Preloader';
import logo from '../assets/logo.png';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

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
    discount: '',
    description: '',
    website: '',
    logoFile: null,
    coverFile: null
  });
  const [aiReviewData, setAiReviewData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [formError, setFormError] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  
  // Tag adding state
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInputValue, setNewTagInputValue] = useState("");
  
  // Mouse position state for interactive background
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);

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
    const stripHtml = (val) => val.replace(/<[^>]*>/g, '');
    const sanitizeBasic = (val) => stripHtml(val).replace(/[^\p{L}\p{N}\s.,;:!?'"()-]/gu, '');

    if (type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: checked }));
        return;
    }

    if (type === 'select-one') {
        const sanitized = stripHtml(value).trim();
        setFormData(prev => ({ ...prev, [name]: sanitized }));
        return;
    }

    if (name === 'email') {
        const sanitized = stripHtml(value)
            .replace(/\s/g, '')
            .replace(/[^a-zA-Z0-9@._+-]/g, '');
        setFormData(prev => ({ ...prev, email: sanitized }));
        return;
    }

    if (name === 'phone') {
        const sanitized = stripHtml(value).replace(/[^\d+\-()\s]/g, '');
        setFormData(prev => ({ ...prev, phone: sanitized }));
        return;
    }

    if (name === 'website') {
        const sanitized = stripHtml(value).trim();
        setFormData(prev => ({ ...prev, website: sanitized }));
        return;
    }

    const sanitizedValue = sanitizeBasic(value);
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
  };

  const handleNext = async () => {
    const isValidEmail = (email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    const isValidPhone = (phone) => /^[\d+\-()\s]{7,20}$/.test(phone);

    if (step === 1) {
        if (!isValidEmail(formData.email)) {
            setFormError('Please enter a valid email address.');
            return;
        }
        if (!isValidPhone(formData.phone)) {
            setFormError('Please enter a valid phone number (7-20 digits, + - ( ) allowed).');
            return;
        }
    }

    if (step === 2) {
        if (!formData.discount) {
            setFormError('Please select the community discount you can offer.');
            return;
        }
        const site = formData.website.trim();
        if (site && !/^https?:\/\//i.test(site)) {
            setFormError('Please include http:// or https:// in your website URL.');
            return;
        }
        if (!formData.description) {
            setFormError('Please provide a description.');
            return;
        }
    }

    setFormError('');

    if (step === 3) {
      // Transition to AI Review (Step 4)
      setIsGeneratingAi(true);
      
      try {
          const res = await fetch(`${API_BASE}/ai/optimize`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  description: formData.description,
                  category: formData.category,
                  business_name: formData.businessName
              })
          });

          if (!res.ok) throw new Error("AI Service unavailable");
          
          const data = await res.json();
          
          setAiReviewData({
            optimizedDescription: data.optimizedDescription || formData.description,
            tags: data.tags || [formData.category, "Verified"],
            suggestedImage: `https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80` // Placeholder for now
          });

      } catch (err) {
          console.error(err);
          // Fallback if AI fails
          setAiReviewData({
            optimizedDescription: formData.description,
            tags: [formData.category],
            suggestedImage: `https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80`
          });
      } finally {
          setIsGeneratingAi(false);
          setStep(4);
      }
    } else {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasAcceptedTerms) {
        setFormError('Please accept the commercial terms to continue.');
        return;
    }
    if (formData.website && !/^https?:\/\//i.test(formData.website.trim())) {
        setFormError('Please enter the full website URL including http:// or https://');
        return;
    }
    setFormError('');
    setIsSubmitting(true);

    const payload = {
        surname: formData.surname.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        show_email: formData.showEmail,
        show_phone: formData.showPhone,
        business_name: formData.businessName.trim(),
        category: formData.category,
        discount: formData.discount,
        description: (aiReviewData?.optimizedDescription || formData.description).trim(),
        website: formData.website.trim() || null,
        logo_url: null,
        cover_url: null,
        tags: aiReviewData?.tags || [],
    };

    try {
        if (formData.logoFile) {
            const form = new FormData();
            form.append('logo', formData.logoFile);
            const uploadRes = await fetch(`${API_BASE}/upload-logo`, {
                method: 'POST',
                body: form,
            });
            if (!uploadRes.ok) {
                const err = await uploadRes.json().catch(() => ({}));
                throw new Error(err.error || 'Error uploading logo.');
            }
            const uploadData = await uploadRes.json();
            payload.logo_url = uploadData.logo_url;
        }

        // Reuse logo endpoint for cover for now
        if (formData.coverFile) {
            const form = new FormData();
            form.append('logo', formData.coverFile);
            const uploadRes = await fetch(`${API_BASE}/upload-logo`, {
                method: 'POST',
                body: form,
            });
            if (!uploadRes.ok) {
                const err = await uploadRes.json().catch(() => ({}));
                throw new Error(err.error || 'Error uploading cover.');
            }
            const uploadData = await uploadRes.json();
            // payload.cover_url = uploadData.logo_url; // If backend supported it
        }

        const res = await fetch(`${API_BASE}/businesses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Unable to register business. Please try again.');
        }

        setIsSuccess(true);
    } catch (err) {
        setFormError(err.message);
    } finally {
        setIsSubmitting(false);
    }
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
        discount: '', 
        description: '', 
        website: '', 
        logoFile: null,
        coverFile: null
    });
    setAiReviewData(null);
    setLogoPreview(null);
    setCoverPreview(null);
    setFormError('');
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

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    setFormData(prev => ({ ...prev, logoFile: file }));
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);
    setFormData(prev => ({ ...prev, coverFile: file }));
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
                <Preloader 
                  onFinish={() => {
                    resetForm();
                    navigate('/');
                  }} 
                  title="You're now listed"
                  subtitle="Your business has been submitted"
                />
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

                        {/* STEP 2: Business Details */}
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
                                    <p className="text-xs text-slate-500 mt-2">If provided, include the full URL with http:// or https://</p>
                                </div>
                                <div>
                                    <label htmlFor="discount" className="block text-sm font-semibold text-slate-700 mb-2">Community Discount</label>
                                    <select
                                        name="discount"
                                        id="discount"
                                        required
                                        value={formData.discount}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-slate-50 focus:bg-white transition-all"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="5%">5% off for Welfare families</option>
                                        <option value="10%">10% off for Welfare families</option>
                                        <option value="15%">15% off for Welfare families</option>
                                        <option value="20%">20% off for Welfare families</option>
                                        <option value="25%">25% off for Welfare families</option>
                                        <option value="30%">30% off for Welfare families</option>
                                        <option value="40%">40% off for Welfare families</option>
                                        <option value="50%">50% off for Welfare families</option>
                                    </select>
                                    <p className="text-xs text-slate-500 mt-2">Choose the benefit you can offer to the community. You can detail conditions in the description.</p>
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        id="description"
                                        rows="5"
                                        required
                                        maxLength="500"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-slate-50 focus:bg-white transition-all resize-none"
                                        placeholder="Describe your services and what you offer to the community..."
                                        autoFocus
                                    ></textarea>
                                    <p className="text-xs text-slate-400 text-right mt-1">{formData.description.length}/500</p>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Media & Branding */}
                        {step === 3 && (
                            <div className="space-y-8 animate-pop-in">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">Step 3: Visual Identity</h2>
                                    <p className="text-sm text-slate-600 mt-2">
                                        Upload visuals to make your listing attractive.
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Logo Upload */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-bold text-slate-700">Business Logo</label>
                                        <div 
                                            className="border-2 border-dashed border-slate-200 rounded-2xl h-48 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group relative overflow-hidden" 
                                            onClick={() => logoInputRef.current?.click()}
                                        >
                                            {logoPreview ? (
                                                <>
                                                    <img src={logoPreview} alt="Logo Preview" className="h-full w-full object-contain p-4" />
                                                    <button 
                                                        type="button" 
                                                        onClick={(e) => { e.stopPropagation(); setLogoPreview(null); setFormData(prev => ({ ...prev, logoFile: null })); }}
                                                        className="absolute top-2 right-2 bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200 transition-colors shadow-sm"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="p-4">
                                                    <div className="h-12 w-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-700">Upload Logo</p>
                                                    <p className="text-xs text-slate-400 mt-1">Square format, png/jpg</p>
                                                </div>
                                            )}
                                            <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                                        </div>
                                    </div>

                                    {/* Cover Upload */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-bold text-slate-700">Cover Image</label>
                                        <div 
                                            className="border-2 border-dashed border-slate-200 rounded-2xl h-48 flex flex-col items-center justify-center text-center hover:border-purple-400 hover:bg-purple-50/30 transition-all cursor-pointer group relative overflow-hidden" 
                                            onClick={() => coverInputRef.current?.click()}
                                        >
                                            {coverPreview ? (
                                                <>
                                                    <img src={coverPreview} alt="Cover Preview" className="h-full w-full object-cover" />
                                                    <button 
                                                        type="button" 
                                                        onClick={(e) => { e.stopPropagation(); setCoverPreview(null); setFormData(prev => ({ ...prev, coverFile: null })); }}
                                                        className="absolute top-2 right-2 bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200 transition-colors shadow-sm"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="p-4">
                                                    <div className="h-12 w-12 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-700">Upload Cover</p>
                                                    <p className="text-xs text-slate-400 mt-1">Landscape, showing your work</p>
                                                </div>
                                            )}
                                            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverUpload} />
                                        </div>
                                    </div>
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
                                    Step 4: AI Enhancement
                                </h2>
                                
                                <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-sm font-bold text-purple-800 uppercase tracking-wide">AI Optimized Description</h3>
                                        <div className="flex items-center text-xs text-purple-600 bg-white px-2 py-1 rounded-md border border-purple-100">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                                            Generated
                                        </div>
                                    </div>
                                    <textarea 
                                        className="w-full text-slate-700 bg-white p-4 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm leading-relaxed resize-none transition-all"
                                        rows="5"
                                        value={aiReviewData.optimizedDescription}
                                        onChange={(e) => setAiReviewData(prev => ({...prev, optimizedDescription: e.target.value}))}
                                    />
                                    <p className="text-xs text-slate-500 mt-2">
                                        Feel free to edit this description. It will be shown on your public profile.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-slate-700 mb-2">Smart Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {aiReviewData.tags.map((tag, i) => (
                                            <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-sm">
                                                {tag}
                                            </span>
                                        ))}
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

                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mt-4">
                                    <div className="flex items-center h-5 text-amber-600">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="text-sm">
                                        <label className="font-bold text-amber-900 block mb-1">
                                            Verification Required
                                        </label>
                                        <p className="text-amber-800">
                                            A confirmation email will be sent to <span className="font-semibold">{formData.email}</span>. You must click the link in that email to activate your listing visible to the community.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {formError && (
                            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
                                {formError}
                            </div>
                        )}

                        <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                            {step > 1 ? (
                                <button type="button" onClick={handleBack} className="px-6 py-3 rounded-xl text-slate-500 hover:bg-slate-100 font-semibold transition-colors">Back</button>
                            ) : <div></div>}

                            {step < totalSteps ? (
                                <button type="button" onClick={handleNext} className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                                    {step === 3 ? 'Optimize with AI' : 'Next Step'}
                                </button>
                            ) : (
                                <button type="submit" disabled={isSubmitting || !hasAcceptedTerms} className={`px-8 py-3 rounded-xl text-white font-bold shadow-lg transition-all ${isSubmitting || !hasAcceptedTerms ? 'bg-slate-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}>
                                    {isSubmitting ? 'Submitting...' : 'Register Business'}
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
