import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "error"
      ? "bg-red-500"
      : type === "success"
      ? "bg-green-500"
      : "bg-blue-500";

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-5 right-5 z-50 p-4 rounded shadow-lg text-white ${bgColor} daisyui-toast`}
          role="alert"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
