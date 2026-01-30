import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./component/navbar";
import Footer from "./component/Footer";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import MyBookings from "./pages/MyBookings";
import OwnerBookings from "./pages/OwnerBookings";
import PostAd from "./pages/PostAd/PostAd";
import { PostAdProvider } from "./context/PostAdContext";
import Booking from "./pages/Booking";

import Login from "./component/Login";


function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [authed, setAuthed] = useState(() => !!(typeof window !== 'undefined' && localStorage.getItem('token')));

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthed(!!token);
  }, []);

  const handleAuth = (token) => {
    if (token) {
      localStorage.setItem('token', token);
      setAuthed(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthed(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar setShowLogin={setShowLogin} authed={authed} onLogout={handleLogout} />
      <Login showLogin={showLogin} setShowLogin={setShowLogin} onAuth={handleAuth} />
      <main className="flex-1">
        <PostAdProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/cardetails/:id" element={<CarDetails />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/post" element={<PostAd />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/owner-bookings" element={<OwnerBookings />} />
            {/* Optional: route that also opens the modal */}
            <Route path="/login" element={<Login showLogin={true} setShowLogin={setShowLogin} onAuth={handleAuth} />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </PostAdProvider>
      </main>
      <Footer />
    </div>
  );
}

export default App;
