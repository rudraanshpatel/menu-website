'use client';

import { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function generateOrderCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  upi_id: string | null;
  accent_color: string;
};

export default function CheckoutPage({ restaurant }: { restaurant: Restaurant }) {
  const { items, total, itemCount, updateQuantity, clearCart } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const accent = restaurant.accent_color || '#E24B4A';

  const handlePlaceOrder = async () => {
    if (!name.trim()) return setError('Enter your name');
    if (items.length === 0) return setError('Cart is empty');
    if (!restaurant.upi_id) return setError('This restaurant hasn\'t set up payments yet');

    setLoading(true);
    setError(null);

    const code = generateOrderCode();

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        restaurant_id: restaurant.id,
        customer_name: name.trim(),
        customer_phone: phone.trim() || null,
        order_code: code,
        total,
        status: 'payment_pending',
      })
      .select('id')
      .single();

    if (orderError || !order) {
      setError('Failed to create order. Try again.');
      setLoading(false);
      return;
    }

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      menu_item_id: item.id,
      item_name: item.name,
      item_price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      setError('Failed to save order items. Try again.');
      setLoading(false);
      return;
    }

    setOrderCode(code);
    setOrderId(order.id);
    setLoading(false);
  };

  const upiLink = orderCode && restaurant.upi_id
    ? `upi://pay?pa=${restaurant.upi_id}&pn=${restaurant.name}&am=${total.toFixed(2)}&cu=INR&tn=Order${orderCode}`
    : null;

  // ── Payment screen (after order created) ──
  if (orderCode && upiLink) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-6 pt-10 pb-6" style={{ backgroundColor: accent }}>
          <div className="max-w-lg mx-auto">
            <h1 className="text-xl font-bold text-white">Pay & Confirm</h1>
            <p className="text-sm text-white/80 mt-1">{restaurant.name}</p>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
          {/* Order code - big and prominent */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Your order code</p>
            <p className="text-5xl font-black tracking-widest" style={{ color: accent }}>
              {orderCode}
            </p>
            <p className="text-xs text-gray-400 mt-3">
              This code will appear in the payment note. The cashier will use it to confirm your order.
            </p>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Order Summary</p>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm py-1.5">
                <span className="text-gray-600">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium text-gray-800">₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900">₹{total}</span>
            </div>
          </div>

          {/* Pay button */}

          <a href={upiLink}
            className="block w-full text-center py-4 rounded-xl text-white font-bold text-base"
            style={{ backgroundColor: accent }}
          >
            Pay ₹{total} via UPI
          </a>

          {/* Manual UPI info */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">Or pay manually to</p>
            <p className="text-sm font-semibold text-gray-800">{restaurant.upi_id}</p>
            <p className="text-xs text-gray-400 mt-2">
              Add <span className="font-bold" style={{ color: accent }}>Order{orderCode}</span> in the payment note
            </p>
          </div>

          {/* Check status link */}
          <a
            href={`/${restaurant.slug}/order/${orderId}`}
            className="block text-center text-sm font-medium underline"
            style={{ color: accent }}
          >
            I&apos;ve paid — check order status →
          </a>
        </div>
      </div>
    );
  }

  // ── Cart / Checkout screen ──
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pt-10 pb-6" style={{ backgroundColor: accent }}>
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <a href={`/${restaurant.slug}`} className="text-white/80 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </a>
          <h1 className="text-xl font-bold text-white">Checkout</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">Your cart is empty</p>
            <a href={`/${restaurant.slug}`} className="text-sm font-medium mt-2 inline-block" style={{ color: accent }}>
              ← Back to menu
            </a>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Your Order ({itemCount} item{itemCount > 1 ? 's' : ''})
              </p>
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">₹{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: accent }}
                    >−</button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: accent }}
                    >+</button>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 w-16 text-right">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-gray-900">₹{total}</span>
              </div>
            </div>

            {/* Customer details */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-700">Your Details</p>
              <input
                type="text"
                placeholder="Your name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
              />
              <input
                type="tel"
                placeholder="Phone number (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Place order button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-bold text-base disabled:opacity-50"
              style={{ backgroundColor: accent }}
            >
              {loading ? 'Placing order...' : `Place Order · ₹${total}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}