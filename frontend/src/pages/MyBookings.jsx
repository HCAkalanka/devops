import { useEffect, useState } from 'react';
import { listMyBookings, cancelBooking } from '../api/bookings';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Car } from 'lucide-react';

function MyBookings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await listMyBookings();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      setCancellingId(id);
      await cancelBooking(id);
      await load();
    } catch (e) {
      alert('Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
      completed: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    
    const icons = {
      confirmed: <CheckCircle className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
        {icons[status] || icons.pending}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex gap-6">
                  <div className="w-48 h-32 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-700 font-medium">{error}</p>
            <button onClick={load} className="mt-4 btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-primary py-16 mb-8 animate-fadeInUp">
        <div className="max-w-6xl mx-auto px-6 md:px-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            My Bookings
          </h1>
          <p className="text-white/90 text-lg">Manage and track your car rental reservations</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-10 pb-12">

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="card-elevated p-6 rounded-2xl hover-lift">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{items.length}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
            </div>
          </div>
          <div className="glass p-4 rounded-xl hover-scale">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {items.filter(b => b.status === 'confirmed').length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>
          </div>
          <div className="glass p-4 rounded-xl hover-scale">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {items.filter(b => b.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-elevated rounded-2xl p-12 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
              <Car className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Start exploring and book your perfect car!</p>
            <a href="/cars" className="btn-primary inline-block">
              Browse Cars
            </a>
          </motion.div>
        )}

        {/* Bookings List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {items.map((booking, index) => {
              const image = (booking.listing?.images && booking.listing.images[0]?.url) || 
                           'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&q=80';
              const title = booking.listing?.title || 
                           `${booking.listing?.vehicle?.brand || 'Car'} ${booking.listing?.vehicle?.model || ''}`;
              const duration = calculateDuration(booking.dateRange?.start, booking.dateRange?.end);

              return (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="card hover-lift overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row gap-6 p-6">
                    {/* Image */}
                    <div className="relative w-full md:w-56 h-48 md:h-40 shrink-0 rounded-xl overflow-hidden group">
                      <img 
                        src={image} 
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                      />
                      <div className="absolute top-3 right-3">
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                          {title}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          {/* Date Range */}
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                              <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Rental Period</div>
                              <div className="text-sm font-medium">
                                {formatDate(booking.dateRange?.start)} → {formatDate(booking.dateRange?.end)}
                              </div>
                            </div>
                          </div>

                          {/* Duration */}
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                              <Clock className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Duration</div>
                              <div className="text-sm font-medium">
                                {duration} {duration === 1 ? 'Day' : 'Days'}
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          {booking.listing?.location?.city && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Location</div>
                                <div className="text-sm font-medium">{booking.listing.location.city}</div>
                              </div>
                            </div>
                          )}

                          {/* Total Price */}
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                              <DollarSign className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Total Amount</div>
                              <div className="text-lg font-bold text-gray-900">
                                LKR {(booking.pricingSnapshot?.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                        <a 
                          href={`/cars/${booking.listing?._id}`}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium hover:shadow-lg transition-all hover-scale"
                        >
                          View Details
                        </a>
                        
                        {booking.status === 'confirmed' && (
                          <button 
                            onClick={() => onCancel(booking._id)}
                            disabled={cancellingId === booking._id}
                            className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                          </button>
                        )}

                        {booking.status === 'cancelled' && (
                          <button 
                            onClick={load}
                            className="px-4 py-2 rounded-lg border border-blue-200 text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors"
                          >
                            Book Again
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default MyBookings;
