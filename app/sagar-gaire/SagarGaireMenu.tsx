'use client';

import { useState, useRef, useEffect } from 'react';

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  accent_color: string;
  tagline: string | null;
};

type Category = {
  id: string;
  name: string;
  sort_order: number;
};

type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_veg: boolean;
  is_available: boolean;
};

export default function SagarGaireMenu({
  restaurant,
  categories,
  menuItems,
}: {
  restaurant: Restaurant;
  categories: Category[];
  menuItems: MenuItem[];
}) {
  const [activeCategory, setActiveCategory] = useState(
    categories.length > 0 ? categories[0].id : null
  );
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const activeCategoryData = categories.find((c) => c.id === activeCategory);

  // Scroll active tab into view
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCategory]);

  const filteredItems = menuItems.filter((item) => {
    if (search) {
      return (
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return activeCategory ? item.category_id === activeCategory : true;
  });

  const getItemCount = (catId: string) =>
    menuItems.filter((i) => i.category_id === catId).length;

  const parseDescription = (desc: string | null) => {
    if (!desc) return { text: null, isSpicy: false, isChefSpecial: false };
    const isSpicy = desc.includes('Spicy');
    const isChefSpecial = desc.includes("Chef's Special") || desc.includes("Chef''s Special");
    const text = desc
      .replace(/Spicy/g, '')
      .replace(/Chef's Special/g, '')
      .replace(/Chef''s Special/g, '')
      .replace(/\|/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    return { text: text || null, isSpicy, isChefSpecial };
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .sg-page * {
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
        }

        .sg-page {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .sg-tabs::-webkit-scrollbar { display: none; }
        .sg-tabs { -ms-overflow-style: none; scrollbar-width: none; }

        .sg-item { transition: background 0.15s ease; }
        .sg-item:active { background: #FDF6EE; }

        @keyframes sg-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sg-animate { animation: sg-fade-in 0.25s ease-out both; }
      `}</style>

      <div className="sg-page min-h-screen" style={{ background: '#FAFAF7' }}>

        {/* ── Header ── */}
        <header style={{ background: '#E87722' }}>
          <div className="max-w-lg mx-auto px-5 pt-10 pb-5">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src="https://synques-cdn.s3.ap-south-1.amazonaws.com/sagargairefastfoodcorner.com/images/sagargairelogo.png"
                  alt=""
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-[17px] font-bold text-white leading-tight tracking-tight">
                  Sagar Gaire
                </h1>
                <p className="text-[11px] text-white/60 font-medium mt-0.5">
                  Pure Veg · 11 AM–11 PM · Self Service
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-1 bg-white/15 rounded-full px-2.5 py-1">
                  <span className="w-[6px] h-[6px] rounded-full bg-green-300" />
                  <span className="text-[10px] font-semibold text-white/80">VEG</span>
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke={searchFocused ? '#E87722' : '#C4BDB3'} strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search menu"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-white/30 placeholder:text-stone-400"
                style={{ background: '#FFFFFF', color: '#1A1A1A' }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-lg mx-auto">

          {/* ── Category Tabs ── */}
          <div
            ref={tabsRef}
            className="sg-tabs sticky top-0 z-20 overflow-x-auto border-b"
            style={{ background: '#FAFAF7', borderColor: '#EDEBE6' }}
          >
            <div className="flex px-4 py-2 gap-1.5">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    ref={isActive ? activeTabRef : null}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setSearch('');
                    }}
                    className="flex-shrink-0 px-3.5 py-[7px] rounded-full text-[12px] font-semibold transition-all"
                    style={
                      isActive
                        ? { background: '#E87722', color: '#FFFFFF' }
                        : { background: 'transparent', color: '#8C857B' }
                    }
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Category Title ── */}
          {activeCategoryData && !search && (
            <div className="px-5 pt-5 pb-1 flex items-baseline justify-between sg-animate">
              <h2 className="text-[15px] font-bold" style={{ color: '#1A1A1A' }}>
                {activeCategoryData.name}
              </h2>
              <span className="text-[11px] font-medium" style={{ color: '#C4BDB3' }}>
                {getItemCount(activeCategoryData.id)} items
              </span>
            </div>
          )}

          {search && (
            <div className="px-5 pt-5 pb-1 sg-animate">
              <p className="text-[13px]" style={{ color: '#8C857B' }}>
                {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
              </p>
            </div>
          )}

          {/* ── Items ── */}
          <div className="px-4 pt-2 pb-6">
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 sg-animate">
                <p className="text-sm font-medium" style={{ color: '#C4BDB3' }}>Nothing here</p>
                <p className="text-xs mt-1" style={{ color: '#DDD8D0' }}>Try a different search or category</p>
              </div>
            ) : (
              <div>
                {filteredItems.map((item, idx) => {
                  const { text, isSpicy, isChefSpecial } = parseDescription(item.description);
                  return (
                    <div
                      key={item.id}
                      className={`sg-item flex items-start gap-3 py-3.5 sg-animate ${!item.is_available ? 'opacity-35' : ''}`}
                      style={{
                        borderBottom: idx < filteredItems.length - 1 ? '1px solid #F0EDE8' : 'none',
                        animationDelay: `${Math.min(idx * 30, 300)}ms`,
                      }}
                    >
                      {/* Veg dot */}
                      <div className="mt-[5px] flex-shrink-0">
                        <span
                          className="block w-[14px] h-[14px] rounded-[3px]"
                          style={{ border: '2px solid #2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <span className="block w-[6px] h-[6px] rounded-full" style={{ background: '#2E7D32' }} />
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-1">
                          <h3 className="text-[14px] font-semibold leading-snug flex-1" style={{ color: '#1A1A1A' }}>
                            {item.name}
                          </h3>
                          {isSpicy && <span className="text-[11px] mt-0.5 flex-shrink-0">🌶️</span>}
                          {isChefSpecial && <span className="text-[11px] mt-0.5 flex-shrink-0">⭐</span>}
                        </div>
                        {text && (
                          <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: '#B0A898' }}>
                            {text}
                          </p>
                        )}
                        {!item.is_available && (
                          <p className="text-[10px] font-semibold mt-1" style={{ color: '#D4600C' }}>
                            Currently unavailable
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex-shrink-0 text-right mt-0.5">
                        <span className="text-[14px] font-bold tabular-nums" style={{ color: '#1A1A1A' }}>
                          ₹{item.price}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="px-5 pb-8">
            <div className="rounded-xl p-4 mb-6" style={{ background: '#F5F2ED' }}>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium" style={{ color: '#8C857B' }}>
                  All prices inclusive of GST
                </p>
                <a href="tel:7848011111" className="text-[11px] font-bold" style={{ color: '#E87722' }}>
                  Call 7848011111
                </a>
              </div>
            </div>

            <p className="text-center text-[10px] font-medium" style={{ color: '#D0CAC0' }}>
              Powered by AllyMento
            </p>
          </div>
        </div>
      </div>
    </>
  );
}