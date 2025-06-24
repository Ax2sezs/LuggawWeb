import React from "react";
import Login from "./Login";

export default function LoginScreen({ error }) {
  return (
    <div className="bg-sub-brown shadow-lg w-full text-center bg-grid-pattern min-h-screen flex flex-col justify-center items-center">
      <img src="./logo.png" className="w-1/2 h-full" alt="Logo" />
      <Login />
      {error && <h1 className="text-red-600 text-xl font-semibold mt-4">{error}</h1>}
    </div>
  );
}
