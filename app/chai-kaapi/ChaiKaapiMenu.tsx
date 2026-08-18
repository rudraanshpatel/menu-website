'use client';

import { useState, useRef } from 'react';

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

const CATEGORY_EMOJIS: Record<string, string> = {
  'Speciality Coffee': '☕',
  'Bun Maska': '🧈',
  'All Day Breakfast': '🍳',
  'Chah se Chai Tak': '🫖',
  'Noodles': '🍜',
  'Sandwiches': '🥪',
  'Burger': '🍔',
  'Nachos': '🌮',
  'Garlic Breads': '🥖',
  'Pizza': '🍕',
  'Pasta': '🍝',
  'Desi Videshi': '🍛',
  'Mini Meals': '🥘',
  'Shakes': '🥤',
  'Smoothies': '🫐',
  'Thandi Kaapi': '🧊',
  'Hot Kaapi': '☕',
  'Special Tea': '🍵',
  'CK Secret Milk': '🥛',
  'Coolers': '🍋',
  'Thandi Chai': '🧊',
  'Dessert': '🍫',
  'Biryani': '🍚',
  'Salad': '🥗',
  'Mocktail': '🍹',
  'Slushy': '🧊',
  'Momos': '🥟',
  'Crispy Fries': '🍟',
};

const CATEGORY_TAGLINES: Record<string, string> = {
  'Speciality Coffee': "From Chikmagalur's finest beans to your cup",
  'Bun Maska': 'The ultimate chai-time classic',
  'All Day Breakfast': 'Fresh, flavorful, and full of good vibes',
  'Chah se Chai Tak': "Brewed with Assam's finest leaves",
  'Noodles': 'Tossed perfection loaded with flavour',
  'Sandwiches': 'Comfort between two slices',
  'Burger': 'Love at first bite',
  'Nachos': 'Crispy, cheesy, and loaded with goodness',
  'Garlic Breads': 'Love baked to perfection',
  'Pizza': 'A delicious story of crust, cheese, and happiness',
  'Pasta': 'Twirl into happiness with every bite',
  'Desi Videshi': "India's spice meets global style",
  'Mini Meals': 'Small in size, big on flavour',
  'Shakes': 'Pure happiness in a glass',
  'Smoothies': 'Wellness blended with taste',
  'Thandi Kaapi': 'Dangerously chilled, insanely refreshing',
  'Hot Kaapi': 'Brewed to perfection, bold and aromatic',
  'Special Tea': 'A twist of tradition in every cup',
  'CK Secret Milk': 'Sip, smile, repeat',
  'Coolers': 'Beat the heat with our coolest crew',
  'Thandi Chai': 'Cool, bold, and bhayankar thandi',
  'Dessert': 'End your meal on a sweet high',
  'Biryani': 'Aromatic, rich, and loaded with flavor',
  'Salad': 'A refreshing burst of health and flavor',
  'Mocktail': 'Refreshment with a desi twist',
  'Slushy': 'Chill. Sip. Repeat.',
  'Momos': 'Steamed, stuffed & simply irresistible',
  'Crispy Fries': 'Crispy. Crunchy. Crave-worthy!',
};

