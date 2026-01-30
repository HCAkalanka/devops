import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  Gauge,
  Fuel,
  Users,
  Car,
  MapPin,
  Camera,
  ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { listListings, getListing } from "../api/listings";
import { listCars as listRawCars } from "../api/cars";
import { listCities } from "../api/cities";

function Cars() {
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState(urlSearch);
  const [vehicleType, setVehicleType] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [seats, setSeats] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuel, setFuel] = useState("");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const [showFilters, setShowFilters] = useState(false); // mobile drawer toggle
  const [selectedCar, setSelectedCar] = useState(null);
  const [sort, setSort] = useState("relevance");
  const navigate = useNavigate();

  // Update search when URL parameter changes
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // Load cities once
  useEffect(() => {
    (async () => {
      try {
        const data = await listCities({ limit: 200 });
        setCities(data || []);
      } catch {}
    })();
  }, []);

  // Fetch listings and raw cars in parallel; merge results so both appear
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const params = {};
        if (search.trim()) params.q = search.trim();
        if (vehicleType !== "All") params.type = vehicleType.toLowerCase();
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (seats) params.seats = seats;
        if (transmission) params.transmission = transmission;
        if (fuel) params.fuel = fuel;
        if (city) params.city = city;
        const [items, rawCars] = await Promise.all([
          listListings(params),
          listRawCars({
            ...(search.trim() ? { q: search.trim() } : {}),
            ...(vehicleType !== "All" ? { category: vehicleType } : {}),
            ...(city ? { location: city } : {}),
          }),
        ]);
        // Map listing shape to UI shape expected here
        let mappedListings = (items || []).map((l) => {
          const first = l?.images && l.images[0]?.url;
          const image = !first || String(first).startsWith('blob:')
            ? "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80"
            : first;
          return {
            _id: l._id,
            brand: l?.vehicle?.brand || "",
            model: l?.vehicle?.model || "",
            category: l?.vehicle?.type || "",
            transmission: l?.vehicle?.transmission || "Automatic",
            fuelType: l?.vehicle?.fuel || "Petrol",
            seats: l?.vehicle?.seats || 4,
            year: l?.vehicle?.year || "",
            pricePerDay: l?.pricing?.pricePerDay || 0,
            city: l?.location?.city || '',
            features: l?.vehicle?.features || [],
            image,
            imagesCount: Array.isArray(l?.images) ? l.images.length : 0,
            source: 'listing',
          };
        });
        const mappedCars = (rawCars || []).map((c) => {
          const img = c?.image && !String(c.image).startsWith('blob:')
            ? c.image
            : "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80";
          return {
            _id: c._id,
            brand: c.brand || "",
            model: c.model || "",
            category: c.category || "",
            transmission: c.transmission || "Automatic",
            fuelType: c.fuel_type || "Petrol",
            seats: c.seating_capacity || 4,
            year: c.year || "",
            pricePerDay: c.pricePerDay || 0,
            city: c.location || '',
            features: [],
            image: img,
            imagesCount: img ? 1 : 0,
            source: 'car',
          };
        });
        setCars([...(mappedListings || []), ...(mappedCars || [])]);
      } catch (e) {
        console.error("Failed to load listings", e);
        setCars([]);
      }
    };
    load();
    return () => controller.abort();
  }, [search, vehicleType, minPrice, maxPrice, seats, transmission, fuel, city]);

  // Client-side refine + sort for UX (server may already filter)
  const filteredCars = useMemo(() => {
    let result = [...cars];
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter((car) =>
        (car.brand || "").toLowerCase().includes(s) || (car.model || "").toLowerCase().includes(s)
      );
    }
    if (vehicleType !== "All") {
      result = result.filter((car) => (car.category || "").toLowerCase() === vehicleType.toLowerCase());
    }
    if (minPrice) result = result.filter(c => Number(c.pricePerDay) >= Number(minPrice));
    if (maxPrice) result = result.filter(c => Number(c.pricePerDay) <= Number(maxPrice));
    if (seats) result = result.filter(c => String(c.seats) === String(seats));
    if (transmission) result = result.filter(c => (c.transmission || '').toLowerCase() === transmission.toLowerCase());
    if (fuel) result = result.filter(c => (c.fuelType || '').toLowerCase() === fuel.toLowerCase());
    if (city) result = result.filter(c => (c.city || '').toLowerCase() === city.toLowerCase());

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => (a.pricePerDay || 0) - (b.pricePerDay || 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.pricePerDay || 0) - (a.pricePerDay || 0));
        break;
      default:
        break;
    }
    return result;
  }, [cars, search, vehicleType, minPrice, maxPrice, seats, transmission, fuel, city, sort]);

  const openQuickView = async (car) => {
    if (car?.source === 'listing') {
      try {
        const full = await getListing(car._id);
        setSelectedCar({
          _id: full._id,
          vehicle: full.vehicle || {},
          pricing: full.pricing || {},
          location: full.location || {},
          description: full.description || '',
          images: Array.isArray(full.images) && full.images.length ? full.images : [{ url: car.image }],
          owner: full.owner || null,
          source: 'listing',
        });
        return;
      } catch (e) {
        console.error('Failed to fetch listing details', e);
      }
    }
    // Default quick view built from the card data
    setSelectedCar({
      _id: car._id,
      vehicle: { type: car.category, brand: car.brand, model: car.model, year: car.year, seats: car.seats, transmission: car.transmission, fuel: car.fuelType },
      pricing: { pricePerDay: car.pricePerDay },
      location: { city: car.city },
      description: '',
      images: [{ url: car.image }],
      owner: null,
      source: 'car',
    });
  };

  const formatLKR = (num) => {
    const n = Number(num || 0);
    try {
      return new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 }).format(n);
    } catch {
      return n.toLocaleString();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Hero Section */}
      <section className="bg-gradient-primary py-12 mb-8 animate-fadeInUp">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Find Your Perfect Ride</h1>
          <p className="text-white/90 text-lg">Explore our extensive collection of vehicles</p>
        </div>
      </section>

      {/* Top bar */}
      <header className="sticky top-16 z-40 glass-effect border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <button
            className="md:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-blue-500 transition-all shadow-sm"
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal size={18} className="text-blue-600" /> 
            <span className="font-medium">Filters</span>
          </button>
          <div className="relative flex-1 animate-slideInLeft">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search brand, model, or features..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="hidden md:flex items-center gap-3 animate-slideInRight">
            <ArrowUpDown size={16} className="text-gray-400" />
            <select
              className="px-4 py-3 text-sm font-medium rounded-xl border border-gray-200 bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="relevance">Most Relevant</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-12 gap-6">
        {/* Sidebar filters (desktop) */}
        <aside className="hidden md:block md:col-span-3 animate-fadeInUp">
          <div className="card-elevated p-6 space-y-6 sticky top-28">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              {(vehicleType !== "All" || city || minPrice || maxPrice || seats || transmission || fuel) && (
                <button
                  onClick={() => {
                    setVehicleType("All");
                    setCity("");
                    setMinPrice("");
                    setMaxPrice("");
                    setSeats("");
                    setTransmission("");
                    setFuel("");
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <div>
              <div className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" />
                City
              </div>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c._id} value={c.city}>{c.city}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
                <Car size={16} className="text-blue-600" />
                Vehicle Type
              </div>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option>All</option>
                <option value="car">Car</option>
                <option value="suv">SUV</option>
                <option value="van">Van</option>
                <option value="motorbike">Motorbike</option>
                <option value="bus">Bus</option>
                <option value="truck">Truck</option>
                <option value="threewheeler">Three Wheeler</option>
                <option value="tractor">Tractor</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm font-semibold mb-3 text-gray-700">Min Price</div>
                <input
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ''))}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <div className="text-sm font-semibold mb-3 text-gray-700">Max Price</div>
                <input
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ''))}
                  placeholder="100000"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
                  <Users size={16} className="text-blue-600" />
                  Seats
                </div>
                <input
                  value={seats}
                  onChange={(e) => setSeats(e.target.value.replace(/\D/g, ''))}
                  placeholder="4"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <div className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
                  <Gauge size={16} className="text-blue-600" />
                  Transmission
                </div>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">Any</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Semi-Automatic">Semi-Automatic</option>
                </select>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
                <Fuel size={16} className="text-blue-600" />
                Fuel Type
              </div>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">Any</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <button
              onClick={() => {
                setVehicleType("All");
                setMinPrice("");
                setMaxPrice("");
                setSeats("");
                setTransmission("");
                setFuel("");
                setCity("");
              }}
              className="w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/60 dark:hover:bg-gray-700 text-sm"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Mobile filters drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 p-4 md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">Filters</div>
                <button onClick={() => setShowFilters(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X size={18} />
                </button>
              </div>

              {/* Reuse same controls as sidebar */}
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold mb-2">City</div>
                  <select className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800" value={city} onChange={(e)=>setCity(e.target.value)}>
                    <option value="">All Cities</option>
                    {cities.map((c) => (
                      <option key={c._id} value={c.city}>{c.city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-2">Vehicle Type</div>
                  <select className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800" value={vehicleType} onChange={(e)=>setVehicleType(e.target.value)}>
                    <option>All</option>
                    <option value="car">Car</option>
                    <option value="suv">SUV</option>
                    <option value="van">Van</option>
                    <option value="motorbike">Motorbike</option>
                    <option value="bus">Bus</option>
                    <option value="truck">Truck</option>
                    <option value="threewheeler">Three Wheeler</option>
                    <option value="tractor">Tractor</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input value={minPrice} onChange={(e)=>setMinPrice(e.target.value.replace(/\D/g, ''))} placeholder="Min (LKR)" className="px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800" />
                  <input value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value.replace(/\D/g, ''))} placeholder="Max (LKR)" className="px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input value={seats} onChange={(e)=>setSeats(e.target.value.replace(/\D/g, ''))} placeholder="Seats" className="px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800" />
                  <select value={transmission} onChange={(e)=>setTransmission(e.target.value)} className="px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800">
                    <option value="">Transmission</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Semi-Automatic">Semi-Automatic</option>
                  </select>
                </div>
                <select value={fuel} onChange={(e)=>setFuel(e.target.value)} className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800">
                  <option value="">Fuel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
                <button
                  onClick={() => {
                    setVehicleType("All"); setMinPrice(""); setMaxPrice(""); setSeats(""); setTransmission(""); setFuel(""); setCity("");
                  }}
                  className="w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/60 dark:hover:bg-gray-700 text-sm"
                >Reset</button>
                <button onClick={() => setShowFilters(false)} className="w-full py-2 rounded-xl bg-blue-600 text-white">Apply</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <section className="col-span-12 md:col-span-9">
          <div className="flex items-center justify-between mb-6 animate-fadeIn">
            <div className="text-lg font-semibold text-gray-900">
              <span className="text-blue-600">{filteredCars.length}</span> {filteredCars.length === 1 ? 'Vehicle' : 'Vehicles'} Available
            </div>
            <div className="md:hidden">
              <select 
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                value={sort} 
                onChange={(e)=>setSort(e.target.value)}
              >
                <option value="relevance">Most Relevant</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {filteredCars.length === 0 && (
            <div className="card text-center py-20 animate-fadeInUp">
              <Car size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No vehicles found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          )}

          <div className="space-y-5">
            {filteredCars.map((car, index) => (
              <motion.div
                key={car._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="card hover-lift overflow-hidden group"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative sm:w-72 md:w-80 shrink-0 overflow-hidden">
                    <img 
                      src={car.image} 
                      alt={`${car.brand} ${car.model}`} 
                      className="w-full h-52 sm:h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    {car.imagesCount > 1 && (
                      <span className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-black/70 text-white font-medium backdrop-blur-sm">
                        <Camera size={14} /> {car.imagesCount}
                      </span>
                    )}
                    {car.city && (
                      <span className="absolute top-3 left-3 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg glass text-gray-800 font-medium">
                        <MapPin size={12} className="text-blue-600" /> {car.city}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-5 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl sm:text-2xl font-bold capitalize text-gray-900 group-hover:text-blue-600 transition-colors">
                          {car.brand} {car.model}
                        </h2>
                        <p className="text-sm text-gray-500 capitalize mt-1 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
                          {car.category} • {car.transmission}
                        </p>
                      </div>
                      <div className="shrink-0 bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-3 rounded-xl border border-blue-200">
                        <div className="text-sm text-gray-600 mb-1">Price</div>
                        <div className="text-2xl md:text-3xl font-bold text-blue-600">
                          Rs {formatLKR(car.pricePerDay)}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">per day</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-700 mb-5">
                      <div className="flex items-center gap-2 hover-scale">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                          <Users size={18} className="text-blue-600"/>
                        </div>
                        <span className="font-medium">{car.seats} seats</span>
                      </div>
                      <div className="flex items-center gap-2 hover-scale">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                          <Fuel size={18} className="text-green-600"/>
                        </div>
                        <span className="font-medium">{car.fuelType}</span>
                      </div>
                      <div className="flex items-center gap-2 hover-scale">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                          <Gauge size={18} className="text-purple-600"/>
                        </div>
                        <span className="font-medium">{car.transmission}</span>
                      </div>
                      <div className="flex items-center gap-2 hover-scale">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                          <Car size={18} className="text-orange-600"/>
                        </div>
                        <span className="font-medium">{car.year || 'N/A'}</span>
                      </div>
                    </div>

                    {car.features && car.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {car.features.slice(0, 6).map((f, idx) => (
                          <span 
                            key={`${f}-${idx}`} 
                            className="text-xs px-3 py-1.5 rounded-full bg-gradient-light border border-gray-200 text-gray-700 font-medium animate-fadeIn"
                            style={{ animationDelay: `${idx * 50}ms` }}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => openQuickView(car)}
                        className="px-5 py-2.5 rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 font-medium transition-all hover-scale"
                      >
                        Quick View
                      </button>
                      <button
                        onClick={() => navigate(`/cardetails/${car._id}?source=${car.source || 'listing'}`)}
                        className="px-5 py-2.5 rounded-xl btn-primary"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate(`/booking/${car._id}?source=${car.source || 'listing'}`)}
                        className="px-5 py-2.5 rounded-xl btn-secondary"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedCar && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCar(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl p-8 max-w-5xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedCar(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gallery */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {(selectedCar.images || []).slice(0,4).map((img, idx) => (
                      <div 
                        key={idx} 
                        className={`rounded-2xl overflow-hidden border-2 border-gray-200 hover-scale ${idx===0?'col-span-2':''}`}
                      >
                        <img 
                          src={img.url} 
                          alt={`Car image ${idx + 1}`} 
                          className={`w-full object-cover ${idx===0?'h-[300px]':'h-[145px]'}`} 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-5">
                  <div>
                    <h2 className="text-3xl font-bold mb-2 capitalize text-gray-900">
                      {selectedCar?.vehicle?.brand} {selectedCar?.vehicle?.model}
                    </h2>
                    <p className="text-gray-600 text-lg capitalize flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
                      {selectedCar?.vehicle?.type} • {selectedCar?.vehicle?.transmission}
                    </p>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-200 flex items-center justify-center">
                          <Fuel size={20} className="text-blue-700"/>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Fuel Type</div>
                          <div className="font-bold text-gray-900">{selectedCar?.vehicle?.fuel || 'Petrol'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-200 flex items-center justify-center">
                          <Users size={20} className="text-purple-700"/>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Seats</div>
                          <div className="font-bold text-gray-900">{selectedCar?.vehicle?.seats || '-'} seats</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-200 flex items-center justify-center">
                          <Car size={20} className="text-orange-700"/>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Year</div>
                          <div className="font-bold text-gray-900">{selectedCar?.vehicle?.year || 'N/A'}</div>
                        </div>
                      </div>
                    </div>

                    {selectedCar?.location?.city && (
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-200 flex items-center justify-center">
                            <MapPin size={20} className="text-green-700"/>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">Location</div>
                            <div className="font-bold text-gray-900">{selectedCar.location.city}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  {selectedCar?.vehicle?.features && selectedCar.vehicle.features.length > 0 && (
                    <div>
                      <div className="font-bold text-gray-900 mb-3">Features</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedCar.vehicle.features.slice(0,8).map((f, i) => (
                          <span 
                            key={`${f}-${i}`} 
                            className="bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {selectedCar?.description && (
                    <div>
                      <div className="font-bold text-gray-900 mb-2">Description</div>
                      <p className="text-sm text-gray-700 leading-relaxed">{selectedCar.description}</p>
                    </div>
                  )}

                  {/* Price and Action */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Price per day</div>
                        <p className="text-4xl font-bold text-blue-600">
                          Rs {formatLKR(selectedCar?.pricing?.pricePerDay || 0)}
                        </p>
                        {selectedCar?.pricing?.deposit ? (
                          <p className="text-sm text-gray-600 mt-2">Deposit: Rs {formatLKR(selectedCar.pricing.deposit)}</p>
                        ) : null}
                      </div>
                      <button
                        onClick={() => navigate(`/booking/${selectedCar._id}?source=${selectedCar?.source || 'listing'}`)}
                        className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-700 hover:to-red-800 transition-all hover-scale shadow-lg"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>

                  {/* Owner info */}
                  {selectedCar?.owner && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="font-bold text-gray-900 mb-3">Owner Information</div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900 capitalize">{selectedCar.owner.name || 'Owner'}</div>
                          <div className="text-sm text-gray-600">{selectedCar.owner.email || ''}</div>
                        </div>
                        <span className="text-xs px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 font-medium border border-blue-200">
                          {selectedCar.owner.role}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Cars;
