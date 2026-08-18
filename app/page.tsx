import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <nav className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
          <span className="text-xl font-bold">AllyMento</span>
          <a href="#contact" className="text-sm bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100">Get Started</a>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Your restaurant menu,
            <br />
            <span className="text-green-400">online in 10 minutes</span>
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            No website needed. No Zomato commission. Just a QR code on your table
            and a beautiful menu your customers can browse on their phone.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a href="#contact" className="bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-lg font-semibold text-lg">Get Your Menu Live</a>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">How it works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl">📱</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">1. Add your menu</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Open the app, type in your dishes, prices, and upload photos from your phone camera. That&apos;s it.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl">🎨</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">2. Customize your brand</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Add your logo, pick your brand color, write a tagline. Your menu page looks like yours, not ours.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl">📋</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">3. Print the QR code</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Generate a QR code, print it, stick it on your tables. Customers scan and see your full menu instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Everything you need, nothing you don&apos;t</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Update prices instantly',
                desc: 'Paneer price went up? Change it in the app — your menu updates in seconds. No reprinting.',
                icon: '💰',
              },
              {
                title: 'Mark items out of stock',
                desc: 'One tap to mark an item unavailable. Customers see it immediately. No crossed-out laminated menus.',
                icon: '🔄',
              },
              {
                title: 'Veg / Non-veg markers',
                desc: 'Clear green and red indicators on every item. Your customers know exactly what they are ordering.',
                icon: '🟢',
              },
              {
                title: 'Multiple outlets',
                desc: 'Run 3 restaurants? Manage all their menus from one account. Each gets its own branded page.',
                icon: '🏪',
              },
              {
                title: 'Share via WhatsApp',
                desc: 'Send your menu link to customers, share it on your WhatsApp status, post it in groups. One tap.',
                icon: '📤',
              },
              {
                title: 'Works on every phone',
                desc: 'No app download needed for your customers. They scan, they see the menu. Works on any phone with a camera.',
                icon: '📲',
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-white p-6 rounded-xl border border-gray-100">
                <span className="text-2xl">{feature.icon}</span>
                <h3 className="font-semibold text-lg mt-3 mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div id="contact" className="bg-gray-900 text-white py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to ditch the laminated menu?</h2>
          <p className="text-gray-400 mb-8">Get in touch and we&apos;ll set up your restaurant in 10 minutes.</p>
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_CONTACT_PHONE}?text=Hi%2C%20I%20want%20to%20set%20up%20my%20restaurant%20menu`} target="_blank" className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-lg font-semibold text-lg">WhatsApp Us</a>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-gray-400">
        © 2026 AllyMento. All rights reserved.
      </div>
    </div>
  );
}