// src/components/Auth.jsx
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";

export default function Auth({ onUserChange }) {

  // Google login
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onUserChange(result.user);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="auth-container flex flex-col gap-4 max-w-sm w-full p-6 border rounded shadow-md bg-white">
        <h2 className="text-xl font-semibold text-center">Authentication</h2>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleLogin}
          className="flex justify-center items-center gap-2 border border-gray-300 hover:bg-gray-100 py-2 rounded transition-colors"
        >
          <FaGoogle className="text-red-500" />
          Sign in with Google
        </button>
      </div>
    </div>
  );

}
