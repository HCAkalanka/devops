import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CarCard from "./CarCard";
import { listListings } from "../api/listings";

// FeaturedCars section that fetches real listings from the API
const FeaturedCars = ({ limit = 4, title = "Featured Cars" }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await listListings({ limit, status: 'active' });
        setCars(Array.isArray(data) ? data.slice(0, limit) : []);
      } catch (error) {
        console.error('Failed to fetch featured cars:', error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [limit]);

  if (loading) {
    return (
      <section className="py-16" style={{ background: 'linear-gradient(180deg,#ffffff 0%,#f5f3ff 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="h-4 w-32 bg-indigo-100 rounded-full mb-3 animate-pulse" />
              <div className="h-8 w-56 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-3xl overflow-hidden bg-white shadow-sm animate-pulse">
                <div className="bg-gray-200 h-52 w-full"></div>
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded-lg w-1/2"></div>
                  <div className="h-8 bg-indigo-100 rounded-xl w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16" style={{ background: 'linear-gradient(180deg,#ffffff 0%,#f5f3ff 60%,#fdf4ff 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12 animate-fadeInUp">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3 bg-indigo-50 text-indigo-600">
              Top Picks
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">{title}</h2>
            <p className="text-gray-500 mt-2 text-sm">Handpicked selection of our premium vehicles</p>
          </div>
          <Link
            to="/cars"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}
          >
            View All <span>→</span>
          </Link>
        </div>

        {cars.length === 0 ? (
          <div className="card-elevated p-12 text-center animate-scaleIn">
            <div className="w-20 h-20 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center opacity-20">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No featured cars available at the moment.</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${
            cars.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
          }`}>
            {cars.map((car) => (
              <CarCard key={car._id} car={car} source="listing" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCars;
