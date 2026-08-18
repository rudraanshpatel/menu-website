'use client';

import { useState, useEffect, useRef } from 'react';

type Restaurant = { id: string; name: string; slug: string; logo_url: string | null; accent_color: string; tagline: string | null; };
type Category = { id: string; name: string; sort_order: number; image_url?: string | null; };
type MenuItem = { id: string; category_id: string; name: string; description: string | null; price: number; image_url: string | null; is_veg: boolean; is_available: boolean; };

/* ── category metadata ── */
const META: Record<string, { emoji: string; tagline: string; bg: string }> = {
  'Soup':             { emoji: '🍲', tagline: 'Warm comfort in every sip',       bg: '#E87722' },
  'Thali':            { emoji: '🍽️', tagline: 'A complete meal, one plate',       bg: '#D4760A' },
  'Sandwich':         { emoji: '🥪', tagline: "Bhopal's favourite triple layer", bg: '#C66B10' },
  'Burger':           { emoji: '🍔', tagline: 'Stacked fresh, served hot',       bg: '#B85C0A' },
  'Pav Snacks':       { emoji: '🫓', tagline: 'Pav bhaji & classic snacks',      bg: '#E87722' },
  'Rice & Biryani':   { emoji: '🍚', tagline: 'Aromatic rice dishes',            bg: '#D4760A' },
  'Dal Sabzi':        { emoji: '🥘', tagline: 'Rich curries & lentils',          bg: '#C46600' },
  'Indian':           { emoji: '🇮🇳', tagline: 'Kulcha, roti & combos',          bg: '#E87722' },
  'South Indian':     { emoji: '🥞', tagline: 'Dosa, idli & uttapam',           bg: '#D07010' },
  'Chinese':          { emoji: '🥡', tagline: 'Desi-style wok tossed',          bg: '#B86015' },
  'Pasta':            { emoji: '🍝', tagline: 'Cheesy, saucy perfection',       bg: '#D4760A' },
  'Pizza':            { emoji: '🍕', tagline: 'Loaded with cheese & love',      bg: '#E87722' },
  'Rolls & Paratha':  { emoji: '🌯', tagline: 'Wrapped & stuffed',              bg: '#C06510' },
  'Soya Chaap':       { emoji: '🍢', tagline: 'Grilled & tikka style',          bg: '#B06010' },
  'Momos':            { emoji: '🥟', tagline: 'Steamed, fried & spicy',         bg: '#E87722' },
  'Shakes':           { emoji: '🥤', tagline: 'Thick, creamy & cold',           bg: '#D07518' },
  'Coffee':           { emoji: '☕', tagline: 'Chilled & refreshing',           bg: '#6B3E26' },
  'Drinks':           { emoji: '🍹', tagline: 'Cool sips & refreshers',         bg: '#C46B12' },
};

