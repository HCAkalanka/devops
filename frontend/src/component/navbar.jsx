import React, { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { assets, menuLinks } from '../assets/assets'
import { upgradeToOwner } from '../api/users'

const Navbar = ({ setShowLogin, authed, onLogout }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')

  // Always check localStorage directly for most reliable auth state
  const isAuthed = (() => {
    try {
      const token = localStorage.getItem('token')
      return !!token
    } catch {
      return false
    }
  })()

  const role = useMemo(() => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return null
      const [, payload] = token.split('.')
      const data = JSON.parse(atob(payload))
      return data.role || null
    } catch { return null }
  }, [forceUpdate])

  // Handle shadow/background change on scroll (for transparent home header)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Listen to storage events from other tabs/windows
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'token') {
        setForceUpdate(v => v + 1)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const isHome = location.pathname === '/'

  const handleSearch = (e, query) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/cars?search=${encodeURIComponent(query.trim())}`)
      setSearchQuery('')
    }
  }

  const handleMobileSearch = (e, query) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/cars?search=${encodeURIComponent(query.trim())}`)
      setMobileSearchQuery('')
      setOpen(false)
    }
  }

  return (
    <header
      className={[
        'sticky top-0 z-50 transition-all duration-300',
        'backdrop-blur-md',
        scrolled || !isHome ? 'bg-white/95 border-b border-gray-200 shadow-lg' : 'bg-white/70',
      ].join(' ')}
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-14 xl:px-20">
        <div className="h-16 flex items-center gap-4 justify-between">
          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center gap-2" aria-label="Go to home">
            <img src={assets.logo} alt="Logo" className="h-8" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-8" aria-label="Primary">
            {menuLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  [
                    'text-sm font-semibold transition-all duration-200 relative',
                    'hover:text-primary',
                    isActive ? 'text-primary' : 'text-gray-700',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <span className="inline-flex items-center gap-2">
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-2 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Search (desktop) */}
          <form onSubmit={(e) => handleSearch(e, searchQuery)} className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 py-1.5 rounded-full max-w-64">
            <img src={assets.search_icon} alt="Search" className="h-4 w-4 opacity-70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none placeholder-gray-500"
              placeholder="Search cars, brands, locations"
              aria-label="Search cars"
            />
          </form>

          {/* Right actions - ALWAYS VISIBLE */}
          <div key={`auth-${forceUpdate}`} className="shrink-0 flex items-center gap-2 sm:gap-3">
            {isAuthed ? (
              <>
                <button
                  onClick={() => navigate('/post')}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  Post Ad
                </button>
                {role === 'owner' && (
                  <button
                    onClick={() => navigate('/owner-bookings')}
                    className="px-3 py-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap border rounded-lg"
                  >
                    My Bookings
                  </button>
                )}
                {role !== 'owner' && (
                  <button
                    onClick={async () => {
                      try {
                        await upgradeToOwner()
                        setForceUpdate(v => v + 1)
                      } catch { /* no-op */ }
                    }}
                    className="px-3 py-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap border rounded-lg"
                  >
                    Become Owner
                  </button>
                )}
                <button
                  onClick={() => {
                    onLogout?.()
                    try { localStorage.removeItem('token') } catch {}
                    setForceUpdate(v => v + 1)
                    setTimeout(() => navigate('/'), 0)
                  }}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors rounded-lg whitespace-nowrap"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  typeof setShowLogin === 'function' ? setShowLogin(true) : navigate('/login')
                }}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg text-white transition-colors whitespace-nowrap"
                style={{backgroundColor: '#2563EB'}}
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-borderColor"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`sm:hidden fixed inset-0 z-40 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-80 max-w-[80%] bg-white border-l border-borderColor p-6 flex flex-col gap-6 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
          role="dialog"
          aria-modal="true"
        >
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <img src={assets.logo} alt="Logo" className="h-7" />
          </Link>

          <div className="flex items-center gap-2 border border-borderColor px-3 py-2 rounded-lg">
            <img src={assets.search_icon} alt="Search" className="h-4 w-4 opacity-70" />
            <form onSubmit={(e) => handleMobileSearch(e, mobileSearchQuery)} className="w-full">
              <input
                type="text"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none placeholder-gray-500"
                placeholder="Search cars"
                aria-label="Search cars"
              />
            </form>
          </div>

          <nav className="flex flex-col gap-2" aria-label="Mobile Primary">
            {menuLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-light text-gray-900' : 'text-gray-700 hover:bg-light'}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            {isAuthed ? (
              <>
                {role === 'owner' && (
                  <button
                    onClick={() => {
                      setOpen(false)
                      navigate('/owner-bookings')
                    }}
                    className="w-full px-4 py-2 text-sm border border-borderColor rounded-lg text-gray-800"
                  >
                    My Bookings
                  </button>
                )}
                {role !== 'owner' && (
                  <button
                    onClick={async () => {
                      try {
                        setOpen(false)
                        await upgradeToOwner()
                        setForceUpdate(v => v + 1)
                      } catch {}
                    }}
                    className="w-full px-4 py-2 text-sm border border-borderColor rounded-lg text-gray-800"
                  >
                    Become Owner
                  </button>
                )}
                <button
                  onClick={() => {
                    setOpen(false)
                    onLogout?.()
                    try { localStorage.removeItem('token') } catch {}
                    setForceUpdate(v => v + 1)
                    navigate('/')
                  }}
                  className="w-full px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setOpen(false)
                    navigate('/post')
                  }}
                  className="w-full px-4 py-2 text-sm rounded-lg bg-blue-600 text-white"
                >
                  Post Ad
                </button>
                <button
                  onClick={() => {
                    setOpen(false)
                    typeof setShowLogin === 'function' ? setShowLogin(true) : navigate('/login')
                  }}
                  className="w-full px-4 py-2 text-sm rounded-lg text-white"
                  style={{backgroundColor: '#2563EB'}}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar