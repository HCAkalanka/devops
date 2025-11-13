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
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Booking Form */}
        <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Booking Details</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Information Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                    <input type="text" name="name" placeholder="John Doe" onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                    <input type="email" name="email" placeholder="you@example.com" onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
                  </div>
                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                    <input type="tel" name="phone" placeholder="(555) 123-4567" onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Rental Period Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Rental Period</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pickup Date */}
                  <div>
                     <label className="block text-sm font-medium text-gray-600 mb-1">Pickup Date</label>
                    <input type="date" name="pickup" onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
                  </div>
                   {/* Dropoff Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Dropoff Date</label>
                    <input type="date" name="dropoff" onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <button type="submit" className="w-full px-6 py-4 bg-red-600 text-white font-bold text-lg rounded-lg hover:bg-red-700 transition-colors duration-300">
                Confirm & Book
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Booking Summary */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Summary</h2>
            <img src={car.image} alt={`${car.brand} ${car.model}`} className="rounded-lg mb-4 w-full" />
            <h3 className="text-xl font-semibold text-gray-700">{`${car.brand} ${car.model} (${car.year || ''})`}</h3>
            
            <hr className="my-4" />
            
            <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                    <span>Price per day</span>
                    <span>${car.pricePerDay}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Number of days</span>
                    <span>{priceDetails.days}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${priceDetails.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Taxes & Fees (10%)</span>
                    <span>${priceDetails.taxes}</span>
                </div>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-2xl font-bold text-gray-800">
                <span>Total</span>
                <span>${priceDetails.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;