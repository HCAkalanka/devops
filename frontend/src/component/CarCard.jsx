import { Link } from "react-router-dom";
import { Car, Gauge, Calendar, MapPin } from "lucide-react";

const CarCard = ({ car, source = "listing" }) => {
  // Handle both Listing and Car data structures
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
    if (source === "listing") {
      return car.vehicle?.type || car.category || 'Vehicle';
    }
    return car.category || 'Vehicle';
  };

  const getTransmission = () => {
    if (source === "listing") {
      return car.vehicle?.transmission || car.transmission || 'Auto';
    }
    return car.transmission || 'Auto';
  };

  const getPrice = () => {
    if (source === "listing") {
      return car.pricing?.pricePerDay || car.pricePerDay || 0;
    }
    return car.pricePerDay || 0;
  };

  const getLocation = () => {
    if (source === "listing") {
      return car.location?.city || car.city || '';
    }
    return car.city || car.location || '';
  };

  const formatPrice = (num) => {
    try {
      return new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 }).format(num || 0);
    } catch {
      return (num || 0).toLocaleString();
    }
  };

  return (
    <div className="group card hover-lift bg-white transition-all duration-300">
      <div className="relative overflow-hidden rounded-t-xl">
        <img 
          src={getImageUrl()} 
          alt={getBrandModel()} 
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <span className="badge badge-primary backdrop-blur-md bg-white/90">
            {getCategory()}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{getBrandModel()}</h3>
        
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4 text-indigo-500" />
            <span>{getTransmission()}</span>
          </div>
          {getLocation() && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-pink-500" />
              <span className="capitalize">{getLocation()}</span>
            </div>
          )}
        </div>
        
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-4 mb-4 border border-indigo-100">
          <div className="relative z-10">
            <div className="text-xs font-medium text-gray-600 mb-1">Daily Rate</div>
            <div className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Rs {formatPrice(getPrice())}
            </div>
          </div>
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-indigo-200/30 to-pink-200/30 rounded-full blur-2xl"></div>
        </div>
        
        <Link 
          to={`/cardetails/${car._id}?source=${source}`} 
          className="btn btn-primary w-full text-center group/btn"
        >
          <span>View Details</span>
          <Car className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default CarCard;
