import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Auth from "./components/Auth.jsx";

function App() {
  const [user, setUser] = useState(null); // logged-in user

  return (
    <>
      {!user ? (
        // Show auth page if not logged in
        <Auth onUserChange={setUser} />
      ) : (
        <>
          <Navbar user={user} />
          <div className="container mx-auto mt-8">
            {/* Show app routes if logged in */}
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </>
      )}
    </>
  );
}

export default App;
