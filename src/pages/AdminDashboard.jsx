import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import ListingCard from '../components/ListingCard';
import Pagination from '../components/Pagination';
import Preloader from '../components/Preloader';
import AdminEditModal from '../components/AdminEditModal';
import { API_BASE } from '../config';

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

const AdminDashboard = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Sidebar & Filter State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/businesses`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        const normalized = data.map((item) => ({
          id: item.id,
          title: item.business_name || 'Untitled',
          category: item.category || 'Other',
          subCategory: item.subCategory,
          description: item.description || '',
          imageUrl: item.background_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
          logoUrl: item.logo_url || null,
          delay: '',
          surname: item.surname || '',
          email: item.email,
          show_email: item.show_email,
          phone: item.phone,
          show_phone: item.show_phone,
          website: item.website,
          discount: item.discount,
          status: item.status,
          tags: Array.isArray(item.tags) ? item.tags : [],
          raw: item // Keep raw data for editing
        }));
        
        setListings(normalized);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`${API_BASE}/admin/businesses/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
        alert('Error deleting');
    }
  };

  const handleEdit = (listing) => {
    setSelectedListing(listing.raw);
  };

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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, searchQuery]);

  // Filter Logic
  const filteredListings = listings.filter(item => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    const matchesSearch = searchQuery === "" || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
        
    return matchesCategory && matchesSearch;
  });

  // Pagination Logic
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredListings.length / itemsPerPage));
  const currentListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <Preloader onFinish={() => setIsLoading(false)} />;

  return (
    <Layout>
      <div className="flex flex-col flex-1 w-full">
        <div className="flex flex-1">
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            // Admin doesn't necessarily need AI modal from sidebar, but we can leave placeholder or remove
            onOpenAi={() => {}} 
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
          />

          <section className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
            
            {/* Header Area */}
            <div className="p-6 lg:p-8 pb-4 shrink-0 bg-slate-50 z-10 flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
              <div className="w-full md:w-auto">
                <div className="md:hidden mb-4 space-y-4">
                    <div className="relative">
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-welfare-blue sm:text-sm" 
                        placeholder="Search..." 
                    />
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
                <div className="hidden md:block">
                     <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                     <p className="text-slate-500 text-sm">Manage {listings.length} registered businesses</p>
                </div>
              </div>
              
              <button 
                    onClick={() => setRefreshTrigger(prev => prev + 1)}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Refresh
                </button>
            </div>

            {/* Scrollable Grid Area */}
            <div className="flex-1 overflow-y-auto px-6 lg:px-8 pb-6 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
                {currentListings.length > 0 ? (
                    currentListings.map((listing) => (
                      <div key={listing.id} className="relative group">
                        <div className="opacity-100 transition-opacity">
                            <ListingCard
                                {...listing}
                                icon={<svg className="h-8 w-8 text-welfare-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">{getCategoryIcon(listing.category)}</svg>}
                                onContact={() => {}} // No-op
                            />
                        </div>
                        
                         {/* Admin Overlay Actions */}
                        <div className="absolute top-0 right-0 p-2 flex space-x-2 z-30">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                listing.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                                listing.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                                'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }`}>
                                {listing.status || 'pending'}
                            </span>
                        </div>

                        <div className="absolute bottom-4 right-4 flex space-x-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                    onClick={(e) => { e.stopPropagation(); handleEdit(listing); }}
                                    className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    title="Edit"
                            >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(listing.id); }}
                                    className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    title="Delete"
                            >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                      </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No matching businesses</h3>
                        <p className="mt-1">Try adjusting your filters or search.</p>
                        <button 
                          onClick={() => { setSelectedCategories([]); setSearchQuery(""); }}
                          className="mt-4 text-welfare-blue hover:underline font-medium"
                        >
                          Clear Filters
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
      
      <AdminEditModal 
        isOpen={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        listing={selectedListing}
        onSave={() => setRefreshTrigger(prev => prev + 1)}
      />
    </Layout>
  );
};

export default AdminDashboard;