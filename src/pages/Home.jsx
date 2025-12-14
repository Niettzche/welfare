import React, { useState } from 'react';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import ListingCard from '../components/ListingCard';
import Pagination from '../components/Pagination';
import Preloader from '../components/Preloader';
import ListingDetailModal from '../components/ListingDetailModal';
import AiAssistantModal from '../components/AiAssistantModal';

const listings = [
  {
    id: 1,
    title: "Apex Dental Care",
    category: "Health",
    subCategory: "Pre-school",
    description: "Apex dental care provides gentle patient dental clinic and preventative healthcare.",
    imageUrl: "https://images.unsplash.com/photo-1606811841689-230391b3d3d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    delay: "",
    icon: (
      <svg className="h-8 w-8 text-welfare-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
      </svg>
    ),
    isPrimary: false
  },
  {
    id: 2,
    title: "Little Coders Academy",
    category: "Education",
    subCategory: "Primary",
    description: "Building the future one line of code at a time. Workshops for ages 6-12.",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    delay: "delay-100",
    icon: (
      <svg className="h-8 w-8 text-welfare-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
      </svg>
    ),
    isPrimary: true
  },
  {
    id: 3,
    title: "Catering Spread",
    category: "Food",
    subCategory: "Primary",
    description: "Healthy and delicious catering options for your family events and parties.",
    imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    delay: "delay-200",
    icon: (
      <svg className="h-8 w-8 text-welfare-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
    ),
    isPrimary: false
  },
  {
    id: 4,
    title: "Legal & Tax Solutions",
    category: "Professional",
    subCategory: null,
    description: "Expert advice for small business owners in the Welfare community.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    delay: "delay-300",
    icon: (
      <svg className="h-8 w-8 text-welfare-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    isPrimary: false
  },
  {
    id: 5,
    title: "Family Photography",
    category: "Creative",
    subCategory: null,
    description: "Capturing precious moments. Special discounts for school events.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    delay: "delay-400",
    icon: (
      <svg className="h-8 w-8 text-welfare-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
    ),
    isPrimary: false
  }
];

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  if (isLoading) {
    return <Preloader onFinish={() => setIsLoading(false)} />;
  }

  return (
    <>
    <Layout>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onOpenAi={() => {
            setIsSidebarOpen(false); // Close mobile sidebar if open
            setIsAiModalOpen(true);
        }}
      />
      <section className="flex-1 p-6 lg:p-10">
        <div className="md:hidden mb-6 space-y-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 items-start mb-12">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              {...listing}
              onContact={() => setSelectedListing(listing)}
            />
          ))}
        </div>

        <Pagination />

      </section>
    </Layout>
    
    <ListingDetailModal 
       isOpen={!!selectedListing}
       onClose={() => setSelectedListing(null)}
       listing={selectedListing}
    />

    <AiAssistantModal 
       isOpen={isAiModalOpen}
       onClose={() => setIsAiModalOpen(false)}
       listings={listings}
    />
  </>
  );
}

export default Home;
