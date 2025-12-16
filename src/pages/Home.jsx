import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import ListingCard from '../components/ListingCard';
import Pagination from '../components/Pagination';
import Preloader from '../components/Preloader';
import ListingDetailModal from '../components/ListingDetailModal';
import AiAssistantModal from '../components/AiAssistantModal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Health & Wellness':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />;
    case 'Technology & IT':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />;
    case 'Education & Tutoring':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />;
    case 'Food & Beverage':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />;
    case 'Professional Services':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />;
    case 'Retail & Shopping':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />;
    case 'Manufacturing & Industry':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />;
    case 'Construction & Trades':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />;
    case 'Automotive':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />; 
    case 'Real Estate':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />;
    case 'Finance & Insurance':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
    case 'Creative & Arts':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />;
    default:
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
  }
};

const mockListings = [
  {
    id: 1,
    title: "Apex Dental Care",
    category: "Health & Wellness",
    subCategory: "Dental",
    description: "Comprehensive dental care for the whole family, specializing in pediatric dentistry and orthodontics.",
    imageUrl: "https://images.unsplash.com/photo-1606811841689-230391b3d3d6?auto=format&fit=crop&w=800&q=80",
    delay: "",
    surname: "Dr. Patel Family",
    email: "info@apexdental.com",
    phone: "(555) 123-4567"
  },
  {
    id: 2,
    title: "CodeWizards Academy",
    category: "Technology & IT",
    subCategory: "Education",
    description: "Coding bootcamps and robotics workshops designed to inspire the next generation of tech leaders.",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    delay: "delay-100",
    surname: "The Chen Family",
    website: "https://codewizards.edu"
  },
  {
    id: 3,
    title: "GreenLeaf Market",
    category: "Retail & Shopping",
    subCategory: "Groceries",
    description: "Your local source for organic produce, eco-friendly household goods, and bulk pantry staples.",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    delay: "delay-200",
    surname: "Garcia-Lopez Family"
  },
  {
    id: 4,
    title: "BuildRight Construction",
    category: "Construction & Trades",
    subCategory: "Renovation",
    description: "Reliable home renovations and general contracting. We turn your vision into reality with quality craftsmanship.",
    imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
    delay: "delay-300"
  },
  {
    id: 5,
    title: "Welfare Automotive",
    category: "Automotive",
    subCategory: "Repair",
    description: "Trusted auto repair and maintenance. ASE certified mechanics ready to keep your vehicle running smoothly.",
    imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80",
    delay: "delay-400"
  },
  {
    id: 6,
    title: "Prime Estates",
    category: "Real Estate",
    subCategory: "Agency",
    description: "Helping families find their dream homes in the Welfare school district. Expert local market knowledge.",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    delay: ""
  },
  {
    id: 7,
    title: "SecureFuture Financial",
    category: "Finance & Insurance",
    subCategory: "Planning",
    description: "Personalized financial planning and insurance solutions to protect what matters most to you.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    delay: "delay-100"
  },
  {
    id: 8,
    title: "Legal Eagles LLP",
    category: "Legal Services",
    subCategory: "Family Law",
    description: "Compassionate legal representation for family law, estate planning, and small business support.",
    imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80",
    delay: "delay-200"
  },
  {
    id: 9,
    title: "Glow Beauty Studio",
    category: "Personal Care & Beauty",
    subCategory: "Salon",
    description: "A full-service salon offering hair, nails, and skincare treatments in a relaxing and modern environment.",
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    delay: "delay-300"
  },
  {
    id: 10,
    title: "EventHorizon Planners",
    category: "Entertainment & Events",
    subCategory: "Party Planning",
    description: "Creating unforgettable experiences for birthdays, weddings, and community gatherings.",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    delay: "delay-400"
  },
  {
    id: 11,
    title: "Wanderlust Travels",
    category: "Travel & Tourism",
    subCategory: "Agency",
    description: "Curated travel packages for families and individuals. Explore the world with confidence and ease.",
    imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
    delay: ""
  },
  {
    id: 12,
    title: "Harvest Moon Farms",
    category: "Agriculture & Farming",
    subCategory: "Local Produce",
    description: "Providing fresh, locally grown fruits and vegetables directly to the community through our CSA program.",
    imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    delay: "delay-100"
  },
  {
    id: 13,
    title: "Community Hearts",
    category: "Non-Profit",
    subCategory: "Charity",
    description: "Dedicated to supporting underprivileged families with food, clothing, and educational resources.",
    imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80",
    delay: "delay-200"
  },
  {
    id: 14,
    title: "Precision Machining",
    category: "Manufacturing & Industry",
    subCategory: "Fabrication",
    description: "Custom metal fabrication and CNC machining services for industrial and hobbyist projects.",
    imageUrl: "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=800&q=80",
    delay: "delay-300"
  },
  {
    id: 15,
    title: "Canvas & Clay",
    category: "Creative & Arts",
    subCategory: "Studio",
    description: "Art classes for all ages, gallery space for local artists, and custom commissioned artwork.",
    imageUrl: "https://images.unsplash.com/photo-1460661611742-ad04cd72b761?auto=format&fit=crop&w=800&q=80",
    delay: "delay-400"
  }
];

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${API_BASE}/businesses?limit=200`);
        if (!res.ok) {
          throw new Error('Failed to fetch listings');
        }
        const data = await res.json();
        const normalized = (data || []).map((item, idx) => ({
          id: item.id || idx,
          title: item.business_name || item.title || 'Untitled',
          category: item.category || 'Other',
          subCategory: item.subCategory,
          description: item.description || '',
          imageUrl: item.logo_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
          delay: '',
          surname: item.surname || '',
          email: item.show_email ? item.email : undefined,
          phone: item.show_phone ? item.phone : undefined,
          website: item.website || undefined,
          discount: item.discount,
          tags: item.tags || [],
        }));
        setListings(normalized);
      } catch (err) {
        setError('No se pudo conectar al servidor. Vuelve a intentarlo más tarde.');
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, searchQuery]);

  const handleCategoryChange = (category) => {
    if (category === 'RESET') {
        setSelectedCategories([]);
    } else {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    }
  };

  const dataListings = listings.length > 0 ? listings : mockListings;

  // Filter Logic
  const filteredListings = dataListings.filter(item => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    const matchesSearch = searchQuery === "" || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
        
    return matchesCategory && matchesSearch;
  });

  // 2. Paginate
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredListings.length / itemsPerPage));
  const currentListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return <Preloader onFinish={() => setIsLoading(false)} />;
  }


  return (
    <>
    <Layout>
      <div className="flex flex-col flex-1 w-full">
        <div className="flex flex-1">
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            onOpenAi={() => {
                setIsSidebarOpen(false); // Close mobile sidebar if open
                setIsAiModalOpen(true);
            }}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
          />

          <section className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
            
            {/* Header Area */}
            <div className="p-6 lg:p-8 pb-4 shrink-0 bg-slate-50 z-10">
              <div className="md:hidden mb-4 space-y-4">
                <div className="relative">
                  <input type="text" className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-welfare-blue sm:text-sm" placeholder="Search..." />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50"
                >
                  <svg className="mr-2 h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                  Filters
                </button>
              </div>
            </div>

            {/* Scrollable Grid Area */}
            <div className="flex-1 overflow-y-auto px-6 lg:px-8 pb-6 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
                {error ? (
                  <div className="col-span-full py-12 text-center text-slate-500 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 text-rose-500 mb-4 shadow-inner animate-bounce">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5L13.71 3.86a1 1 0 00-1.72 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No se pudo conectar al servidor</h3>
                    <p className="mt-1">:( Vuelve a intentarlo más tarde.</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-welfare-blue text-white font-semibold hover:bg-welfare-hover transition-colors"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : currentListings.length > 0 ? (
                    currentListings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        {...listing}
                        icon={<svg className="h-8 w-8 text-welfare-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">{getCategoryIcon(listing.category)}</svg>}
                        onContact={() => setSelectedListing(listing)}
                      />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No businesses found</h3>
                        <p className="mt-1">Try adjusting your filters or search criteria.</p>
                        <button 
                          onClick={() => setSelectedCategories([])}
                          className="mt-4 text-welfare-blue hover:underline font-medium"
                        >
                          Clear all filters
                        </button>
                    </div>
                )}
              </div>
            </div>

            {/* Sticky Pagination Footer */}
            <div className="shrink-0 bg-white border-t border-slate-200 z-20">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>

          </section>
        </div>

      </div>
    </Layout>
    
    <ListingDetailModal 
       isOpen={!!selectedListing}
       onClose={() => setSelectedListing(null)}
       listing={selectedListing}
    />

    <AiAssistantModal 
       isOpen={isAiModalOpen}
       onClose={() => setIsAiModalOpen(false)}
       listings={dataListings}
    />

    <footer className="bg-white border-t border-slate-200 py-6 px-6 lg:px-8 text-center text-sm text-slate-500">
      Desarrollado por Master Creators · 
      <a href="mailto:contacto@mastercreators.work" className="underline hover:text-slate-700 ml-1">contacto@mastercreators.work</a> · 
      <a href="https://mastercreators.work/" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-700 ml-1">mastercreators.work</a>
    </footer>
  </>
  );
}

export default Home;
