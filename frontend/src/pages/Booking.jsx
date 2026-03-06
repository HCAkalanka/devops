// src/pages/Booking.jsx

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getListing } from "../api/listings";
import { checkAvailability, createBooking as apiCreateBooking } from "../api/bookings";
// Use app's existing dummy data and assets instead of a separate local dummy
// Booking will fetch car details from API instead of using dummy data


function Booking() {
  const { id } = useParams(); // listing ID

  // State for the car's details (to be fetched from an API)
  const [car, setCar] = useState(null);

  // State for the form inputs
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pickup: "",
    dropoff: "",
  });

  // State for calculated price details
  const [priceDetails, setPriceDetails] = useState({
    days: 0,
    subtotal: 0,
    taxes: 0,
    total: 0,
  });

  // Load listing details
  useEffect(() => {
    (async () => {
      try {
        const l = await getListing(id);
        // Map to UI shape
        const mapped = {
          _id: l._id,
          brand: l?.vehicle?.brand || "",
          model: l?.vehicle?.model || "",
          year: l?.vehicle?.year || "",
          transmission: l?.vehicle?.transmission || "Automatic",
          fuel_type: l?.vehicle?.fuel || "Petrol",
          seating_capacity: l?.vehicle?.seats || 4,
          pricePerDay: l?.pricing?.pricePerDay || 0,
          image: (l?.images && l.images[0]?.url) || "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80",
        };
        setCar(mapped);
      } catch (e) {
        console.error('Failed to load listing', e);
        setCar(null);
      }
    })();
  }, [id]);

  // Effect to calculate price whenever dates change
  useEffect(() => {
    if (form.pickup && form.dropoff && car) {
      const pickupDate = new Date(form.pickup);
      const dropoffDate = new Date(form.dropoff);
      
      // Calculate the difference in time (in milliseconds)
      const timeDiff = dropoffDate.getTime() - pickupDate.getTime();

      // Convert time difference to days (1000ms * 60s * 60m * 24h)
      const dayCount = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (dayCount > 0) {
        const subtotal = dayCount * car.pricePerDay;
        const taxes = subtotal * 0.1; // Example: 10% tax
        const total = subtotal + taxes;
        setPriceDetails({
          days: dayCount,
          subtotal: subtotal.toFixed(2),
          taxes: taxes.toFixed(2),
          total: total.toFixed(2),
        });
      } else {
        // Reset if dates are invalid
        setPriceDetails({ days: 0, subtotal: 0, taxes: 0, total: 0 });
      }
    }
  }, [form.pickup, form.dropoff, car]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(priceDetails.days <= 0) {
      alert("Please select a valid date range.");
      return;
    }
    // First check availability
    const start = form.pickup;
    const end = form.dropoff;
    try {
      const avail = await checkAvailability({ listingId: id, start, end });
      if (!avail.available) {
        alert('Selected dates are not available');
        return;
      }
    } catch (err) {
      console.error(err);
      // continue to try booking anyway
    }

    const payload = { listingId: id, start, end, contact: { name: form.name, email: form.email, phone: form.phone } };
    try {
      const data = await apiCreateBooking(payload);
      alert('Booking confirmed!');
      console.log('Booking created', data);
    } catch (err) {
      console.error(err);
      if (String(err?.response?.status) === '401') {
        alert('Please login to complete booking.');
      } else {
        alert(err.message || 'Booking failed');
      }
    }
  };

  if (!car) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(135deg,#f0f4ff 0%,#fdf4ff 100%)' }}>
        <div className="text-center animate-fadeIn">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ background: 'linear-gradient(135deg,#f0f4ff 0%,#fdf4ff 100%)' }}>
      {/* Page header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="rounded-3xl px-8 py-10 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0f0c29 0%,#302b63 60%,#24243e 100%)' }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #ec4899 0%, transparent 50%)' }} />
          <div className="relative">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3" style={{ background: 'rgba(99,102,241,0.25)', color: '#a5b4fc' }}>Secure Booking</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1">{car.brand} {car.model}</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Complete your reservation below</p>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Booking Form */}
        <div className="md:col-span-2">
          <div className="card-elevated p-8 animate-fadeIn">
            <h2 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">Booking Details</h2>
            <p className="text-gray-500 mb-8">Fill in your information to complete the reservation</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Personal Information Section */}
              <div>
                <h2 className="text-xl font-bold mb-5 text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold">1</div>
                  Your Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" name="name" placeholder="John Doe" onChange={handleChange} required className="input" />
                  </div>
                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" name="email" placeholder="you@example.com" onChange={handleChange} required className="input" />
                  </div>
                  {/* Phone */}
                  <div className="sm:col-span-2 form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" name="phone" placeholder="+94 XX XXX XXXX" onChange={handleChange} required className="input" />
                  </div>
                </div>
              </div>

              {/* Rental Period Section */}
              <div>
                <h2 className="text-xl font-bold mb-5 text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center text-sm font-bold">2</div>
                  Rental Period
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Pickup Date */}
                  <div className="form-group">
                     <label className="form-label">Pickup Date</label>
                    <input type="date" name="pickup" onChange={handleChange} required className="input" />
                  </div>
                   {/* Dropoff Date */}
                  <div className="form-group">
                    <label className="form-label">Dropoff Date</label>
                    <input type="date" name="dropoff" onChange={handleChange} required className="input" />
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <button type="submit" className="btn btn-primary btn-lg w-full shadow-xl">
                Confirm & Book Now
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Booking Summary */}
        <div className="md:col-span-1">
          <div className="card-elevated p-6 sticky top-24 animate-fadeIn" style={{animationDelay: '0.2s'}}>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Booking Summary</h2>
            <div className="relative overflow-hidden rounded-2xl mb-5 group">
              <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{`${car.brand} ${car.model}`}</h3>
            {car.year && <p className="text-sm text-gray-500 mb-4">{car.year}</p>}
            
            <hr className="my-5 border-gray-200" />
            
            <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                    <span>Price per day</span>
                    <span>LKR {Number(car.pricePerDay).toLocaleString('en-LK')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Number of days</span>
                    <span>{priceDetails.days}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>LKR {Number(priceDetails.subtotal).toLocaleString('en-LK')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Taxes & Fees (10%)</span>
                    <span>LKR {Number(priceDetails.taxes).toLocaleString('en-LK')}</span>
                </div>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-2xl font-bold text-gray-800">
                <span>Total</span>
                <span>LKR {Number(priceDetails.total).toLocaleString('en-LK')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;