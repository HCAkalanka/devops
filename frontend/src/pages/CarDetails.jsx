import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getListing } from '../api/listings';
import { getCar } from '../api/cars';

function CarDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const source = (searchParams.get('source') || 'listing').toLowerCase();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        if (source === 'car') {
          const c = await getCar(id);
          setCar({
            _id: c._id,
            vehicle: {
              type: c.category || 'car',
              brand: c.brand || '',
              model: c.model || '',
              year: c.year || '',
              transmission: c.transmission || 'Automatic',
              fuel: c.fuel_type || 'Petrol',
              seats: c.seating_capacity || 4,
              features: [],
            },
            location: { city: c.location || '' },
            pricing: { pricePerDay: c.pricePerDay || 0 },
            description: c.description || '',
            images: c.image ? [{ url: c.image }] : [{ url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80' }],
            source: 'car',
          });
        } else {
          const l = await getListing(id);
          setCar({
            _id: l._id,
            vehicle: l.vehicle || {},
            location: l.location || {},
            pricing: l.pricing || {},
            description: l.description || '',
            images: Array.isArray(l.images) && l.images.length ? l.images : [{ url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80' }],
            source: 'listing',
          });
        }
      } catch (e) {
        console.error('Failed to load details', e);
        setCar(null);
      }
    })();
  }, [id, source]);

  if (!car)
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-light'>
        <div className='text-center animate-fadeIn'>
          <div className='spinner mx-auto mb-4'></div>
          <p className='text-gray-600 text-lg font-medium'>Loading vehicle details...</p>
        </div>
      </div>
    );

  return (
    <div className='min-h-screen bg-gray-50 animate-fadeIn'>
      {/* Hero Section */}
      <section className='relative h-[320px] bg-gradient-primary flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 bg-black/20'></div>
        <div className='relative z-10 text-center px-4 animate-fadeInUp'>
          <h1 className='text-white text-4xl md:text-5xl font-bold capitalize mb-3'>
            {car?.vehicle?.brand} {car?.vehicle?.model}
          </h1>
          <p className='text-white/90 text-lg'>{car?.vehicle?.type} • {car?.vehicle?.year || 'N/A'}</p>
        </div>
        <div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent'></div>
      </section>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
          {/* Image Gallery - Takes 3 columns */}
          <div className='lg:col-span-3 animate-slideInLeft'>
            <div className={`grid gap-4 ${
              car.images?.length === 1 ? 'grid-cols-1' : 
              car.images?.length === 2 ? 'grid-cols-2' : 
              car.images?.length === 3 ? 'grid-cols-2' : 
              'grid-cols-2'
            }`}>
              {car.images?.slice(0, 4).map((img, idx) => (
                <div 
                  key={idx} 
                  className={`rounded-2xl overflow-hidden shadow-lg hover-lift group ${
                    car.images?.length === 1 ? '' :
                    car.images?.length === 2 ? '' :
                    car.images?.length === 3 && idx === 0 ? 'col-span-2' :
                    car.images?.length >= 4 && idx === 0 ? 'col-span-2' : ''
                  }`}
                >
                  <img 
                    src={img.url} 
                    alt={`${car?.vehicle?.brand} ${car?.vehicle?.model} - Image ${idx + 1}`} 
                    className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                      car.images?.length === 1 ? 'h-[500px]' :
                      idx === 0 ? 'h-[400px]' : 'h-[240px]'
                    }`}
                  />
                </div>
              ))}
            </div>
            {car.images?.length > 4 && (
              <p className='text-center text-gray-500 text-sm mt-4'>
                +{car.images.length - 4} more images
              </p>
            )}
          </div>

          {/* Details Section - Takes 2 columns */}
          <div className='lg:col-span-2 animate-slideInRight'>
          <div className='card p-8 space-y-6'>
            {/* Title Section */}
            <div className='border-b border-gray-200 pb-6'>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2 capitalize'>{car?.vehicle?.brand} {car?.vehicle?.model}</h2>
              <p className='text-gray-600 capitalize flex items-center gap-2 text-lg'>
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
                {car?.vehicle?.type} • {car?.vehicle?.transmission}
              </p>
            </div>

            {/* Price Box - Prominent Display */}
            <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-200 hover-scale'>
              <div className='text-sm text-gray-600 mb-2 font-medium'>Rental Price</div>
              <div className='flex items-baseline gap-2'>
                <span className='text-5xl font-bold text-blue-600'>
                  Rs {new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 }).format(car?.pricing?.pricePerDay || 0)}
                </span>
                <span className='text-xl text-gray-600 font-medium'>/ day</span>
              </div>
            </div>

            {/* Specifications Grid */}
            <div>
              <h3 className='text-lg font-bold text-gray-900 mb-3'>Specifications</h3>
              <div className='grid grid-cols-1 gap-3'>
                <div className='bg-gradient-light p-3 rounded-xl border border-gray-200 hover-scale'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0'>
                      <svg className='w-5 h-5 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <div className='text-xs text-gray-500'>Year</div>
                      <div className='text-base font-bold text-gray-900'>{car?.vehicle?.year || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                <div className='bg-gradient-light p-3 rounded-xl border border-gray-200 hover-scale'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0'>
                      <svg className='w-5 h-5 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 10V3L4 14h7v7l9-11h-7z' />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <div className='text-xs text-gray-500'>Transmission</div>
                      <div className='text-base font-bold text-gray-900'>{car?.vehicle?.transmission}</div>
                    </div>
                  </div>
                </div>

                <div className='bg-gradient-light p-3 rounded-xl border border-gray-200 hover-scale'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0'>
                      <svg className='w-5 h-5 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <div className='text-xs text-gray-500'>Fuel Type</div>
                      <div className='text-base font-bold text-gray-900'>{car?.vehicle?.fuel}</div>
                    </div>
                  </div>
                </div>

                <div className='bg-gradient-light p-3 rounded-xl border border-gray-200 hover-scale'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0'>
                      <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <div className='text-xs text-gray-500'>Seats</div>
                      <div className='text-base font-bold text-gray-900'>{car?.vehicle?.seats || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                {car?.location?.city && (
                  <div className='bg-gradient-light p-3 rounded-xl border border-gray-200 hover-scale'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0'>
                        <svg className='w-5 h-5 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                        </svg>
                      </div>
                      <div className='flex-1'>
                        <div className='text-xs text-gray-500'>Location</div>
                        <div className='text-base font-bold text-gray-900'>{car.location.city}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            {car?.vehicle?.features && car.vehicle.features.length > 0 && (
              <div>
                <h3 className='text-xl font-bold text-gray-900 mb-4'>Features</h3>
                <div className='flex flex-wrap gap-2'>
                  {car.vehicle.features.map((feature, idx) => (
                    <span 
                      key={idx} 
                      className='px-4 py-2 rounded-full bg-white border-2 border-blue-200 text-gray-700 text-sm font-medium hover-scale animate-fadeIn shadow-sm'
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      ✓ {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {car?.description && (
              <div className='bg-gray-50 p-6 rounded-xl border border-gray-200'>
                <h3 className='text-xl font-bold text-gray-900 mb-3 flex items-center gap-2'>
                  <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  Description
                </h3>
                <p className='text-gray-600 leading-relaxed'>{car.description}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex flex-wrap gap-3 pt-4'>
              <button 
                onClick={() => navigate(`/booking/${car._id}?source=${source}`)} 
                className='flex-1 btn-secondary py-4 text-lg font-semibold shadow-lg hover:shadow-xl'
              >
                Book Now
              </button>
              <button 
                onClick={() => navigate(-1)} 
                className='px-8 py-4 rounded-xl border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 font-semibold transition-all hover-scale bg-white'
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default CarDetails;
