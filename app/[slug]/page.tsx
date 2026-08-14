import { supabase } from '../../lib/supabase';
import MenuPage from './MenuPage';

export const dynamic = 'force-dynamic';
export default async function RestaurantPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Restaurant not found</h1>
          <p className="text-gray-500">Check the URL and try again</p>
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
    .order('name', { ascending: true });

  return (
    <MenuPage
      restaurant={restaurant}
      categories={categories || []}
      menuItems={menuItems || []}
    />
  );
}