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
  { name: 'UOR', text: 'Smooth booking and clean car. Highly recommended.', city: 'Colombo' },
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
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)' }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <img
          src={assets.hero_bg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none select-none mix-blend-overlay"
          loading="lazy"
        />
        <div className="relative mx-auto max-w-7xl px-6 md:px-10 lg:px-14 xl:px-20 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-semibold">
               Premium Car Rental Service
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
              Your Perfect Ride<br/>
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
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* Featured */}
      <FeaturedCars />

      {/* How It Works */}
      <section className="py-14 md:py-20 bg-light">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">How It Works</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className="group rounded-2xl bg-white p-6 border border-gray-100 shadow-sm hover:shadow-md transition"
                >
                  <div className="h-14 w-14 rounded-xl flex items-center justify-center mb-5 bg-blue-50">
                    <img src={s.icon} alt="" className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-14 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Why Choose Us</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-blue-50">
                  <img src={b.icon} alt="" className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{b.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">What Renters Say</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col"
              >
                <p className="text-sm text-gray-700 leading-relaxed flex-grow">“{t.text}”</p>
                <div className="mt-4 text-xs font-medium text-gray-500">
                  {t.name} · {t.city}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600 to-blue-600" />
        <div className="mx-auto max-w-4xl text-center px-6 md:px-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to List Your Vehicle?</h2>
          <p className="text-white/80 mb-8 text-sm md:text-base">
            Earn by sharing your car. Simple onboarding. Full control over pricing and availability.
          </p>
          <Link
            to="/post"
            className="inline-flex items-center px-7 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition"
            style={{ backgroundColor: '#1D4ED8' }}
          >
            Post Your Ad
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid gap-10 md:grid-cols-4">
          <div>
            <img src={assets.logo} alt="Logo" className="h-9 mb-4" />
            <p className="text-sm text-gray-400 leading-relaxed">
              A modern platform to rent or list vehicles across Sri Lanka.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/cars" className="hover:text-white">All Cars</Link></li>
              <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-default">Help Center</span></li>
              <li><span className="cursor-default">Safety</span></li>
              <li><span className="cursor-default">Terms & Privacy</span></li>
            </ul>
          </div>
            <div>
              <h4 className="font-semibold mb-4 text-white text-sm">Stay Updated</h4>
              <form className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Email"
                  className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: '#1D4ED8' }}
                >
                  Subscribe
                </button>
              </form>
            </div>
        </div>
        <div className="mt-10 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} CarRental. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Home