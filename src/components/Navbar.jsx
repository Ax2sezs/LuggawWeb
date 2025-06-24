import React, { useEffect, useRef, useState, memo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Gift, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { to: "/", label: "Home", icon: <Gift className="w-4 h-4 mr-1" /> },
  { to: "/reward", label: "Rewards", icon: <Gift className="w-4 h-4 mr-1" /> },
  { to: "/redeemed", label: "Redeemed", icon: <CheckCircle className="w-4 h-4 mr-1" /> },
];

function HighlightBar({ refs, location }) {
  const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeIndex = navItems.findIndex(
      (item) =>
        item.to === location.pathname ||
        (item.to === "/" && location.pathname === "")
    );

    if (activeIndex === -1) {
      setHighlightStyle({ left: 0, width: 0 });
      return;
    }

    const activeLink = refs.current[activeIndex];
    if (activeLink) {
      const rect = activeLink.getBoundingClientRect();
      const navRect = activeLink.parentElement.getBoundingClientRect();
      setHighlightStyle({
        left: rect.left - navRect.left,
        width: rect.width,
      });
    }
  }, [location, refs]);

  return (
    <motion.div
      className="absolute bottom-1 h-8 rounded-full bg-main-green"
      layout
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{
        width: highlightStyle.width,
        left: highlightStyle.left,
      }}
    />
  );
}

const MemoHighlightBar = memo(HighlightBar);

function NavBar() {
  const location = useLocation();
  const refs = useRef([]);

  const addToRefs = (el) => {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-100 rounded-t-lg shadow-inner p-1 mx-2 mb-2 flex items-center justify-center z-50">
      <MemoHighlightBar refs={refs} location={location} />
      {navItems.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          ref={addToRefs}
          className={({ isActive }) =>
            `relative z-10 flex items-center justify-center flex-1 py-2 px-4 text-sm font-medium rounded-full transition-colors duration-200 ${
              isActive ? "text-white" : "text-gray-700 hover:bg-white"
            }`
          }
        >
          {icon}
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default memo(NavBar);