const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect fill="#1a1a1a" width="400" height="400"/>
    <rect fill="#222" x="140" y="140" width="120" height="120" rx="16"/>
    <text x="200" y="210" font-size="48" text-anchor="middle" fill="#444">🍽️</text>
  </svg>`
);

export default function SagarGaireMenu({ restaurant, categories, menuItems }: {
  restaurant: Restaurant; categories: Category[]; menuItems: MenuItem[];
}) {
  const [screen, setScreen] = useState<'home' | 'menu'>('home');
  const [activeCat, setActiveCat] = useState<string | null>(categories[0]?.id || null);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [shareMsg, setShareMsg] = useState(false);
  const tabRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCat]);

  const activeCatData = categories.find(c => c.id === activeCat);
  const meta = activeCatData ? (META[activeCatData.name] || { emoji: '🍽️', tagline: '', bg: '#E87722' }) : null;

  const items = menuItems.filter(item => {
    if (search) return item.name.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase());
    return activeCat ? item.category_id === activeCat : true;
  });

  const count = (id: string) => menuItems.filter(i => i.category_id === id).length;

  const openCat = (id: string) => { setActiveCat(id); setScreen('menu'); setSearch(''); setShowSearch(false); };

  const parseTags = (d: string | null) => {
    if (!d) return { text: null, spicy: false, special: false };
    const spicy = d.includes('Spicy');
    const special = d.includes('Chef') && d.includes('Special');
    let text = d.replace(/Spicy/g, '').replace(/Chef's Special/g, '').replace(/Chef''s Special/g, '').replace(/\|/g, '·').replace(/\s+/g, ' ').trim();
    if (text.startsWith('·')) text = text.slice(1).trim();
    if (text.endsWith('·')) text = text.slice(0, -1).trim();
    return { text: text || null, spicy, special };
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: 'Sagar Gaire Menu', url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setShareMsg(true);
      setTimeout(() => setShareMsg(false), 2000);
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        html { scroll-behavior: smooth; }
        body { margin: 0; padding: 0; background: #000; }
        .tq * { font-family: 'Inter', system-ui, sans-serif; box-sizing: border-box; }
        .tq { -webkit-font-smoothing: antialiased; }
        .tq-scroll::-webkit-scrollbar { display: none; }
        .tq-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes tqFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .tq-fade { animation: tqFade 0.35s ease both; }
        @keyframes tqScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .tq-scale { animation: tqScale 0.3s ease both; }
        @keyframes tqSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .tq-slide-up { animation: tqSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .tq-img { transition: transform 0.4s ease; }
        .tq-img:hover { transform: scale(1.03); }
      `}</style>

      <div className="tq min-h-screen" style={{ background: '#000' }}>

        {/* ════════════════ HOME SCREEN ════════════════ */}
        {screen === 'home' && (
          <div className="min-h-screen flex flex-col" style={{ background: '#000' }}>
            {/* Hero */}
            <div className="flex-shrink-0 text-center pt-14 pb-8 px-6 tq-fade">
              <div className="w-20 h-20 rounded-3xl mx-auto mb-5 overflow-hidden flex items-center justify-center" style={{ background: '#141414', border: '1px solid #222' }}>
                <img
                  src="https://synques-cdn.s3.ap-south-1.amazonaws.com/sagargairefastfoodcorner.com/images/sagargairelogo.png"
                  alt="" className="w-14 h-14 object-contain"
                />
              </div>
              <h1 className="text-[26px] font-extrabold text-white tracking-tight leading-none">Sagar Gaire</h1>
              <p className="text-[12px] font-medium mt-2 tracking-wide uppercase" style={{ color: '#666' }}>Fast Food Corner · Cycle Soupwala</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: '#0A1A0A', border: '1px solid #1A2E1A' }}>
                  <span className="w-[5px] h-[5px] rounded-full bg-green-500" />
                  <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest">Pure Veg</span>
                </span>
                <span className="text-[9px] font-medium rounded-full px-2.5 py-1" style={{ background: '#1A1A1A', color: '#666', border: '1px solid #222' }}>
                  11 AM – 11 PM
                </span>
              </div>
            </div>

            {/* Category Grid */}
            <div className="flex-1 rounded-t-[32px] overflow-hidden px-4 pt-7 pb-28" style={{ background: '#0D0D0D' }}>
              <div className="max-w-lg mx-auto">
                <div className="flex items-center justify-between mb-5 px-1">
                  <p className="text-[13px] font-bold text-white">Menu</p>
                  <p className="text-[11px] font-medium" style={{ color: '#555' }}>{categories.length} categories · {menuItems.length} items</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat, idx) => {
                    const m = META[cat.name] || { emoji: '🍽️', tagline: '', bg: '#E87722' };
                    return (
                      <button
                        key={cat.id}
                        onClick={() => openCat(cat.id)}
                        className="tq-fade text-left rounded-2xl overflow-hidden active:scale-[0.97] transition-transform"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        {/* Image area */}
                        <div className="relative h-[110px] overflow-hidden">
                          {cat.image_url ? (
                            <img src={cat.image_url} alt="" className="w-full h-full object-cover tq-img" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${m.bg}dd, ${m.bg}88)` }}>
                              <span className="text-5xl opacity-90">{m.emoji}</span>
                            </div>
                          )}
                          {/* Gradient overlay */}
                          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                          {/* Count badge */}
                          <span className="absolute top-2.5 right-2.5 text-[9px] font-bold rounded-full px-2 py-0.5" style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
                            {count(cat.id)}
                          </span>
                          {/* Name overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-[14px] font-bold text-white leading-tight">{cat.name}</p>
                            <p className="text-[10px] text-white/50 mt-0.5 font-medium">{m.tagline}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Bar - Home */}
            <div className="fixed bottom-0 left-0 right-0 z-30">
              <div className="max-w-lg mx-auto">
                <div className="mx-3 mb-3 rounded-2xl px-5 py-3 flex items-center justify-between" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', backdropFilter: 'blur(20px)' }}>
                  <div className="flex items-center gap-2">
                    <img src="https://synques-cdn.s3.ap-south-1.amazonaws.com/sagargairefastfoodcorner.com/images/sagargairelogo.png" alt="" className="w-7 h-7 object-contain rounded-lg" />
                    <span className="text-[12px] font-bold text-white">Sagar Gaire</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <a href="tel:7848011111" className="text-white/50 hover:text-white transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </a>
                    <a href="https://wa.me/917848011111?text=Hi%2C%20I%20want%20to%20place%20an%20order" target="_blank" className="text-white/50 hover:text-white transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.503 3.935 1.387 5.613L0 24l6.572-1.318A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.84 0-3.565-.504-5.043-1.382l-.361-.215-3.748.752.831-3.617-.235-.375A9.93 9.93 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                    </a>
                    <button onClick={handleShare} className="text-white/50 hover:text-white transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ MENU SCREEN ════════════════ */}
        {screen === 'menu' && (
          <div className="min-h-screen flex flex-col" style={{ background: '#000' }}>
            {/* Top bar */}
            <div className="flex-shrink-0 px-4 pt-12 pb-3">
              <div className="max-w-lg mx-auto flex items-center justify-between">
                <button onClick={() => { setScreen('home'); setSearch(''); setShowSearch(false); }} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#1A1A1A' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>

                <div className="flex items-center gap-2">
                  <img src="https://synques-cdn.s3.ap-south-1.amazonaws.com/sagargairefastfoodcorner.com/images/sagargairelogo.png" alt="" className="w-7 h-7 object-contain" />
                  <span className="text-[14px] font-bold text-white">Sagar Gaire</span>
                </div>

                <button onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearch(''); }} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#1A1A1A' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </button>
              </div>
            </div>

            {/* Search bar (expandable) */}
            {showSearch && (
              <div className="px-4 pb-3 tq-scale">
                <div className="max-w-lg mx-auto relative">
                  <input
                    type="text" autoFocus placeholder="Search dishes..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-[13px] font-medium focus:outline-none placeholder:text-neutral-600"
                    style={{ background: '#141414', color: '#EEE', border: '1px solid #222' }}
                  />
                  {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 text-xs font-bold">✕</button>}
                </div>
              </div>
            )}

            {/* Category tabs */}
            <div ref={tabRef} className="tq-scroll flex-shrink-0 overflow-x-auto sticky top-0 z-20" style={{ background: '#000' }}>
              <div className="max-w-lg mx-auto flex items-center px-4 py-2 gap-1.5">
                {categories.map(cat => {
                  const active = activeCat === cat.id && !search;
                  return (
                    <button
                      key={cat.id}
                      ref={active ? activeTabRef : null}
                      onClick={() => { setActiveCat(cat.id); setSearch(''); }}
                      className="flex-shrink-0 px-3.5 py-[7px] rounded-full text-[11px] font-semibold transition-all whitespace-nowrap"
                      style={active ? { background: '#E87722', color: '#FFF' } : { background: '#141414', color: '#666' }}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 rounded-t-[28px] overflow-hidden" style={{ background: '#FAFAF8' }}>
              <div className="max-w-lg mx-auto">

                {/* Category Hero */}
                {activeCatData && !search && (
                  <div className="tq-fade">
                    <div className="relative h-[160px] overflow-hidden rounded-b-none">
                      {activeCatData.image_url ? (
                        <img src={activeCatData.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${meta?.bg || '#E87722'}, ${meta?.bg || '#E87722'}88)` }}>
                          <span className="text-7xl opacity-80">{meta?.emoji || '🍽️'}</span>
                        </div>
                      )}
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h2 className="text-[22px] font-extrabold text-white">{activeCatData.name}</h2>
                        <p className="text-[12px] text-white/60 font-medium mt-1">{meta?.tagline} · {count(activeCatData.id)} items</p>
                      </div>
                    </div>
                  </div>
                )}

                {search && (
                  <div className="px-5 pt-5 pb-2 tq-fade">
                    <p className="text-[13px] text-neutral-500">{items.length} result{items.length !== 1 ? 's' : ''} for <span className="font-semibold text-neutral-800">&ldquo;{search}&rdquo;</span></p>
                  </div>
                )}

                {/* Items */}
                <div className="px-4 pt-4 pb-28">
                  {items.length === 0 ? (
                    <div className="text-center py-20 tq-fade">
                      <span className="text-3xl block mb-2">🍽️</span>
                      <p className="text-sm font-medium text-neutral-300">No items found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item, idx) => {
                        const { text, spicy, special } = parseTags(item.description);
                        return (
                          <div
                            key={item.id}
                            className={`tq-fade bg-white rounded-2xl overflow-hidden ${!item.is_available ? 'opacity-35' : ''}`}
                            style={{ border: '1px solid #F0EDEA', animationDelay: `${Math.min(idx * 30, 300)}ms` }}
                          >
                            <div className="flex">
                              {/* Content */}
                              <div className="flex-1 p-4 min-w-0">
                                {/* Tags row */}
                                <div className="flex items-center gap-1.5 mb-2">
                                  <span className="w-[14px] h-[14px] rounded-[3px] flex items-center justify-center flex-shrink-0" style={{ border: '1.5px solid #2E7D32' }}>
                                    <span className="w-[6px] h-[6px] rounded-full" style={{ background: '#2E7D32' }} />
                                  </span>
                                  {spicy && (
                                    <span className="text-[9px] font-bold px-1.5 py-[2px] rounded-full uppercase tracking-wide" style={{ background: '#FFF2E8', color: '#D4690A' }}>🌶 Spicy</span>
                                  )}
                                  {special && (
                                    <span className="text-[9px] font-bold px-1.5 py-[2px] rounded-full uppercase tracking-wide" style={{ background: '#FFF8E8', color: '#B8860B' }}>⭐ Chef&apos;s Special</span>
                                  )}
                                  {!item.is_available && (
                                    <span className="text-[9px] font-bold px-1.5 py-[2px] rounded-full uppercase tracking-wide" style={{ background: '#FFF0F0', color: '#CC3300' }}>Unavailable</span>
                                  )}
                                </div>

                                {/* Name */}
                                <h3 className="text-[14px] font-bold text-neutral-900 leading-snug">{item.name}</h3>

                                {/* Description */}
                                {text && <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">{text}</p>}

                                {/* Price */}
                                <p className="text-[15px] font-extrabold mt-3" style={{ color: '#E87722' }}>₹{item.price}</p>
                              </div>

                              {/* Image */}
                              <div className="w-[110px] flex-shrink-0 p-3 pl-0">
                                <div className="w-full h-[100px] rounded-xl overflow-hidden" style={{ background: '#F5F2EF' }}>
                                  {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover tq-img" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <span className="text-3xl opacity-30">{meta?.emoji || '🍽️'}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer info */}
                <div className="px-5 pb-6">
                  <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: '#F5F2EF' }}>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#AAA' }}>Self Service</p>
                      <p className="text-[10px] mt-0.5" style={{ color: '#CCC' }}>All prices inclusive of GST</p>
                    </div>
                    <a href="tel:7848011111" className="text-[11px] font-bold" style={{ color: '#E87722' }}>📞 7848011111</a>
                  </div>
                  <p className="text-center text-[9px] font-medium mt-4 pb-2" style={{ color: '#DDD' }}>Powered by AllyMento</p>
                </div>
              </div>
            </div>

            {/* Bottom Bar - Menu */}
            <div className="fixed bottom-0 left-0 right-0 z-30">
              <div className="max-w-lg mx-auto">
                <div className="mx-3 mb-3 rounded-2xl px-5 py-3 flex items-center justify-between" style={{ background: 'rgba(20,20,20,0.92)', border: '1px solid #2A2A2A', backdropFilter: 'blur(20px)' }}>
                  <button onClick={() => { setScreen('home'); setSearch(''); }} className="flex items-center gap-2">
                    <img src="https://synques-cdn.s3.ap-south-1.amazonaws.com/sagargairefastfoodcorner.com/images/sagargairelogo.png" alt="" className="w-7 h-7 object-contain rounded-lg" />
                    <span className="text-[12px] font-bold text-white">Menu</span>
                  </button>
                  <div className="flex items-center gap-4">
                    <a href="tel:7848011111" className="text-white/40 hover:text-white transition-colors">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </a>
                    <a href="https://wa.me/917848011111?text=Hi%2C%20I%20want%20to%20place%20an%20order" target="_blank" className="text-white/40 hover:text-white transition-colors">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.503 3.935 1.387 5.613L0 24l6.572-1.318A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.84 0-3.565-.504-5.043-1.382l-.361-.215-3.748.752.831-3.617-.235-.375A9.93 9.93 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                    </a>
                    <button onClick={handleShare} className="text-white/40 hover:text-white transition-colors relative">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                      {shareMsg && <span className="absolute -top-8 -left-4 text-[10px] font-medium bg-white text-neutral-800 px-2 py-1 rounded-lg shadow-lg whitespace-nowrap">Copied!</span>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}