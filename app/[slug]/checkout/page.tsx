import { supabase } from '../../../lib/supabase';
import CheckoutPage from './CheckoutPage';

export const dynamic = 'force-dynamic';

export default async function Checkout({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id, name, slug, upi_id, accent_color')
    .eq('slug', slug)
    .single();

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Restaurant not found</p>
      </div>
    );
  }

  return <CheckoutPage restaurant={restaurant} />;
}