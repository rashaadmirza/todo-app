import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex flex-col sm:flex-row sm:justify-between items-center bg-slate-800 text-white p-4 gap-2 sm:gap-0">
      {/* Logo */}
      <div className="logo">
        <h1 className="text-xl font-bold">Todo App</h1>
      </div>

      {/* Nav Links */}
      <ul className="flex flex-col sm:flex-row sm:space-x-4 gap-2 sm:gap-0 items-center">
        <li>
          <Link to="/" className="cursor-pointer px-2 py-1 rounded hover:bg-slate-700 transition-all">
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className="cursor-pointer px-2 py-1 rounded hover:bg-slate-700 transition-all">
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
