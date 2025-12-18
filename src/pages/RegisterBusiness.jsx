import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Preloader from '../components/Preloader';
import ListingCard from '../components/ListingCard';
import logo from '../assets/logo.png';

import { API_BASE } from '../config';
import { useLanguage } from '../i18n/context.js';

const RegisterBusiness = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    surname: '',
    email: '',
    showEmail: false,
    phone: '+52 ',
    showPhone: false,
    businessName: '',
    category: '',
    discount: '',
    description: '',
    website: 'https://',
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
  const [logoUploadWarning, setLogoUploadWarning] = useState('');
  const [coverUploadWarning, setCoverUploadWarning] = useState('');
  const [useAiCover, setUseAiCover] = useState(false);
  const [useColorCover, setUseColorCover] = useState(false);
  const [coverColor, setCoverColor] = useState('#2563eb');
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [aiCoverUrl, setAiCoverUrl] = useState(null);
  const [aiCoverPrompt, setAiCoverPrompt] = useState('');
  const [hasCustomCoverPrompt, setHasCustomCoverPrompt] = useState(false);
  
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

  useEffect(() => {
    if (hasCustomCoverPrompt) return;
    const basePrompt = `Cover image for "${formData.businessName || 'Community Business'}" - category: ${formData.category || 'General'}. ${formData.description || 'Clean, welcoming and professional tone.'}`;
    setAiCoverPrompt(basePrompt);
  }, [formData.businessName, formData.category, formData.description, hasCustomCoverPrompt]);

  const totalSteps = 5;

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
            setFormError(t('register.errors.validEmail'));
            return;
        }
        if (!isValidPhone(formData.phone)) {
            setFormError(t('register.errors.validPhone'));
            return;
        }
    }

    if (step === 2) {
        const missing = [];
        if (!formData.discount) missing.push('descuento');
        if (!formData.description) missing.push('descripción');

        const site = formData.website.trim();
        const hasWebsite = site && site !== 'https://' && site !== 'http://';
        if (hasWebsite && !/^https?:\/\/[^.\s]+\.[^\s]+/i.test(site)) {
            setFormError(t('register.errors.validWebsite'));
            return;
        }
        if (missing.length) {
            setFormError(`Falta completar: ${missing.join(', ')}`);
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

          if (!res.ok) throw new Error(t('register.errors.aiUnavailable'));
          
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

  const redirectToMissingStep = (message) => {
    const msg = (message || '').toLowerCase();
    if (msg.includes('surname') || msg.includes('email') || msg.includes('phone')) return 1;
    if (msg.includes('business_name') || msg.includes('businessname') || msg.includes('category') || msg.includes('discount') || msg.includes('website')) return 2;
    if (msg.includes('description')) return 3;
    return 5;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValidEmail = (email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    const isValidPhone = (phone) => /^[\d+\-()\s]{7,20}$/.test(phone);
    const websiteValue = formData.website.trim();
    const hasWebsite = websiteValue && websiteValue !== 'https://' && websiteValue !== 'http://';

    // Final guardrails: if something is missing, jump to the step where it belongs.
    if (!formData.surname.trim()) {
        setFormError(t('register.errors.familyNameRequired'));
        setStep(1);
        return;
    }
    if (!isValidEmail(formData.email)) {
        setFormError(t('register.errors.validEmail'));
        setStep(1);
        return;
    }
    if (!isValidPhone(formData.phone)) {
        setFormError(t('register.errors.validPhone'));
        setStep(1);
        return;
    }
    if (!formData.businessName.trim() || !formData.category || !formData.discount) {
        setFormError(t('register.errors.completeBusinessDetails'));
        setStep(2);
        return;
    }
    if (hasWebsite && !/^https?:\/\/[^.\s]+\.[^\s]+/i.test(websiteValue)) {
        setFormError(t('register.errors.validWebsite'));
        setStep(2);
        return;
    }
    if (!formData.description.trim()) {
        setFormError(t('register.errors.provideDescription'));
        setStep(3);
        return;
    }
    if (!aiReviewData) {
        setFormError(t('register.errors.aiFirst'));
        setStep(4);
        return;
    }

    if (!hasAcceptedTerms) {
        setFormError(t('register.errors.acceptTerms'));
        setStep(5);
        return;
    }
    if (hasWebsite && !/^https?:\/\/[^.\s]+\.[^\s]+/i.test(websiteValue)) {
        setFormError(t('register.errors.validWebsite'));
        setStep(2);
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
        website: hasWebsite ? websiteValue : null,
        logo_url: null,
        background_url: null,
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
                throw new Error(err.error || t('register.errors.uploadLogo'));
            }
            const uploadData = await uploadRes.json();
            payload.logo_url = uploadData.logo_url;
        }

        if (useColorCover) {
            payload.background_url = coverPreview || null;
        } else if (useAiCover) {
            payload.background_url = aiCoverUrl || coverPreview || aiReviewData?.suggestedImage || null;
        } else if (formData.coverFile) {
            // Reuse logo endpoint for cover for now
            const form = new FormData();
            form.append('logo', formData.coverFile);
            const uploadRes = await fetch(`${API_BASE}/upload-logo`, {
                method: 'POST',
                body: form,
            });
            if (!uploadRes.ok) {
                const err = await uploadRes.json().catch(() => ({}));
                throw new Error(err.error || t('register.errors.uploadCover'));
            }
            const uploadData = await uploadRes.json();
            payload.background_url = uploadData.logo_url;
        }

        const res = await fetch(`${API_BASE}/businesses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || t('register.errors.registerFailed'));
        }

        setIsSuccess(true);
    } catch (err) {
        const msg = err?.message || t('register.errors.registerFailed');
        setFormError(msg);
        setStep(redirectToMissingStep(msg));
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
        phone: '+52 ', 
        showPhone: false, 
        businessName: '', 
        category: '', 
        discount: '',
        description: '', 
        website: 'https://',
        logoFile: null,
        coverFile: null
    });
    setAiReviewData(null);
    setLogoPreview(null);
    setCoverPreview(null);
    setLogoUploadWarning('');
    setCoverUploadWarning('');
    setFormError('');
    setUseAiCover(false);
    setUseColorCover(false);
    setCoverColor('#2563eb');
    setAiCoverUrl(null);
    setAiCoverPrompt('');
    setHasCustomCoverPrompt(false);
  };

  const coverDataUrlFromColor = (hexColor) => {
    const safeColor = String(hexColor || '#2563eb');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1792" height="1024" viewBox="0 0 1792 1024"><rect width="100%" height="100%" fill="${safeColor}"/></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const readImageMeta = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        resolve({ width, height, ratio: width && height ? width / height : null });
      };
      img.onerror = () => resolve({ width: null, height: null, ratio: null });
      img.src = url;
    });
  };

  const handleUseColorCoverChange = (e) => {
    const next = e.target.checked;
    setUseColorCover(next);
    setCoverUploadWarning('');
    setFormData((prev) => ({ ...prev, coverFile: null }));
    setAiCoverUrl(null);

    if (next) {
      setUseAiCover(false);
      if (coverPreview && String(coverPreview).startsWith('blob:')) URL.revokeObjectURL(coverPreview);
      setCoverPreview(coverDataUrlFromColor(coverColor));
    } else {
      if (coverPreview && String(coverPreview).startsWith('data:image/svg+xml')) setCoverPreview(null);
    }
  };

  const handleCoverColorChange = (nextColor) => {
    setCoverColor(nextColor);
    if (!useColorCover) return;
    if (coverPreview && String(coverPreview).startsWith('blob:')) URL.revokeObjectURL(coverPreview);
    setCoverPreview(coverDataUrlFromColor(nextColor));
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
    setFormError('');
    setLogoUploadWarning('');
    if (logoPreview && String(logoPreview).startsWith('blob:')) URL.revokeObjectURL(logoPreview);
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    setFormData(prev => ({ ...prev, logoFile: file }));

    readImageMeta(previewUrl).then(({ width, height, ratio }) => {
      const isSquareish = ratio != null && ratio >= 0.85 && ratio <= 1.15;
      const isLargeEnough = width != null && height != null ? width >= 512 && height >= 512 : true;
      if (!isSquareish || !isLargeEnough) setLogoUploadWarning(t('register.fields.logoNonStandardWarning'));
    });
  };

  const handleUseAiCoverChange = (e) => {
    const next = e.target.checked;
    setUseAiCover(next);
    if (next) {
      setCoverPreview(null);
      setCoverUploadWarning('');
      setUseColorCover(false);
      setAiCoverUrl(null);
      setFormData(prev => ({ ...prev, coverFile: null }));
    }
  };

  const generateCoverWithAi = async () => {
    setFormError('');
    setIsGeneratingCover(true);
    try {
      const res = await fetch(`${API_BASE}/ai/generate-cover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiCoverPrompt,
          business_name: formData.businessName,
          category: formData.category,
          description: formData.description,
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || t('register.errors.coverAi'));
      }
      const data = await res.json();
      setAiCoverUrl(data.cover_url);
      setCoverPreview(data.cover_url);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormError('');
    setCoverUploadWarning('');
    if (coverPreview && String(coverPreview).startsWith('blob:')) URL.revokeObjectURL(coverPreview);
    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);
    setUseColorCover(false);
    setFormData(prev => ({ ...prev, coverFile: file }));

    readImageMeta(previewUrl).then(({ width, height, ratio }) => {
      const isLandscape = ratio != null ? ratio >= 1.3 : true;
      const isLargeEnough = width != null && height != null ? width >= 1200 && height >= 675 : true;
      if (!isLandscape || !isLargeEnough) setCoverUploadWarning(t('register.fields.coverNonStandardWarning'));
    });
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
     return (
      <Layout>
        <Preloader 
          onFinish={() => {}} // No-op, managed by timeout
          title={t('register.preloaderAiTitle')}
          subtitle={t('register.preloaderAiSubtitle')}
        />
      </Layout>
     );
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-10">
      {[1, 2, 3, 4, 5].map((s) => (
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
          {s < 5 && (
            <div className={`w-8 sm:w-16 h-1 mx-1 rounded transition-all duration-500 ${
              step > s ? 'bg-green-400' : 'bg-white/20'
            }`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <Layout>
    <div className="min-h-full bg-blue-50 flex flex-col items-center justify-center py-12 relative overflow-hidden font-sans w-full">
        
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
                    {t('register.title')}
                </h1>
                <p className="text-blue-100 text-lg font-medium">
                    {t('register.subtitle')}
                </p>
            </div>

            {!isSuccess && renderStepIndicator()}

            {isSuccess ? (
                <Preloader 
                  onFinish={() => {
                    resetForm();
                    navigate('/');
                  }} 
                  exitDelayMs={1400}
                  finishDelayMs={2000}
                  title={t('register.successTitle')}
                  subtitle={t('register.successSubtitle')}
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
	                                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">{t('register.steps.s1')}</h2>
	                                <div>
	                                    <label htmlFor="surname" className="block text-sm font-semibold text-slate-700 mb-2">{t('register.fields.surnameLabel')}</label>
	                                    <input
                                        type="text"
                                        name="surname"
                                        id="surname"
                                        required
                                        value={formData.surname}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-slate-50 focus:bg-white transition-all"
	                                        placeholder={t('register.fields.surnamePlaceholder')}
	                                        autoFocus
	                                    />
	                                    <p className="text-xs text-slate-500 mt-2">{t('register.fields.surnameHelp')}</p>
	                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
	                                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">{t('register.fields.emailLabel')}</label>
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
	                                            <label htmlFor="showEmail" className="ml-2 text-xs text-slate-600 cursor-pointer">{t('register.fields.displayPublicly')}</label>
	                                        </div>
	                                    </div>
	                                    <div>
	                                        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">{t('register.fields.phoneLabel')}</label>
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
	                                            <label htmlFor="showPhone" className="ml-2 text-xs text-slate-600 cursor-pointer">{t('register.fields.displayPublicly')}</label>
	                                        </div>
	                                    </div>
	                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-800 flex items-start">
                                    <svg className="w-4 h-4 mr-2 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
	                                    <p>{t('register.fields.contactNote')}</p>
	                                </div>
	                            </div>
	                        )}

                        {/* STEP 2: Business Details */}
	                        {step === 2 && (
	                            <div className="space-y-6 animate-pop-in">
	                                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">{t('register.steps.s2')}</h2>
	                                <div>
	                                    <label htmlFor="businessName" className="block text-sm font-semibold text-slate-700 mb-2">{t('register.fields.businessNameLabel')}</label>
	                                    <input
                                        type="text"
                                        name="businessName"
                                        id="businessName"
                                        required
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-slate-50 focus:bg-white transition-all"
	                                        placeholder={t('register.fields.businessNamePlaceholder')}
	                                        autoFocus
	                                    />
	                                </div>
	                                <div>
	                                    <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2">{t('register.fields.categoryLabel')}</label>
	                                    <select
                                        name="category"
                                        id="category"
                                        required
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-slate-50 focus:bg-white transition-all"
                                    >
	                                        <option value="">{t('register.fields.categoryPlaceholder')}</option>
	                                        {categories.map(cat => (
	                                            <option key={cat} value={cat}>{cat}</option>
	                                        ))}
	                                    </select>
	                                </div>
	                                <div>
	                                    <label htmlFor="website" className="block text-sm font-semibold text-slate-700 mb-2">
	                                      {t('register.fields.websiteLabel')} <span className="text-slate-400 font-normal">{t('register.fields.optional')}</span>
	                                    </label>
	                                    <input
                                        type="url"
                                        name="website"
                                        id="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-slate-50 focus:bg-white transition-all"
	                                        placeholder={t('register.fields.websitePlaceholder')}
	                                    />
	                                    <p className="text-xs text-slate-500 mt-2">{t('register.fields.websiteHelp')}</p>
	                                </div>
	                                <div>
	                                    <label htmlFor="discount" className="block text-sm font-semibold text-slate-700 mb-2">{t('register.fields.discountLabel')}</label>
	                                    <select
                                        name="discount"
                                        id="discount"
                                        required
                                        value={formData.discount}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-slate-50 focus:bg-white transition-all"
                                    >
	                                        <option value="">{t('register.fields.discountPlaceholder')}</option>
	                                        <option value="N/A">Sin descuento</option>
	                                        <option value="5%">{t('register.fields.discountOption', { pct: 5 })}</option>
	                                        <option value="10%">{t('register.fields.discountOption', { pct: 10 })}</option>
	                                        <option value="15%">{t('register.fields.discountOption', { pct: 15 })}</option>
	                                        <option value="20%">{t('register.fields.discountOption', { pct: 20 })}</option>
	                                        <option value="25%">{t('register.fields.discountOption', { pct: 25 })}</option>
	                                        <option value="30%">{t('register.fields.discountOption', { pct: 30 })}</option>
	                                        <option value="40%">{t('register.fields.discountOption', { pct: 40 })}</option>
	                                        <option value="50%">{t('register.fields.discountOption', { pct: 50 })}</option>
	                                    </select>
	                                    <p className="text-xs text-slate-500 mt-2">{t('register.fields.discountHelp')}</p>
	                                </div>
	                                <div>
	                                    <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">{t('register.fields.descriptionLabel')}</label>
	                                    <textarea
                                        name="description"
                                        id="description"
                                        rows="5"
                                        required
                                        maxLength="500"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-slate-50 focus:bg-white transition-all resize-none"
	                                        placeholder={t('register.fields.descriptionPlaceholder')}
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
	                                    <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">{t('register.steps.s3')}</h2>
		                                    <p className="text-sm text-slate-600 mt-2">
		                                        {t('register.fields.visualsSubtitle')}
		                                    </p>
	                                        <p className="text-xs text-slate-500 mt-1">{t('register.fields.recommendedNote')}</p>
		                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
		                                    {/* Logo Upload */}
		                                    <div className="space-y-3">
		                                        <label className="block text-sm font-bold text-slate-700">{t('register.fields.logoLabel')}</label>
		                                        {logoUploadWarning && (
		                                          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
		                                            {logoUploadWarning}
		                                          </p>
		                                        )}
		                                        <div 
		                                            className="border-2 border-dashed border-slate-200 rounded-2xl h-48 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group relative overflow-hidden" 
		                                            onClick={() => logoInputRef.current?.click()}
		                                        >
		                                            {logoPreview ? (
		                                                <>
		                                                    <img src={logoPreview} alt={t('register.fields.logoAltPreview')} className="h-full w-full object-contain p-4" />
		                                                    <button 
		                                                        type="button" 
		                                                        onClick={(e) => { 
		                                                          e.stopPropagation(); 
		                                                          if (logoPreview && String(logoPreview).startsWith('blob:')) URL.revokeObjectURL(logoPreview);
		                                                          setLogoPreview(null); 
		                                                          setLogoUploadWarning('');
		                                                          setFormData(prev => ({ ...prev, logoFile: null })); 
		                                                        }}
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
	                                                    <p className="text-sm font-semibold text-slate-700">{t('register.fields.logoCta')}</p>
	                                                    <p className="text-xs text-slate-400 mt-1">{t('register.fields.logoHint')}</p>
                                                </div>
	                                            )}
                                            <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                                        </div>
                                    </div>

		                                    {/* Cover Upload */}
		                                    <div className={`space-y-3 ${(useAiCover || useColorCover) ? 'opacity-50 select-none' : ''}`}>
		                                        <label className="block text-sm font-bold text-slate-700">{t('register.fields.coverLabel')}</label>
		                                        {coverUploadWarning && (
		                                          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
		                                            {coverUploadWarning}
		                                          </p>
		                                        )}
		                                        <div 
		                                            className={`border-2 border-dashed border-slate-200 rounded-2xl h-48 flex flex-col items-center justify-center text-center transition-all group relative overflow-hidden ${
		                                              (useAiCover || useColorCover) ? 'cursor-not-allowed' : 'hover:border-purple-400 hover:bg-purple-50/30 cursor-pointer'
		                                            }`} 
		                                            onClick={() => {
		                                              if (useAiCover || useColorCover) return;
		                                              coverInputRef.current?.click();
		                                            }}
		                                        >
		                                            {coverPreview ? (
		                                                <>
		                                                    <img src={coverPreview} alt={t('register.fields.coverAltPreview')} className="h-full w-full object-cover" />
		                                                    <button 
		                                                        type="button" 
		                                                        onClick={(e) => { 
		                                                          e.stopPropagation(); 
		                                                          if (coverPreview && String(coverPreview).startsWith('blob:')) URL.revokeObjectURL(coverPreview);
		                                                          setCoverPreview(null); 
		                                                          setCoverUploadWarning('');
		                                                          setUseColorCover(false);
		                                                          setFormData(prev => ({ ...prev, coverFile: null })); 
		                                                        }}
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
	                                                    <p className="text-sm font-semibold text-slate-700">{t('register.fields.coverCta')}</p>
	                                                    <p className="text-xs text-slate-400 mt-1">{t('register.fields.coverHint')}</p>
	                                                </div>
	                                            )}
                                            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverUpload} />
                                        </div>
		                                        {useAiCover && (
		                                            <p className="text-xs text-slate-500">{t('register.fields.coverAiDisabledHint')}</p>
		                                        )}
		                                    </div>
		                                </div>

	                                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-4">
	                                    <div>
	                                        <p className="text-sm font-semibold text-slate-900">{t('register.fields.colorCoverToggleTitle')}</p>
	                                        <p className="text-xs text-slate-500 mt-0.5">{t('register.fields.colorCoverToggleDesc')}</p>
	                                    </div>
	                                    <label className="inline-flex items-center cursor-pointer select-none">
	                                        <input
	                                            type="checkbox"
	                                            checked={useColorCover}
	                                            onChange={handleUseColorCoverChange}
	                                            className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
	                                        />
	                                    </label>
	                                </div>

	                                {useColorCover && (
	                                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
	                                    <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
	                                      {t('register.fields.colorCoverPick')}
	                                    </div>
	                                    <div className="flex flex-wrap gap-2">
	                                      {[
	                                        '#0ea5e9',
	                                        '#2563eb',
	                                        '#7c3aed',
	                                        '#db2777',
	                                        '#ef4444',
	                                        '#f59e0b',
	                                        '#10b981',
	                                        '#111827',
	                                      ].map((c) => (
	                                        <button
	                                          key={c}
	                                          type="button"
	                                          onClick={() => handleCoverColorChange(c)}
	                                          className={`h-8 w-8 rounded-full border transition-transform active:scale-95 ${coverColor === c ? 'border-slate-900 ring-2 ring-slate-900/20' : 'border-slate-200'}`}
	                                          style={{ backgroundColor: c }}
	                                          aria-label={c}
	                                        />
	                                      ))}
	                                    </div>

	                                    <div className="flex items-center justify-between">
	                                      <div className="text-xs text-slate-500">{t('register.fields.colorCoverCustom')}</div>
	                                      <input
	                                        type="color"
	                                        value={coverColor}
	                                        onChange={(e) => handleCoverColorChange(e.target.value)}
	                                        className="h-10 w-14 rounded-md border border-slate-200 bg-white"
	                                      />
	                                    </div>
	                                  </div>
	                                )}

	                                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-4">
	                                    <div>
		                                        <p className="text-sm font-semibold text-slate-900">{t('register.fields.aiCoverToggleTitle')}</p>
		                                        <p className="text-xs text-slate-500 mt-0.5">{t('register.fields.aiCoverToggleDesc')}</p>
	                                    </div>
                                    <label className="inline-flex items-center cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={useAiCover}
                                            onChange={handleUseAiCoverChange}
                                            className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </label>
                                </div>

                                {useAiCover && (
                                    <div className="space-y-4 bg-white border border-slate-200 rounded-xl p-4">
	                                        <div className="flex items-center justify-between">
	                                            <div>
	                                                <p className="text-sm font-semibold text-slate-900">{t('register.fields.aiCoverTitle')}</p>
	                                                <p className="text-xs text-slate-500 mt-0.5">{t('register.fields.aiCoverDesc')}</p>
                                                    <p className="text-[11px] text-slate-400 mt-1">Recomendado: 1792 x 1024 (horizontal).</p>
	                                            </div>
                                                <button
                                                    type="button"
                                                    onClick={generateCoverWithAi}
                                                    disabled={isGeneratingCover || !formData.businessName || !formData.category || !formData.description}
                                                    className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
	                                                    {isGeneratingCover
	                                                      ? t('register.fields.aiCoverGenerating')
	                                                      : (coverPreview ? t('register.fields.aiCoverRegenerate') : t('register.fields.aiCoverGenerate'))}
	                                                </button>
	                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Prompt de la portada (editable)</label>
                                                <textarea
                                                  value={aiCoverPrompt}
                                                  onChange={(e) => { setAiCoverPrompt(e.target.value); setHasCustomCoverPrompt(true); }}
                                                  rows="3"
                                                  className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 text-sm p-3 shadow-sm"
                                                  placeholder="Describe el estilo, colores y ambiente que deseas ver en la portada."
                                                />
                                            </div>
	                                    </div>
	                                )}
	                            </div>
	                        )}

                        {/* STEP 4: AI Enhancement */}
	                        {step === 4 && aiReviewData && (
	                            <div className="space-y-6 animate-pop-in">
	                                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center">
                                    <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
	                                    {t('register.steps.s4')}
	                                </h2>
                                
                                <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
	                                        <h3 className="text-sm font-bold text-purple-800 uppercase tracking-wide">{t('register.fields.aiOptimizedTitle')}</h3>
                                        <div className="flex items-center text-xs text-purple-600 bg-white px-2 py-1 rounded-md border border-purple-100">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
	                                            {t('register.fields.generated')}
	                                        </div>
                                    </div>
                                    <textarea 
                                        className="w-full text-slate-700 bg-white p-4 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm leading-relaxed resize-none transition-all"
                                        rows="5"
                                        value={aiReviewData.optimizedDescription}
                                        onChange={(e) => setAiReviewData(prev => ({...prev, optimizedDescription: e.target.value}))}
                                    />
	                                    <p className="text-xs text-slate-500 mt-2">{t('register.fields.aiEditHelp')}</p>
	                                </div>

	                                <div>
	                                    <h3 className="text-sm font-bold text-slate-700 mb-2">{t('register.fields.smartTags')}</h3>
	                                    <div className="flex flex-wrap gap-2">
                                        {aiReviewData.tags.map((tag, i) => (
                                            <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 5: Preview & Submit */}
	                        {step === 5 && aiReviewData && (
	                            <div className="space-y-6 animate-pop-in">
	                                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">{t('register.steps.s5')}</h2>

                                <div className="max-w-sm">
	                                    <ListingCard
	                                        title={formData.businessName || t('register.fields.previewFallbackBusiness')}
	                                        category={formData.category || t('register.fields.previewFallbackCategory')}
                                        subCategory={undefined}
                                        description={aiReviewData.optimizedDescription || formData.description || ''}
                                        imageUrl={aiCoverUrl || coverPreview || aiReviewData.suggestedImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'}
                                        logoUrl={logoPreview || undefined}
                                        delay=""
                                        isPrimary
                                        onContact={() => {}}
                                        icon={
                                            <svg className="h-8 w-8 text-welfare-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 21h18M5 21V7a2 2 0 012-2h4v16m0-16h4a2 2 0 012 2v14M9 9h.01M9 12h.01M9 15h.01M15 9h.01M15 12h.01M15 15h.01" />
                                            </svg>
                                        }
                                    />
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
	                                            {t('register.fields.termsTitle')}
	                                        </label>
	                                        <p className="text-slate-500 mt-1">
	                                            {t('register.fields.termsBodyPrefix')}{' '}
	                                            <Link to="/privacy" target="_blank" className="text-purple-600 hover:text-purple-800 underline font-semibold">
	                                              {t('register.fields.termsLink')}
	                                            </Link>
	                                            {t('register.fields.termsBodySuffix')}
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
                                <button type="button" onClick={handleBack} className="px-6 py-3 rounded-xl text-slate-500 hover:bg-slate-100 font-semibold transition-colors">{t('register.actions.back')}</button>
                            ) : <div></div>}

                            {step < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={isGeneratingCover}
                                    className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${
                                        isGeneratingCover
                                            ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5'
                                    }`}
                                >
                                    {step === 3 ? 'Siguiente paso' : step === 4 ? t('register.actions.preview') : t('register.actions.nextStep')}
                                </button>
                            ) : (
                                <button type="submit" disabled={isSubmitting || !hasAcceptedTerms} className={`px-8 py-3 rounded-xl text-white font-bold shadow-lg transition-all ${isSubmitting || !hasAcceptedTerms ? 'bg-slate-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}>
                                    {isSubmitting ? t('register.actions.submitting') : t('register.actions.submit')}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </section>
    </div>
    </Layout>
  );
};

export default RegisterBusiness;
