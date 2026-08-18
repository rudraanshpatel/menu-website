import { supabase } from '../../lib/supabase';
import ChaiKaapiMenu from './ChaiKaapiMenu';

export const dynamic = 'force-dynamic';

export default async function ChaiKaapiPage() {
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', 'chai-kaapi')
    .single();

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a0e0a]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#f5e6d3] mb-2">Coming Soon</h1>
          <p className="text-[#a08060]">Chai Kaapi menu is being brewed...</p>
        </div>
      </div>
    );
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .order('sort_order', { ascending: true });

  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .order('sort_order', { ascending: true });

  return (
    <ChaiKaapiMenu
      restaurant={restaurant}
      categories={categories || []}
      menuItems={menuItems || []}
    />
  );
}