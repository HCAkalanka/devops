import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FeaturedCars from '../component/FeaturedCars'
import { assets } from '../assets/assets'
import axios from 'axios'

const categories = [
  { key: 'car', label: 'Car' },
  { key: 'suv', label: 'SUV' },
  { key: 'van', label: 'Van' },
  { key: 'motorbike', label: 'Motor Bike' },
  { key: 'bus', label: 'Bus' },
  { key: 'truck', label: 'Truck' },
  { key: 'threewheeler', label: 'Three Wheeler' },
  { key: 'tractor', label: 'Tractor' }
]

const steps = [
  { icon: assets.search_icon, title: 'Browse & Choose', desc: 'Filter by type, price, location and find the exact vehicle you need.' },
  { icon: assets.calendar_icon, title: 'Book Securely', desc: 'Select dates, confirm availability and pay through secure checkout.' },
  { icon: assets.key_icon, title: 'Pick Up & Drive', desc: 'Collect the vehicle at the chosen location and enjoy the ride.' }
]

const benefits = [
  { icon: assets.support_icon, title: '24/7 Support', desc: 'Round‑the‑clock assistance for bookings and issues.' },
  { icon: assets.shield_icon, title: 'Trusted & Insured', desc: 'Vehicles verified. Transparent insurance coverage.' },
  { icon: assets.location_icon, title: 'Nationwide Coverage', desc: 'Multiple city pick‑up and drop‑off points.' },
  { icon: assets.money_icon, title: 'Fair Pricing', desc: 'No hidden fees. Clear daily and weekly rates.' },
  { icon: assets.star_icon, title: 'Top Rated Hosts', desc: 'Community reviewed owners with high reliability.' },
  { icon: assets.refresh_icon, title: 'Flexible Changes', desc: 'Adjust dates easily when plans shift.' }
]

const testimonials = [
  { name: 'supun', text: 'Smooth booking and clean car. Highly recommended.', city: 'Colombo' },
  { name: 'Shehani', text: 'Price was fair and pickup process quick.', city: 'Galle' },
  { name: 'du', text: 'Support resolved my date change in minutes.', city: 'Kandy' }
]

