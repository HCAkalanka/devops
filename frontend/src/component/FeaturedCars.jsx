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
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-xl shadow-md p-4 bg-white animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
                <div className="h-6 bg-gray-200 rounded mt-2 w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          <Link
            to="/cars"
            className="text-blue-600 hover:text-blue-700 font-medium"
            aria-label="View all cars"
          >
            View all
          </Link>
        </div>

        {cars.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No featured cars available at the moment.</p>
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