export default function ChaiKaapiMenu({
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
  const [filterVeg, setFilterVeg] = useState<boolean | null>(null);
  const [showCategoryGrid, setShowCategoryGrid] = useState(true);
  const tabsRef = useRef<HTMLDivElement>(null);

  const activeCategoryData = categories.find((c) => c.id === activeCategory);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory ? item.category_id === activeCategory : true;
    const matchesSearch = search
      ? item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesFilter = filterVeg === null ? true : item.is_veg === filterVeg;
    return matchesCategory && matchesSearch && matchesFilter;
  });

  const handleCategorySelect = (catId: string) => {
    setActiveCategory(catId);
    setShowCategoryGrid(false);
    setSearch('');
    tabsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" style={{ background: '#FDF6EE' }}>
      {/* Hero Header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2C1810 0%, #4A2C1A 50%, #3D1F14 100%)' }}>
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '30px 30px' }} />

        <div className="max-w-2xl mx-auto px-6 pt-12 pb-8 relative">
          <div className="flex items-center gap-5 mb-6">
            <img
              src="https://chaikaapi.in/wp-content/uploads/2025/10/Untitled-design-2025-10-14T154448.165.png"
              alt="Chai Kaapi"
              className="w-20 h-20 rounded-full object-cover border-2"
              style={{ borderColor: '#D4A574' }}
            />
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#F5E6D3', fontFamily: 'Georgia, serif' }}>
                Chai Kaapi
              </h1>
              <p className="text-sm mt-1" style={{ color: '#D4A574' }}>
                ☕ Dusra Ghar — Your second home
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for chai, coffee, momos..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value) setShowCategoryGrid(false);
                else setShowCategoryGrid(true);
              }}
              className="w-full px-5 py-3 rounded-xl text-sm focus:outline-none placeholder:text-[#a08060]"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#F5E6D3', border: '1px solid rgba(212,165,116,0.3)' }}
            />
            <span className="absolute right-4 top-3 text-lg">🔍</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Category Grid */}
        {showCategoryGrid && !search && (
          <div className="px-4 py-6">
            <h2 className="text-lg font-bold mb-4 px-2" style={{ color: '#2C1810', fontFamily: 'Georgia, serif' }}>
              Explore Our Menu
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="rounded-xl p-3 text-center transition-all hover:scale-[1.03] active:scale-95"
                  style={{
                    background: activeCategory === cat.id
                      ? 'linear-gradient(135deg, #4A2C1A, #6B3E26)'
                      : '#FFFFFF',
                    border: '1px solid #E8D5C4',
                    boxShadow: '0 2px 8px rgba(44,24,16,0.06)',
                  }}
                >
                  <span className="text-2xl block mb-1">
                    {CATEGORY_EMOJIS[cat.name] || '🍽️'}
                  </span>
                  <span
                    className="text-xs font-medium leading-tight block"
                    style={{ color: activeCategory === cat.id ? '#F5E6D3' : '#4A2C1A' }}
                  >
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Veg/Non-veg Filter */}
        <div className="px-4 pb-2 flex gap-2">
          <button
            onClick={() => setFilterVeg(filterVeg === true ? null : true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: filterVeg === true ? '#E8F5E9' : '#FFFFFF',
              border: filterVeg === true ? '1.5px solid #2E7D32' : '1px solid #E8D5C4',
              color: filterVeg === true ? '#2E7D32' : '#8B7355',
            }}
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-green-600" />
            Veg
          </button>
          <button
            onClick={() => setFilterVeg(filterVeg === false ? null : false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: filterVeg === false ? '#FFEBEE' : '#FFFFFF',
              border: filterVeg === false ? '1.5px solid #C62828' : '1px solid #E8D5C4',
              color: filterVeg === false ? '#C62828' : '#8B7355',
            }}
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-red-600" />
            Non-Veg
          </button>

          {!showCategoryGrid && (
            <button
              onClick={() => {
                setShowCategoryGrid(true);
                setSearch('');
              }}
              className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: '#FFFFFF', border: '1px solid #E8D5C4', color: '#8B7355' }}
            >
              ≡ All Categories
            </button>
          )}
        </div>

        {/* Sticky Category Tabs */}
        <div
          ref={tabsRef}
          className="sticky top-0 z-10 overflow-x-auto border-b"
          style={{ background: '#FDF6EE', borderColor: '#E8D5C4' }}
        >
          <div className="flex px-4 gap-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setShowCategoryGrid(false);
                  setSearch('');
                }}
                className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all"
                style={
                  activeCategory === cat.id
                    ? { borderBottomColor: '#8B4513', color: '#4A2C1A' }
                    : { borderBottomColor: 'transparent', color: '#A08060' }
                }
              >
                {CATEGORY_EMOJIS[cat.name] ? `${CATEGORY_EMOJIS[cat.name]} ` : ''}{cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category Header */}
        {activeCategoryData && !search && (
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-xl font-bold" style={{ color: '#2C1810', fontFamily: 'Georgia, serif' }}>
              {activeCategoryData.name}
            </h2>
            {CATEGORY_TAGLINES[activeCategoryData.name] && (
              <p className="text-sm mt-1 italic" style={{ color: '#A08060' }}>
                {CATEGORY_TAGLINES[activeCategoryData.name]}
              </p>
            )}
          </div>
        )}

        {/* Menu Items */}
        <div className="px-4 py-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl block mb-3">🍵</span>
              <p style={{ color: '#A08060' }}>No items found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl overflow-hidden transition-all ${!item.is_available ? 'opacity-50' : ''}`}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E8D5C4',
                    boxShadow: '0 2px 8px rgba(44,24,16,0.04)',
                  }}
                >
                  <div className="flex">
                    <div className="flex-1 p-4">
                      {/* Veg/Non-veg indicator */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="w-4 h-4 rounded-sm flex items-center justify-center"
                          style={{ border: `2px solid ${item.is_veg ? '#2E7D32' : '#C62828'}` }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: item.is_veg ? '#2E7D32' : '#C62828' }}
                          />
                        </span>
                        {!item.is_available && (
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: '#FFEBEE', color: '#C62828' }}
                          >
                            Currently Unavailable
                          </span>
                        )}
                      </div>

                      {/* Item name */}
                      <h3
                        className="font-semibold text-[15px]"
                        style={{ color: '#2C1810' }}
                      >
                        {item.name}
                      </h3>

                      {/* Description */}
                      {item.description && (
                        <p
                          className="text-xs mt-1 leading-relaxed"
                          style={{ color: '#A08060' }}
                        >
                          {item.description}
                        </p>
                      )}

                      {/* Price */}
                      <p
                        className="font-bold mt-2 text-sm"
                        style={{ color: '#4A2C1A' }}
                      >
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Image */}
                    {item.image_url && (
                      <div className="w-28 h-28 m-3 flex-shrink-0">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                          style={{ border: '1px solid #E8D5C4' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-8 px-6">
          <div className="mb-3">
            <img
              src="https://chaikaapi.in/wp-content/uploads/2025/10/Untitled-design-2025-10-14T154448.165.png"
              alt="Chai Kaapi"
              className="w-10 h-10 rounded-full mx-auto opacity-60"
            />
          </div>
          <p className="text-xs" style={{ color: '#A08060' }}>
            Chai Kaapi — Dusra Ghar
          </p>
          <p className="text-[10px] mt-2" style={{ color: '#C4B098' }}>
            Powered by AllyMento
          </p>
        </div>
      </div>
    </div>
  );
}