import { Link } from "react-router-dom";

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

  const formatPrice = (num) => {
    try {
      return new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 }).format(num || 0);
    } catch {
      return (num || 0).toLocaleString();
    }
  };

  return (
    <div className="card hover-lift overflow-hidden">
      <img 
        src={getImageUrl()} 
        alt={getBrandModel()} 
        className="rounded-t-xl w-full h-48 object-cover hover-scale"
      />
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{getBrandModel()}</h2>
        <p className="text-sm text-gray-500 capitalize mb-4">{getCategory()} • {getTransmission()}</p>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-3 rounded-xl border border-blue-200 mb-4">
          <div className="text-xs text-gray-600 mb-1">Price</div>
          <div className="text-2xl font-bold text-blue-600">Rs {formatPrice(getPrice())}</div>
          <div className="text-xs text-gray-600">per day</div>
        </div>
        
        <Link 
          to={`/cardetails/${car._id}?source=${source}`} 
          className="block btn-secondary text-center py-3 text-sm font-semibold"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CarCard;
