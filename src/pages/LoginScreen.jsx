import React from "react";
import Login from "./Login";

export default function LoginScreen({ error }) {
  return (
    <div className="bg-sub-brown shadow-lg w-full text-center bg-grid-pattern min-h-screen flex flex-col justify-center items-center px-4">
      <div className="flex flex-col items-center justify-center w-full max-w-md space-y-6">

        {/* Logo */}
        <img src="./logo.png" className="w-1/2 h-auto object-contain" alt="Logo" />

        {/* Login Form */}
        <Login />

        {/* Error Message */}
        {error && (
          <h1 className="text-red-600 text-xl font-semibold mt-2">{error}</h1>
        )}
      
      </div>
    </div>
  );
}
