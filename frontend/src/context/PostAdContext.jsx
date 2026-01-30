import React, { createContext, useContext, useState, useCallback } from 'react';

const PostAdContext = createContext();

export const PostAdProvider = ({ children }) => {
  const [step, setStep] = useState(0); // 0..6
  const [draft, setDraft] = useState({
    title: '',
    vehicle: { type: 'car', brand: '', model: '', year: '', seats: '', transmission: 'Automatic', fuel: 'Petrol', features: [] },
    location: { city: '', address: '' },
    pricing: { pricePerDay: '', deposit: '' },
    description: '',
    images: [],
  });

  const next = useCallback(() => setStep(s => Math.min(s + 1, 6)), []);
  const prev = useCallback(() => setStep(s => Math.max(s - 1, 0)), []);

  return (
    <PostAdContext.Provider value={{ step, setStep, draft, setDraft, next, prev }}>
      {children}
    </PostAdContext.Provider>
  );
};

export const usePostAd = () => useContext(PostAdContext);
