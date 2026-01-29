import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
  return (
    <nav className="flex justify-between bg-slate-800 text-white p-4">
      <div className="logo">
        <h1 className="text-lg font-bold">Todo App</h1>
      </div>
      <ul className="flex space-x-4 items-center">
        <li>
          <Link
            to="/"
            className="hover:font-bold transition-all"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className="hover:font-bold transition-all"
          >
            About
          </Link>
        </li>

        {/* Show user info if logged in */}
        {user && (
          <li className="ml-4">
            Hello, {user.displayName || user.email}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