const Home = () => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loadingSuggest, setLoadingSuggest] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const navigate = useNavigate()

  // Debounced search suggestions (stub endpoint)
  useEffect(() => {
    const handle = setTimeout(async () => {
      if (!query.trim()) {
        setSuggestions([])
        return
      }
      try {
        setLoadingSuggest(true)
  const res = await axios.get(`/api/listings?q=${encodeURIComponent(query.trim())}&limit=6`)
  setSuggestions((Array.isArray(res.data) ? res.data : []).slice(0, 6))
      } catch {
        setSuggestions([])
      } finally {
        setLoadingSuggest(false)
      }
    }, 350)
    return () => clearTimeout(handle)
  }, [query])

  const onSelectSuggestion = useCallback((s) => {
    navigate(`/booking/${s._id}`)
  }, [navigate])

  const onSearchSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('search', query.trim())
    if (activeCategory) params.set('type', activeCategory)
    navigate(`/cars?${params.toString()}`)
  }

  return (
    <div className="font-sans text-gray-800 animate-fadeIn">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[580px] md:min-h-[680px]">
        {/* Background image — fully visible as the base layer */}
        <img
          src={assets.hero_bg}
          alt="Hero background car"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
          loading="eager"
        />
        {/* Semi-transparent gradient overlay so text stays readable */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(120deg, rgba(30,27,75,0.82) 0%, rgba(88,28,135,0.72) 55%, rgba(157,23,77,0.65) 100%)' }}
        />
        <div className="relative mx-auto max-w-7xl px-6 md:px-10 lg:px-14 xl:px-20 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-semibold">
               Welcome to Our Car Rental
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
              Welcome to Our Premium Car Rental<br/>
              <span className="text-gradient bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">Awaits</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
              Explore, book, and drive across Sri Lanka with ease. Premium vehicles, unbeatable prices.
            </p>
            <form
              onSubmit={onSearchSubmit}
              className="relative group glass-effect rounded-3xl shadow-2xl border border-white/40 flex flex-col sm:flex-row items-center gap-3 px-5 py-4 md:px-7 md:py-5"
            >
              <img src={assets.search_icon} alt="search" className="h-6 w-6 opacity-80 hidden sm:block" />
              <input
                type="text"
                placeholder="Search brand, model, city..."
                className="flex-1 bg-transparent border-none outline-none text-lg text-gray-800 placeholder:text-gray-500 w-full sm:w-auto"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search cars"
              />
              <div className="flex gap-2 flex-wrap">
                {categories.slice(0, 4).map(cat => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategory(c => c === cat.key ? null : cat.key)}
                    className={[
                      'hidden md:inline-flex px-3 py-2 rounded-full text-xs font-medium border transition-all',
                      activeCategory === cat.key
                        ? 'bg-white text-blue-600 border-white shadow-md scale-105'
                        : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                    ].join(' ')}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                className="btn btn-primary px-6 py-3 text-base font-bold whitespace-nowrap shadow-lg hover:shadow-xl hover-scale"
              >
                Search
              </button>
              {/* Suggestions dropdown */}
              {query && (
                <div
                  className="absolute left-0 top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-20"
                  role="listbox"
                >
                  {loadingSuggest && (
                    <div className="p-4 text-sm text-gray-500">Searching...</div>
                  )}
                  {!loadingSuggest && suggestions.length === 0 && (
                    <div className="p-4 text-sm text-gray-500">No matches</div>
                  )}
                  {!loadingSuggest && suggestions.map(s => (
                    <button
                      key={s._id}
                      type="button"
                      onClick={() => onSelectSuggestion(s)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex justify-between gap-4"
                    >
                      <span className="truncate">{s.brand} {s.model}</span>
                      <span className="text-gray-500">{s.location}</span>
                    </button>
                  ))}
                </div>
              )}
            </form>
            <div className="mt-6 flex flex-wrap gap-2 animate-fadeInUp">
              {categories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setActiveCategory(cat.key)
                    navigate(`/cars?type=${cat.key}`)
                  }}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-blue-600 hover:scale-105"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Bottom wave fade to white */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* Featured */}
      <FeaturedCars />

      {/* How It Works */}
      <section className="py-16 md:py-24" style={{ background: 'linear-gradient(180deg, #0f0c29 0%, #1a1a4e 100%)' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }}>Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">How It Works</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={i}
                className="group relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="absolute -top-4 -left-2 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black text-white" style={{ background: 'linear-gradient(135deg,#6366F1,#EC4899)' }}>
                  {i + 1}
                </div>
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 mt-2" style={{ background: 'rgba(99,102,241,0.2)' }}>
                  <img src={s.icon} alt="" className="h-7 w-7 brightness-200" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 bg-indigo-50 text-indigo-600">Our Advantages</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Why Choose Us</h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto text-sm">Everything you need for a seamless rental experience, all in one place.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <div key={i} className="group flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 bg-white hover:-translate-y-1">
                <div className="shrink-0 h-12 w-12 flex items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)' }}>
                  <img src={b.icon} alt="" className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{b.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #fdf4ff 100%)' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 bg-pink-50 text-pink-600">Reviews</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">What Renters Say</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="group rounded-3xl bg-white p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col border border-white hover:-translate-y-1"
              >
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed flex-grow italic">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg,#6366F1,#EC4899)' }}>
                    {t.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)' }} />
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
        <div className="relative mx-auto max-w-4xl text-center px-6 md:px-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
            <span>🚗</span> Earn with your vehicle
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">Ready to List Your Vehicle?</h2>
          <p className="text-white/80 mb-10 text-base md:text-lg max-w-xl mx-auto">
            Earn by sharing your car. Simple onboarding. Full control over pricing and availability.
          </p>
          <Link
            to="/post"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-indigo-700 shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:-translate-y-1"
            style={{ background: '#fff' }}
          >
            Post Your Ad
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0d0b1e' }} className="text-gray-400 py-14">
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid gap-10 md:grid-cols-4">
          <div>
            <img src={assets.logo} alt="Logo" className="h-9 mb-4 brightness-200" />
            <p className="text-sm leading-relaxed text-gray-500">
              A modern platform to rent or list vehicles across Sri Lanka.
            </p>
            <div className="flex gap-3 mt-5">
              {[assets.facebook_logo, assets.instagram_logo, assets.twitter_logo].map((icon, i) => (
                <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <img src={icon} alt="" className="w-4 h-4 brightness-200 opacity-70" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white text-sm tracking-wide">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/cars" className="hover:text-white transition-colors">All Cars</Link></li>
              <li><Link to="/post" className="hover:text-white transition-colors">Post Ad</Link></li>
              <li><Link to="/mybookings" className="hover:text-white transition-colors">My Bookings</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white text-sm tracking-wide">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><span className="cursor-default hover:text-white transition-colors">Help Center</span></li>
              <li><span className="cursor-default hover:text-white transition-colors">Safety</span></li>
              <li><span className="cursor-default hover:text-white transition-colors">Terms & Privacy</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white text-sm tracking-wide">Stay Updated</h4>
            <p className="text-xs text-gray-500 mb-3">Get the latest deals and news straight to your inbox.</p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="px-4 py-2.5 rounded-xl text-sm outline-none text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#6366F1,#EC4899)' }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-center text-xs" style={{ borderColor: 'rgba(255,255,255,0.07)', color: '#4b5563' }}>
          © {new Date().getFullYear()} CarRental. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Home