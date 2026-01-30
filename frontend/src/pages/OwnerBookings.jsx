import { useEffect, useState } from 'react';
import api from '../api/http';
import { Calendar, User, Phone, Mail, DollarSign, Car, Clock } from 'lucide-react';

function OwnerBookings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get('/bookings/owner');
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setError('Failed to load owner bookings');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatCurrency = (amount) => {
    try {
      return new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 }).format(amount || 0);
    } catch {
      return (amount || 0).toLocaleString();
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      expired: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.toUpperCase() || 'UNKNOWN'}
      </span>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-light">
      <div className="text-center animate-fadeIn">
        <div className="spinner mx-auto mb-4"></div>
        <div className="text-gray-600 text-lg font-medium">Loading bookings...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-light py-10 animate-fadeIn">
      <div className="max-w-5xl mx-auto px-6">
        <div className="card p-6 border-red-200 bg-red-50 text-red-700 animate-scaleIn">
          <h3 className="font-semibold text-lg mb-2">Error Loading Bookings</h3>
          <p>{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-primary py-16 mb-8 animate-fadeInUp">
        <div className="max-w-6xl mx-auto px-6 md:px-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Owner Bookings
          </h1>
          <p className="text-white/90 text-lg">Track and manage bookings for your listed vehicles</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-10 pb-12">

        {items.length === 0 && (
          <div className="card-elevated p-12 text-center animate-scaleIn">
            <Car size={64} className="mx-auto text-gray-300 mb-4 animate-bounce-subtle" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings yet</h3>
            <p className="text-gray-500 text-lg">When customers book your vehicles, they'll appear here.</p>
          </div>
        )}

        <div className="grid gap-6">
          {items.map((b, index) => (
            <div
              key={b._id}
              className="card p-6 hover-lift animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Vehicle Image */}
                <div className="md:w-56 shrink-0 group overflow-hidden rounded-xl">
                  <img
                    src={
                      (b.listing?.images && b.listing.images[0]?.url) ||
                      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&q=60'
                    }
                    alt="Vehicle"
                    className="w-full h-40 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Booking Details */}
                <div className="flex-1 space-y-5">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {b.listing?.title || `${b.listing?.vehicle?.brand || ''} ${b.listing?.vehicle?.model || ''}`}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
                        {b.listing?.vehicle?.type} • {b.listing?.vehicle?.transmission}
                      </p>
                    </div>
                    {getStatusBadge(b.status)}
                  </div>

                  {/* Booking Info Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Dates */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-700">Rental Period:</span>
                      </div>
                      <div className="text-sm text-gray-600 ml-6">
                        {new Date(b.dateRange?.start).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        →{' '}
                        {new Date(b.dateRange?.end).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-xs text-gray-500 ml-6">
                        {b.pricingSnapshot?.days || 0} day{b.pricingSnapshot?.days !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-700">Payment:</span>
                      </div>
                      <div className="text-sm text-gray-600 ml-6">
                        <div>Rs {formatCurrency(b.pricingSnapshot?.pricePerDay)}/day × {b.pricingSnapshot?.days} days</div>
                        <div className="text-lg font-semibold text-green-600 mt-1">
                          Total: Rs {formatCurrency(b.pricingSnapshot?.total)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Renter Contact Info */}
                  <div className="border-t border-gray-200 pt-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
                      <User size={18} className="text-blue-600" />
                      Renter Information
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 text-sm hover-scale">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                          <User size={16} className="text-purple-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Name</div>
                          <span className="font-semibold text-gray-900">{b.contact?.name || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm hover-scale">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                          <Phone size={16} className="text-green-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Phone</div>
                          <a href={`tel:${b.contact?.phone}`} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                            {b.contact?.phone || 'N/A'}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm hover-scale">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                          <Mail size={16} className="text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500">Email</div>
                          <a href={`mailto:${b.contact?.email}`} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors truncate block">
                            {b.contact?.email || 'N/A'}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 pt-4 border-t border-gray-200">
                    <Clock size={14} className="text-blue-600" />
                    <span>Booked on {new Date(b.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OwnerBookings;
