import { supabase } from '../../lib/supabase';
import SagarGaireMenu from './SagarGaireMenu';

export const dynamic = 'force-dynamic';

export default async function SagarGairePage() {
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', 'sagar-gaire')
    .single();

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#E87722] mb-2">Coming Soon</h1>
          <p className="text-gray-500">Sagar Gaire menu is cooking...</p>
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
    <SagarGaireMenu
      restaurant={restaurant}
      categories={categories || []}
      menuItems={menuItems || []}
    />
  );
}