'use client';

import { useState } from 'react';

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

export default function MenuPage({
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

  const accent = restaurant.accent_color || '#E24B4A';

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory ? item.category_id === activeCategory : true;
    const matchesSearch = search
      ? item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesFilter =
      filterVeg === null ? true : item.is_veg === filterVeg;

    return matchesCategory && matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="px-6 pt-10 pb-6"
        style={{ backgroundColor: accent }}
      >
        <div className="max-w-lg mx-auto flex items-center gap-4">
          {restaurant.logo_url && (
            <img
              src={restaurant.logo_url}
              alt={restaurant.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white/30"
            />
          )}
          <div>
            <h1 className="text-xl font-bold text-white">{restaurant.name}</h1>
            {restaurant.tagline && (
              <p className="text-sm text-white/80 mt-0.5">{restaurant.tagline}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Search */}
        <div className="px-4 py-3">
          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* Veg/Non-veg Filter */}
        <div className="px-4 pb-2 flex gap-2">
          <button
            onClick={() => setFilterVeg(filterVeg === true ? null : true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
              filterVeg === true
                ? 'border-green-600 bg-green-50 text-green-700'
                : 'border-gray-200 text-gray-500'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-green-600" />
            Veg
          </button>
          <button
            onClick={() => setFilterVeg(filterVeg === false ? null : false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
              filterVeg === false
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-gray-200 text-gray-500'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500" />
            Non-Veg
          </button>
        </div>

        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex px-4 gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSearch('');
                  }}
                  className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeCategory === cat.id
                      ? 'text-gray-900'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                  style={
                    activeCategory === cat.id
                      ? { borderBottomColor: accent, color: accent }
                      : {}
                  }
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="px-4 py-4">
          {filteredItems.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No items found</p>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border border-gray-100 overflow-hidden ${
                    !item.is_available ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex">
                    <div className="flex-1 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`w-3 h-3 rounded-sm border-2 ${
                            item.is_veg
                              ? 'border-green-600'
                              : 'border-red-500'
                          }`}
                        >
                          <span
                            className={`block w-1.5 h-1.5 rounded-full m-[1px] ${
                              item.is_veg ? 'bg-green-600' : 'bg-red-500'
                            }`}
                          />
                        </span>
                        {!item.is_available && (
                          <span className="text-[10px] font-medium text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-[15px]">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <p className="font-semibold text-gray-800 mt-2 text-sm">
                        ₹{item.price}
                      </p>
                    </div>
                    {item.image_url && (
                      <div className="w-28 h-28 m-3 flex-shrink-0">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
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
        <div className="text-center py-6 text-xs text-gray-300">
          Powered by AllyMento
        </div>
      </div>
    </div>
  );
}