import { Link } from "react-router-dom";
import { Gauge, MapPin, Zap } from "lucide-react";

const CarCard = ({ car, source = "listing" }) => {
  const getImageUrl = () => {
    if (source === "listing") {
      return car.images?.[0]?.url || car.image || 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&q=60';
    }
    return car.image || 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&q=60';
  };

  const getBrandModel = () => {
    if (source === "listing") {
      return `${car.vehicle?.brand || car.brand || ''} ${car.vehicle?.model || car.model || ''}`.trim() || car.title || 'Vehicle';
    }
    return `${car.brand || ''} ${car.model || ''}`.trim() || 'Vehicle';
  };

  const getCategory = () => {
    if (source === "listing") return car.vehicle?.type || car.category || 'Vehicle';
    return car.category || 'Vehicle';
  };

  const getTransmission = () => {
    if (source === "listing") return car.vehicle?.transmission || car.transmission || 'Auto';
    return car.transmission || 'Auto';
  };

  const getPrice = () => {
    if (source === "listing") return car.pricing?.pricePerDay || car.pricePerDay || 0;
    return car.pricePerDay || 0;
  };

  const getLocation = () => {
    if (source === "listing") return car.location?.city || car.city || '';
    return car.city || car.location || '';
  };

  const formatPrice = (num) => {
    try { return new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 }).format(num || 0); }
    catch { return (num || 0).toLocaleString(); }
  };

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 hover:-translate-y-2">
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={getImageUrl()}
          alt={getBrandModel()}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay at bottom of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {/* Category badge top-right */}
        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}>
          {getCategory()}
        </span>
        {/* Location badge bottom-left */}
        {getLocation() && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-medium text-white">
            <MapPin className="w-3 h-3" />
            {getLocation()}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-indigo-600 transition-colors">{getBrandModel()}</h3>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-indigo-400" />
            {getTransmission()}
          </span>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-pink-400" />
            {source === "listing" ? (car.vehicle?.fuel || car.fuelType || 'Petrol') : (car.fuelType || 'Petrol')}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 mb-0.5">Per day</div>
            <div className="text-2xl font-extrabold text-indigo-600">
              Rs {formatPrice(getPrice())}
            </div>
          </div>
          <Link
            to={`/cardetails/${car._id}?source=${source}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;

